import React from 'react';

export default class Navbar extends React.Component {
  render() {
    return (
      <>
        <nav className="navbar-mobile box-shadow row align-items-center justify-content-center">
        <div className="column-one-third">
          <i className="bi bi-search search-icon"></i>
        </div>
        <div className="column-one-third text-align-center">
          <h1 className="title">Bibliophile</h1>
        </div>
        <div className="column-one-third text-align-end">
          <i className="bi bi-box-arrow-right sign-out-icon"></i>
        </div>
      </nav>
      <div className="navbar-mobile bottom-shadow row justify-content-center align-items-center">
        <div className="column-full text-align-center">
          <i className="fa-solid fa-house home-icon"></i>
        </div>
      </div>
    </>
    );
  }
}
