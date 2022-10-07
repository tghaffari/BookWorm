require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');
const pg = require('pg');
const argon2 = require('argon2');
const authorizationMiddleware = require('./authorization-middleware');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(express.json());
app.use(staticMiddleware);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});

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

app.use(authorizationMiddleware);

app.post('/api/saveBooks', (req, res, next) => {
  const { googleId, title, author, publishedYear, isbn, coverImgURL, completedAt = null, description = null } = req.body;

  if (!googleId || !title || !author || !publishedYear || !isbn || !coverImgURL) {
    throw new ClientError(
      400,
      'googleId, title, author, publishedYear, isbn, coverImgURL are required fields');
  }

  const sqlGetBookId = `
    select "bookId"
    from "books"
    where "isbn"= $1
  `;
  const paramsGetBookId = [isbn];

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
      const paramsLibrary = [Number(bookId), 1, completedAt];
      return db
        .query(sqlLibrary, paramsLibrary)
        .then(result => result.rows);
    })
    .then(result => res.status(201).json(result))
    .catch(err => next(err));
});

app.get('/api/getAllBooks', (req, res, next) => {
  const sql = `
  select *
  from "books"
  join "library" using ("bookId")
  where "userId" = 1
  order by "savedAt" desc
  `;

  db.query(sql)
    .then(result => res.status(201).json(result.rows))
    .catch(err => next(err));
});

app.get('/api/getRecentBooks', (req, res, next) => {
  const sqlRecentBooks = `
  with "read" as (
  select *
    from "books"
  join "library" using("bookId")
  where "library"."userId" = 1 and
        "library"."completedAt" is not NULL
  order by "library"."completedAt" desc
  limit 5
  ), "unread" as (
    select *
    from "books"
  join "library" using("bookId")
  where "library"."userId" = 1 and
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

  db.query(sqlRecentBooks)
    .then(result => res.status(201).json(result.rows))
    .catch(err => next(err));
});
