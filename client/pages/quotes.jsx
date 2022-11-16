import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class Quotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quotes: null
    };
  }

  componentDidMount() {
    const token = window.localStorage.getItem('bookWorm-jwt');
    const init = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': `${token}`
      }
    };

    fetch('/api/getQuotes', init)
      .then(res => res.json())
      .then(quotes => this.setState({ quotes }))
      .catch(err => {
        console.error(err);
        if (this.context.user) window.alert('Sorry, we are unable to retrieve your quotes at this time. Please check your internet connection and try again later.');
      });
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    if (this.state.quotes === null) return null;

    if (this.state.quotes.length === 0) {
      return (
        <>
          <h1 className='favorite-quotes-heading'>Favorite Quotes</h1>
          <p className='no-quotes-placeholder-text'> You have no quotes saved. Start saving books and quotes by clicking search.</p>
        </>
      );
    }

    const quotes = this.state.quotes.map(quotes => {

      const { quote, author, title, pageNumber } = quotes;
      return (
        <li key={pageNumber}>
          <p className='quote'> &quot;{quote}&quot;</p>
          <p className='quote-details'>- {author},
            <em> {title}, pg. {pageNumber}
            </em>
          </p>
        </li>
      );
    });

    return (
      <>
        <h1 className='favorite-quotes-heading'>Favorite Quotes</h1>
        <ul className='quotes-list'>
          {quotes}
        </ul>
      </>
    );
  }
}

Quotes.contextType = AppContext;
