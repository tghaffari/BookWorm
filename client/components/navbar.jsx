import React from 'react';
import AppContext from '../lib/app-context';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
      searchValue: ''
    };
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  handleSearchClick() {
    this.setState({ search: !this.state.search });
  }

  handleCancelClick() {
    this.setState({
      search: false,
      searchValue: ''
    });
  }

  handleInputChange(event) {
    this.setState({ searchValue: event.target.value });
  }

  handleSearchSubmit(event) {
    event.preventDefault();
    const query = this.state.searchValue.replaceAll(' ', '+');
    window.location.hash = (`search?q=${query}`);
    this.setState({
      search: false,
      searchValue: ''
    });
    return null;
  }

  render() {
    const { user, handleSignOut } = this.context;
    if (!user) return null;

    const bottomNav = this.state.search
      ? (
        <div className='row nav-search-row justify-content-center align-items-center'>
          <div className="column-full text-align-center">
            <form onSubmit={this.handleSearchSubmit}>
              <input
              type="search"
              placeholder='Search Books'
              className='mobile-search-bar'
              value={this.state.searchValue}
              onChange={this.handleInputChange}>
              </input>
              <a className='cancel-search' onClick={this.handleCancelClick}>Cancel</a>
            </form>
          </div>
        </div>
        )
      : (
        <ul className="row align-items-center justify-content-center mobile-navbar-list">
          <li className='column-one-third'>
            <a href="#home"><i className='fa-solid fa-house home-icon'></i></a>
          </li>
          <li className='column-one-third'>
            <a href="#library"><i className="fa-solid fa-book book-icon"></i></a>
          </li>
        </ul>
        );

    const desktopNav = this.state.search
      ? (
        <form onSubmit={this.handleSearchSubmit}>
          <input
          type="search"
          placeholder='Search Books'
          className='desktop-search-bar'
          value={this.state.searchValue}
          onChange={this.handleInputChange}>
          </input>
          <a className="cancel-search-desktop" onClick={this.handleCancelClick}>Cancel</a>
        </form>
        )
      : (
        <a onClick={this.handleSearchClick} className='desktop-search-navbar-button'>
          <i className="bi bi-search search-icon"></i>
          <p className="nav-text">Search</p>
        </a>
        );
    return (
    <>
      <div className="mobile-nav-view">
        <nav className="navbar box-shadow row align-items-center">
          <div className="column-one-third">
              <a><i className="bi bi-search search-icon" onClick={this.handleSearchClick}></i></a>
          </div>
          <div className="column-one-third text-align-center">
              <div className='row align-items-center'>
                <img className='logo' src='/images/Bookworm-logo.png'></img>
                <h1 className="title">BookWorm</h1>
              </div>
          </div>
          <div className="column-one-third text-align-end">
            <button type='button' className='sign-out-button'><i className="bi bi-box-arrow-right sign-out-icon" onClick={handleSignOut}></i></button>
          </div>
        </nav>
        <div className="navbar bottom-shadow">
          {bottomNav}
        </div>
      </div>
      <div className="desktop-nav-view">
        <nav className="navbar row align-items-center box-shadow justify-content-space-between">
          <div className="flex">
            <div className='row align-items-center'>
                <img className='logo' src='/images/Bookworm-logo.png'></img>
                <h1 className="title">BookWorm</h1>
            </div>
          </div>
          <div className="column-flex text-align-end">
            <ul className="navigation-list align-items-end">
              <li className="nav-items-padding text-align-center">
                <a href='#home'>
                  <i className="fa-solid fa-house home-icon home-link"></i>
                  <p className="nav-text">Home</p>
                </a>
              </li >
              <li className='nav-items-padding text-align-center'>
                <a href="#library">
                  <i className="fa-solid fa-book book-icon"></i>
                  <p className='nav-text'>Library</p>
                </a>
              </li>
              <li className="nav-items-padding text-align-center">
               {desktopNav}
              </li>
              <li className="nav-items-padding text-align-center">
                <button onClick={handleSignOut} type='button' className='sign-out-button'>
                  <i className="bi bi-box-arrow-right sign-out-icon"></i>
                  <p className="nav-text">Sign-Out</p>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
    );
  }
}

Navbar.contextType = AppContext;
