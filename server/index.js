require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');
const pg = require('pg');
const argon2 = require('argon2');
const authorizationMiddleware = require('./authorization-middleware');
const jwt = require('jsonwebtoken');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(express.json());
app.use(staticMiddleware);

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password, name } = req.body;
  if (!username || !password || !name) {
    throw new ClientError(400, 'username, password, and name are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
      insert into "users" ("username", "hashedPassword", "name")
      values ($1, $2, $3)
      on conflict ("username")
      do nothing
      returning "userId", "username", "name"
      `;
      const params = [username, hashedPassword, name];
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(409, 'username exists');
      } else {
        res.status(201).json(user);
      }
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.post('/api/saveBooks', (req, res, next) => {
  const { userId } = req.user;
  let {
    googleId, title, author, publishedYear, isbn, coverImgURL, quote = '',
    completedAt = null, description = null, quotePageNumber = null
  } = req.body;

  if (author === '') {
    author = null;
  }

  if (!googleId || !title || !publishedYear || !isbn || !coverImgURL) {
    throw new ClientError(
      400,
      'googleId, title, publishedYear, isbn, coverImgURL are required fields');
  }

  const sqlGetBookId = `
    select "bookId"
    from "books"
    where "googleId"= $1
  `;
  const paramsGetBookId = [googleId];

  const sqlsaveBook = `
    insert into "books"("googleId", "title", "author", "description", "publishedYear", "isbn", "coverImgURL")
    values ($1, $2, $3, $4, $5, $6, $7)
    returning *
    `;
  const paramsSaveBook = [googleId, title, author, description, publishedYear, isbn, coverImgURL];

  const sqlLibrary = `
      insert into "library" ("bookId", "userId",  "completedAt")
      values ($1, $2, $3)
      on conflict ("userId", "bookId")
      do nothing
      returning*
      `;

  const sqlQuote = `
    insert into "quotes" ("userId", "bookId", "quote", "pageNumber")
    values ($1, $2, $3, $4)
    returning *
    `
    ;

  db.query(sqlGetBookId, paramsGetBookId)
    .then(resultingBook => {
      if (resultingBook.rows.length) return resultingBook.rows[0].bookId;
      return db
        .query(sqlsaveBook, paramsSaveBook)
        .then(result => {
          const [savedBook] = result.rows;
          return savedBook.bookId;
        });
    })
    .then(bookId => {
      const paramsLibrary = [Number(bookId), userId, completedAt];
      return db
        .query(sqlLibrary, paramsLibrary)
        .then(result => result.rows);
    })
    .then(result => {
      if (quote !== '') {
        const paramsQuote = [userId, Number(result[0].bookId), quote, quotePageNumber];
        return db
          .query(sqlQuote, paramsQuote)
          .then(result => result.rows);
      } else return result;
    })
    .then(result => res.status(201).json(result))
    .catch(err => next(err));
});

app.get('/api/getAllBooks', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
  select *
  from "books"
  join "library" using ("bookId")
  where "userId" = $1
  order by "savedAt" desc
  `;

  const params = [userId];

  db.query(sql, params)
    .then(result => res.status(201).json(result.rows))
    .catch(err => next(err));
});

app.get('/api/getRecentBooks', (req, res, next) => {
  const { userId } = req.user;

  const sqlRecentBooks = `
  with "read" as (
  select *
    from "books"
  join "library" using("bookId")
  where "library"."userId" = $1 and
        "library"."completedAt" is not NULL
  order by "library"."completedAt" desc
  limit 5
  ), "unread" as (
    select *
    from "books"
  join "library" using("bookId")
  where "library"."userId" = $1 and
        "library"."completedAt" is NULL
  order by "library"."savedAt" desc
  limit 5
  )

  select *
    from "read"
  union
  select *
    from "unread"
  order by "completedAt",
  "savedAt" desc
  `;

  const paramsRecentBooks = [userId];

  db.query(sqlRecentBooks, paramsRecentBooks)
    .then(result => res.status(201).json(result.rows))
    .catch(err => next(err));
});

app.get('/api/getQuotes', (req, res, next) => {
  const { userId } = req.user;
  const sqlGetQuotes = `
  select "quote",
        "pageNumber",
        "title",
        "author"
    from "quotes"
    join "books" using ("bookId")
    where "userId" = $1
    order by "quotedAt" desc
  `;
  const paramsGetQuotes = [userId];

  db.query(sqlGetQuotes, paramsGetQuotes)
    .then(result => res.status(201).json(result.rows))
    .catch(err => next(err));
});

app.put('/api/editEntry/:id', (req, res, next) => {
  //
});

app.delete('/api/deleteEntry/:bookId', (req, res, next) => {
  // console.log(req.params);
  const bookId = Number(req.params.bookId);
  const { userId } = req.user;

  if (!bookId) {
    throw new ClientError(401, 'Please include a valid bookId');
  }

  const sqlLibrary = `
  delete from "library"
  where "bookId" = $1
  and "userId" = $2
  `;

  const paramsLibrary = [bookId, userId];

  const sqlQuote = `
    delete from "quotes"
    where "bookId"= $1
    and "userId" = $2
    `;

  const paramsQuote = [bookId, userId];

  db.query(sqlLibrary, paramsLibrary)
    .then(result => {
      return db
        .query(sqlQuote, paramsQuote)
        .then(result => {
          const data = result.rows[0]; // is this line necessary? Try removing it and see what happens
          res.status(201).json(data);
        })
        .catch(err => next(err));
    });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
