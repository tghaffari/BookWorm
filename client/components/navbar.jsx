import React from 'react';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
      searchValue: ''
    };
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  handleSearchClick() {
    this.setState({ search: !this.state.search });
  }

  handleCancelClick() {
    this.setState({ search: false });
  }

  render() {
    const bottomNav = this.state.search
      ? (
        <>
          <input type="search" placeholder='Search Books' className='mobile-search-bar' ></input>
          <p className='cancel-search' onClick={this.handleCancelClick}>Cancel</p>
        </>
        )
      : (<a href="#home"><i className='fa-solid fa-house home-icon'></i></a>);

    const desktopNav = this.state.search
      ? (
        <>
          <input type="search" placeholder='Search Books' className='desktop-search-bar' ></input>
          <p className="cancel-search-desktop" onClick={this.handleCancelClick}>Cancel</p>
        </>
        )
      : (
        <a href="#search" onClick={this.handleSearchClick}>
          <i className="bi bi-search search-icon"></i>
          <p className="nav-text">Search</p>
        </a>
        );
    return (
    <>
      <div className="mobile-nav-view">
        <nav className="navbar box-shadow row align-items-center justify-content-center">
          <div className="column-one-third">
              <a href="#search"><i className="bi bi-search search-icon" onClick={this.handleSearchClick}></i></a>
          </div>
          <div className="column-one-third text-align-center">
            <h1 className="title">Bibliophile</h1>
          </div>
          <div className="column-one-third text-align-end">
              <a href="#"><i className="bi bi-box-arrow-right sign-out-icon"></i></a>
          </div>
        </nav>
        <div className="navbar bottom-shadow row justify-content-center align-items-center">
          <div className="column-full text-align-center">
            {bottomNav}
          </div>
        </div>
      </div>
      <div className="desktop-nav-view">
        <nav className="navbar row align-items-center box-shadow">
          <div className="column-one-half">
            <h1 className="title">Bibliophile</h1>
          </div>
          <div className="column-one-half text-align">
            <ul className="navigation-list align-items-end">
              <li className="nav-items-padding text-align-center">
                <a href="#home">
                  <i className="fa-solid fa-house home-icon"></i>
                  <p className="nav-text">Home</p>
                </a>
              </li >
              <li className="nav-items-padding text-align-center">
               {desktopNav}
              </li>
              <li className="nav-items-padding text-align-center">
                <a href="#sign-out">
                  <i className="bi bi-box-arrow-right sign-out-icon"></i>
                  <p className="nav-text">Sign-out</p>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
    );
  }
}
