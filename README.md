# BookWorm

A full stack JavaScript application for bookworms that want to keep track of what books they're reading and want to read.

## Why I Built This

As someone who likes to read, I wanted an easy way to keep track of what's on my bookshelf.

## Technologies Used

- React.js
- Webpack
- Babel
- Express
- Node.js
- GoogleBooks API [https://developers.google.com/books]
- PostgreSQL
- HTML5
- CSS3
- Pgweb
- Dokku
- AWS EC2

## Live Demo

Try the application live at [https://bookworm.tarraghaffari.net/]

## Features

- User can sign-up, sign-in, and sign-out
- User can search for books that they may be interested in reading or have previously read.
- User can save books to their library and decide if they want to save it to their read bookshelf or to-read bookshelf. If saved to their read bookshelf, user can enter a completed date.
- User can view the books saved to their library.
- User can view their recently saved books on their home screen.
- User can save a quote from their finished books.
- User can view all saved quotes.

## Preview

![BookWorm Demo](assets/bookworm-demo.gif)

## Features in Development

- User can edit their book entries.
- User can delete books from their library.
- User can sort their library by bookshelf (view each bookshelf separately).
- User can choose search parameters (title, author, subject, etc.)

## Development

### System Requirements

- Node.js 10 or higher
- NPM 6 or higher
- PostgreSQL 15 or higher

### Getting Started

1. Obtain an API key from Google to access the Google Books API [https://console.cloud.google.com/apis/credentials].

2. Clone the repository.

    ```shell
    git clone https://github.com/tghaffari/bookworm.git
    cd bookworm
    ```

3. Install all dependencies with NPM.

    ```shell
    npm install
    ```

4. Make a copy of .env.example named .env and set your API key, token secret, database url, guest username, and guest password.

    ```shell
    cp .env.example .env
    ```

5. Start PostgreSQL

    ```shell
    sudo service postgresql start
    ```

6. Create a new database with PostgreSQL.

   ```shell
    createdb bookworm
    ```

7. Import the database to PostgreSQL

    ```shell
    npm run db:import
    ```

8. Start the project. Once started you can view the application by opening http://localhost:3000 in your browser.

    ```shell
    npm run dev
    ```
