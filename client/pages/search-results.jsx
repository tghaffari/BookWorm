import React from 'react';
import parseRoute from '../lib/parse-route';
import BookEntryDetailsModal from '../components/book-entry-details';
import RenderSearchResults from '../components/render-search-results';
import LoadingSpinner from '../components/loading-spinner';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    const startValue = this.formatSearchResults();
    this.state = {
      searchValue: startValue,
      isLoading: true,
      results: [],
      showModal: false,
      selectedBook: null
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchSearchResults = this.fetchSearchResults.bind(this);
    this.handleAddToLibrary = this.handleAddToLibrary.bind(this);
    this.closeBookDetailsModal = this.closeBookDetailsModal.bind(this);
  }

  handleInputChange(event) {
    this.setState({ searchValue: event.target.value });
  }

  formatSearchResults() {
    const paramString = this.props.params.toString();
    const query = decodeURIComponent(paramString.slice(2)).replaceAll('+', ' ');
    return query;
  }

  handleSubmit(event) {
    event.preventDefault();
    const query = this.state.searchValue.replaceAll(' ', '+');
    window.location.hash = (`search?q=${query}`);
    return null;
  }

  fetchSearchResults() {
    this.setState({ isLoading: true });
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${this.props.params.toString()}&maxResults=20&key=${process.env.API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if (data.totalItems === 0) {
          this.setState({
            isLoading: false,
            results: null
          });
        } else {
          this.setState({
            isLoading: false,
            results: data.items
          });
        }
      })
      .catch(err => {
        console.error(err);
        window.alert('Sorry, there was a problem connecting to the network! Please check your internet connection and try again later.');
      }
      );
  }

  saveBook(bookDetails) {
    const token = window.localStorage.getItem('bookWorm-jwt');

    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': `${token}`
      },
      body: JSON.stringify(bookDetails)
    };

    fetch('/api/saveBooks', init)
      .catch(err => {
        console.error(err);
        window.alert('Sorry, we were unable to process your request at this time. Please try again later.');
      });
  }

  handleAddToLibrary(event) {
    const closestLi = event.target.closest('li');
    const id = closestLi.getAttribute('data-id');
    const book = this.state.results.find(result => result.id === id);

    const author = book.volumeInfo.authors?.join(', ') ?? '';
    const publishedYear = book.volumeInfo.publishedDate?.slice(0, 4) ?? '';
    const src = book.volumeInfo.imageLinks?.thumbnail ?? 'https://fivebooks.com/app/uploads/2010/09/no_book_cover.jpg';

    const bookDetails = {
      googleId: book.id,
      title: book.volumeInfo.title,
      author,
      description: book.volumeInfo.description,
      publishedYear,
      isbn: book.volumeInfo.industryIdentifiers[1].identifier,
      coverImgURL: src
    };

    if (event.target.value === 'to-read') {
      this.saveBook(bookDetails);

    } else if (event.target.value === 'read') {
      this.setState({
        showModal: true,
        selectedBook: bookDetails
      });
    }
  }

  closeBookDetailsModal() {
    this.setState({ showModal: false });
  }

  componentDidMount() {
    this.fetchSearchResults();
  }

  componentDidUpdate(prevProps) {
    if (!this.context.user) return <Redirect to="sign-in" />;

    const currentURL = new URL(window.location);
    const parsedURL = parseRoute(currentURL.hash);
    const currentParams = parsedURL.params.toString();
    const prevParams = prevProps.params.toString();

    if (prevParams !== currentParams) {
      this.fetchSearchResults();
      this.setState({
        searchValue: this.formatSearchResults()
      });
    }
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    const searchResults = (this.state.results === null)
      ? <p className='no-books-search'>Sorry, no results were found. Please try again.</p>
      : this.state.results.map((results, index) => {
        return <RenderSearchResults results={results} addToLibrary = {this.handleAddToLibrary} key={results.id}/>;
      });

    return (
      <>
        <LoadingSpinner isLoading={this.state.isLoading} />
        <h1 className='search-heading'>Search</h1>
        <form onSubmit={this.handleSubmit}>
          <input
          className='search-bar'
          type='search'
          placeholder='Search books...'
          value={this.state.searchValue}
          onChange={this.handleInputChange}>
          </input>
        </form>
        <ul className='search-results-ul'>
          {searchResults}
        </ul>
        {this.state.showModal && <BookEntryDetailsModal book = {this.state.selectedBook} closeModal={this.closeBookDetailsModal} saveBook = {this.saveBook}/>}
      </>
    );
  }
}

SearchResults.contextType = AppContext;
