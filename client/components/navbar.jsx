import React from 'react';

export default class Navbar extends React.Component {
  render() {
    return (
      <>
      <div className="mobile-nav-view">
        <nav className="navbar box-shadow row align-items-center justify-content-center">
          <div className="column-one-third">
              <a href="#search"><i className="bi bi-search search-icon"></i></a>
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
              <a href="#home"><i className="fa-solid fa-house home-icon"></i></a>
          </div>
        </div>
      </div>
      <div className="desktop-nav-view">
        <nav className="navbar row align-items-center box-shadow">
          <div className="column-one-half">
            <h1 className="title">Bibliophile</h1>
          </div>
          <div className="column-one-half text-align">
            <ul className="navigation-list align-items-center">
              <li className="nav-items-padding text-align-center">
                <a href="#home">
                  <i className="fa-solid fa-house home-icon"></i>
                  <p className="nav-text">Home</p>
                </a>
              </li >
              <li className="nav-items-padding text-align-center">
                <a href="#search">
                  <i className="bi bi-search search-icon"></i>
                  <p className="nav-text">Search</p>
                </a>
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
