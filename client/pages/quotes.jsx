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
      .then(quotes => {
        // console.log('quotes:', quotes);
        this.setState({ quotes });
      })
      .catch(err => {
        console.error(err);
        if (this.context.user) window.alert('Sorry, we are unable to retrieve your quotes at this time. Please check your internet connection and try again later.');
      });
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    if (this.state.myBooks === null) return null;
  }

}

Quotes.contextType = AppContext;
