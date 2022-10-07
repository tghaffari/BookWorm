import React from 'react';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      name: '',
      validUsername: null,
      validPassword: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      validUsername: null
    });
  }

  handlePasswordInput(event) {
    const { value } = event.target;

    this.setState({ password: value });

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

    if (!this.state.validPassword) {
      this.setState({ showErrorMessage: true });
    }

    const data = {
      username: this.state.username,
      password: this.state.password,
      name: this.state.name
    };

    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    if (this.state.validPassword) {
      fetch('/api/auth/sign-up', init)
        .then(res => {
          if (res.status === 409) {
            this.setState({ validUsername: false });
          } else {
            this.setState({
              username: '',
              password: '',
              name: ''
            });
          }
        })
        .catch(err => console.error(err));
    }
  }

  render() {
    const validationSymbol = this.state.validPassword
      ? 'bi bi-check-lg password-check'
      : 'bi bi-x password-x';

    const usernameMessage = this.state.validUsername === false
      ? 'username-error'
      : 'username-error hidden';

    return (
      <div className='auth-form-background'>
        <form onSubmit={this.handleSubmit}>
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
              <i className={validationSymbol}></i>
              <p className='password-reqs'>Password must contain:
                <span className='sub-reqs'>8 characters minimum </span>
                <span className='sub-reqs'>1 uppercase character </span>
                <span className='sub-reqs'>1 lowercase character </span>
                <span className='sub-reqs'>1 number </span>
                <span className='sub-reqs form-margin-bottom'>1 symbol (!,@,#,$,%,&,*,.) </span>
              </p>
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
          <div className='row justify-content-space-between auth-form-margin-top'>
            <div className='column-flex'>
              <a href='' className='auth-redirect-link'>
                Already have an account?
                <br className='break'></br>
                Click to sign-in
              </a>
            </div>
            <div className='column-flex'>
              <button className='auth-button'>Sign-Up</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
