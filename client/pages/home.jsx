import React from 'react';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readBooks: null,
      unreadBooks: null
    };
    this.getRecentBooks = this.getRecentBooks.bind(this);
  }

  getRecentBooks() {
    fetch('/api/getRecentBooks')
      .then(res => res.json())
      .then(books => {
        const readBooks = [];
        const unreadBooks = [];
        books.forEach(book => {
          if (book.completedAt !== null) {
            readBooks.unshift(book);
          } else {
            unreadBooks.unshift(book);
          }
        });

        this.setState({ readBooks, unreadBooks });
      })
      .catch(err => console.error(err));
  }

  componentDidMount() {
    this.getRecentBooks();
  }

  render() {
    if (this.state.readBooks === null && this.state.unreadBooks === null) {
      return null;
    }

    const readBookCovers = this.state.readBooks.map(book => {
      return (
        <li className='column-flex cover-li' key={book.googlId}>
          <img className='home-cover-img' src={book.coverImgURL} />
        </li>
      );
    });

    const unreadBookCovers = this.state.unreadBooks.map(book => {
      console.log(book);
      return (
        <li className='column-flex cover-li' key={book.googlId}>
          <img className='home-cover-img' src={book.coverImgURL} />
        </li>
      );
    });

    return (
      <>

      <div className='row text-align-center'>
        <div className='column-full'>
            <a href='#library'><h1 className='home-read-shelf-title'>Read Bookshelf</h1></a>
        </div>
      </div>

        <div className='row'>
          <div className='column-full'>
            <ul className='row read-shelf-list justify-content-evenly'>
              {readBookCovers}
            </ul>
            <div className='row text-align-center'>
              <div className='column-full'>
                <img src='/images/shelf.png' className='read-shelf'></img>
              </div>
            </div>
          </div>
        </div>

      <div className='row text-align-center'>
        <div className='column-full'>
          <a href='#library'><h1 className='home-to-read-shelf-title'>To-Read Bookshelf</h1></a>
        </div>
      </div>

      <div className='row'>
        <div className='column-full'>
          <ul className='row to-read-shelf-list justify-content-evenly'>
            {unreadBookCovers}
          </ul>
          <div className='row text-align-center'>
            <div className='column-full'>
              <img src='/images/shelf.png' className='to-read-shelf'></img>
            </div>
          </div>
        </div>
      </div>

      </>

    );
  }
}

// Start adding books to your bookshelf!
