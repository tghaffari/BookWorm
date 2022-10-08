import React from 'react';
import AppContext from '../lib/app-context';

export default class AuthBackround extends React.Component {

  render() {
    const { user } = this.context;
    if (user) return null;
    return <div className='auth-background'></div>;
  }
}

AuthBackround.contextType = AppContext;
