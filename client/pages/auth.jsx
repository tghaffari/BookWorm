import React from 'react';
import AuthForm from '../components/auth-form';

export default class AuthPage extends React.Component {
  render() {
    const route = this.props.path;

    const welcomeMessage = 'Join BookWorm to create your own customized library!';

    return (
      <>
        <div className='row auth-top-padding'>
          <div className='column-full text-align-center'>
            <img className='auth-logo' src='/images/Bookworm-logo.png'></img>
            <h1 className='auth-title'>BookWorm</h1>
            <p className='auth-welcome-message'> {welcomeMessage} </p>
          </div>
        </div>
        <div>
          <AuthForm key={route} />
        </div>
      </>

    );
  }
}
