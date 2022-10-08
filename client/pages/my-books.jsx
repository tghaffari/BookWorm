import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class MyBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myBooks: null
    };
  }

  formatDate(date) {
    const year = date.slice(0, 4);
    const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const month = monthArray[Number(date.slice(5, 7)) - 1];
    const day = date.slice(8, 10);
    const reformattedDate = `${month} ${day}, ${year}`;
    return reformattedDate;
  }

  componentDidMount() {
    const { token } = this.context;
    const init = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': `${token}`
      }
    };

    fetch('/api/getAllBooks', init)
      .then(res => res.json())
      .then(books => this.setState({ myBooks: books }))
      .catch(err => console.error(err));
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-up" />;

    if (this.state.myBooks === null) return null;

    if (this.state.myBooks.length === 0) {
      return (
        <>
        <h1 className='my-books-heading'>My Books</h1>
          <p className='no-books-text'>No books have been saved. Click search to start your next reading adventure!</p>
          <img src="/images/up-arrow.png" className='arrow-image-mobile'></img>
          <img src="/images/Curved-Arrow-right.png" className='arrow-image-desktop'></img>
        </>
      );
    }
    const books = this.state.myBooks.map(book => {
      const completedDate = (book.completedAt)
        ? (
        <>
          <p className='library-bookshelf-details'>Bookshelf: Read</p>
          <p className='library-date-completed'> Date Completed: {this.formatDate(book.completedAt)}</p>
        </>
          )
        : (
          <>
            <p className='library-bookshelf-details'>Bookshelf: To-Read</p>
            <p className='library-not-completed'> Not yet completed</p>
          </>
          );

      return (
        <>
          <li className='column-one-half column-full my-books-list-items' data-id={book.bookId} key={book.googleId}>
              <div className='row jusitfy-content-center'>
                <div className='column-flex'>
                  <img className='library-cover-img' src={book.coverImgURL} />
                </div>
                <div className='column-flex library-books-detail-padding'>
                  <p className='library-book-title'> {book.title}</p>
                  <p className='library-author-date'> {book.author}   &#8226;   {book.publishedYear}</p>
                  {completedDate}
                </div>
            </div>
          </li>
        </>
      );
    });

    return (
      <>
        <h1 className='my-books-heading'>My Books</h1>
        <ul className='library-books-list'>
          {books}
        </ul>
    </>

    );
  }
}

MyBooks.contextType = AppContext;
