import React from 'react';
import handleFetchRejection from '../lib/handle-fetch-rejection.js';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      name: '',
      validUsername: null,
      validPassword: false,
      loginError: null
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGuestLogin = this.handleGuestLogin.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      validUsername: null,
      loginError: null
    });
  }

  handlePasswordInput(event) {
    const { value } = event.target;

    this.setState({
      password: value,
      loginError: null
    });

    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;
    const symbols = /[!@#$%&*.]/g;

    if (value.match(lowerCaseLetters) &&
        value.match(upperCaseLetters) &&
        value.match(numbers) &&
        value.match(symbols) &&
        value.length >= 8) {
      this.setState({ validPassword: true });
    } else {
      this.setState({ validPassword: false });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const { action } = this.props;

    const SignUpData = {
      username: this.state.username.toLowerCase(),
      password: this.state.password,
      name: this.state.name
    };

    const signUpInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(SignUpData)
    };

    if (this.state.validPassword && action === 'sign-up') {
      fetch('/api/auth/sign-up', signUpInit)
        .then(res => {
          if (res.status === 409) {
            this.setState({ validUsername: false });
          } else {
            this.setState({
              username: '',
              password: '',
              name: '',
              validPassword: false
            });
            window.location.hash = 'sign-in';
          }
        })
        .catch(handleFetchRejection);
    }

    const signInData = {
      username: this.state.username.toLowerCase(),
      password: this.state.password
    };

    const signInInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signInData)
    };

    if (action === 'sign-in') {
      fetch('/api/auth/sign-in', signInInit)
        .then(res => {
          if (res.status === 401) {
            this.setState({ loginError: true });
          } else {
            return (res.json());
          }
        })
        .then(result => {
          if (result.user && result.token) {
            this.props.onSignIn(result);
          }
        })
        .catch(handleFetchRejection);
    }
  }

  handleGuestLogin() {

    const guestSignInData = {
      username: process.env.GUEST_USERNAME,
      password: process.env.GUEST_PASSWORD
    };

    const guestSignInInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(guestSignInData)
    };

    fetch('/api/auth/sign-in', guestSignInInit)
      .then(res => res.json())
      .then(result => this.props.onSignIn(result))
      .catch(handleFetchRejection);
  }

  render() {
    const { action } = this.props;

    const formBackground = (action === 'sign-up')
      ? 'auth-form-background-sign-up'
      : 'auth-form-background-sign-in';

    const redirectLink = (action === 'sign-up')
      ? (<a href='#sign-in' className='auth-redirect-link'>
          Already have an account?
          <br className='break'></br>
          Click to sign-in
        </a>)
      : (
        <a href='#sign-up' className='auth-redirect-link'>
          Don&apos;t have an account?
          <br className='break'></br>
          Click to sign-up!
        </a>
        );

    const buttonText = (action === 'sign-up')
      ? 'Sign-Up'
      : 'Sign-In';

    const validationSymbol = this.state.validPassword
      ? 'bi bi-check-lg password-check'
      : 'bi bi-x password-x';

    const loginError = (this.state.loginError)
      ? 'invalid-login-message'
      : 'invalid-login-message hidden';

    const usernameMessage = (this.state.validUsername === false)
      ? 'username-error'
      : 'username-error hidden';

    const viewPasswordDetails = (action === 'sign-up')
      ? 'view'
      : 'hidden';

    const guestLinkView = (action === 'sign-in')
      ? 'view'
      : 'hidden';

    const nameField = (action === 'sign-up') && (
        <div className='row'>
          <div className='column-full'>
            <label htmlFor='name' className='auth-form-label'>Name</label>
            <input
              required
              id='name'
              type='text'
              name='name'
              placeholder='Name'
              className='auth-form-field form-margin-bottom'
              value={this.state.name}
              onChange={this.handleInputChange} />
          </div>
        </div>
    );

    return (
      <div className={formBackground}>
        <form onSubmit={this.handleSubmit}>
          <div className='row'>
            <div className='column-full position-relative'>
              <p className={ loginError } >Invalid Login. Please try again.</p>
            </div>
          </div>
          <div className='row'>
            <div className='column-full'>
              <label htmlFor='username' className='auth-form-label'>Username</label>
              <input
              required
              id='username'
              name='username'
              type='text'
              placeholder='Username'
              className='auth-form-field form-margin-bottom'
              value={this.state.username}
              onChange={this.handleInputChange} />
              <p className={usernameMessage}>Username already exists. Please try something else.</p>
            </div>
          </div>
          <div className='row'>
            <div className='column-full position-relative'>
              <label htmlFor='password' className='auth-form-label'>Password</label>
              <input
                required
                id='password'
                type='password'
                name='password'
                placeholder='Password'
                className='auth-form-field'
                value={this.state.password}
                onChange={this.handlePasswordInput} />
              <i className={`${validationSymbol} ${viewPasswordDetails}`}></i>
              <p className={`password-reqs ${viewPasswordDetails}`}>Password must contain at least:
                <span className='sub-reqs'>8 characters </span>
                <span className='sub-reqs'>1 uppercase character </span>
                <span className='sub-reqs'>1 lowercase character </span>
                <span className='sub-reqs'>1 number </span>
                <span className='sub-reqs form-margin-bottom'>1 symbol (!,@,#,$,%,&,*,.) </span>
              </p>
            </div>
          </div>
          {nameField}
          <div className='row'>
            <div className='column-full text-align-center'>
              <p className={`guest-link ${guestLinkView}`} onClick={this.handleGuestLogin}>Continue as Guest</p>
            </div>
          </div>
          <div className='row justify-content-space-between auth-form-margin-top'>
            <div className='column-flex'>
              {redirectLink}
            </div>
            <div className='column-flex'>
              <button className='auth-button'>{buttonText}</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
