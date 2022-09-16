require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');
const pg = require('pg');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(express.json());
app.use(staticMiddleware);

app.get('/api/hello', (req, res) => {
  res.json({ hello: 'world' });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});

app.post('/api/saveBooks', (req, res, next) => {
  const { googleId, title, author, description, publishedDate, isbn, coverImgURL } = req.body;
  if (!googleId || !title || !author || !description || !publishedDate || !isbn || !coverImgURL) {
    throw new ClientError(
      400,
      'googleId, title, author, description, publishedDate, isbn, coverImgURL are required fields');
  }

  let bookId = null;

  const sqlGetBookId = `
    select *
    from "books"
    where "isbn"= $1
  `;
  const paramsGetBookId = [isbn];

  db.query(sqlGetBookId, paramsGetBookId)
    .then(resultingBook => {
      const [book] = resultingBook.rows;
      if (book) {
        bookId = book.bookId;
        res.status(201).json(book);
      } else {
        const sqlsaveBook = `
          insert into "books"("googleId", "title", "author", "description", "publishedDate", "isbn", "coverImgURL")
          values ($1, $2, $3, $4, $5, $6, $7)
          returning *
        `;
        const paramsSaveBook = [googleId, title, author, description, publishedDate, isbn, coverImgURL];

        db.query(sqlsaveBook, paramsSaveBook)
          .then(result => {
            const [savedBook] = result.rows;
            bookId = savedBook.bookId;
            res.status(201).json(savedBook);
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));

}
);
