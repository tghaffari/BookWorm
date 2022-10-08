import React from 'react';
import AuthForm from '../components/auth-form';
import AppContext from '../lib/app-context';

export default class AuthPage extends React.Component {
  render() {
    const { route, handleSignIn } = this.context;

    const welcomeMessage = (route.path === 'sign-in')
      ? 'Please sign-in to access your library'
      : 'Join BookWorm to create your own customized library!';

    return (
      <>
        <div className='row auth-top-padding'>
          <div className='column-full text-align-center'>
            <img className='auth-logo' src='/images/Bookworm-logo.png'></img>
            <h1 className='auth-title'>BookWorm</h1>
            <p className='auth-welcome-message'> {welcomeMessage} </p>
          </div>
        </div>
        <div className='display-flex justify-content-center'>
          <AuthForm
          key={route.path}
          action={route.path}
          onSignIn={handleSignIn} />
        </div>
      </>

    );
  }
}

AuthPage.contextType = AppContext;
