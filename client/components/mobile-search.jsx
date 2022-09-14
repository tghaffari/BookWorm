import React from 'react';

export default class MobileSearchBar extends React.Component {

  handleCancelClick() {
    this.props.search = null;
  }

  render() {
    if (!this.props.search) return null;
    return (
      <>
        <input type="search" placeholder='Search Books' className='mobile-search-bar' ></input>
        <p className='cancel-search' onClick={this.handleCancelClick}>Cancel</p>
      </>
    );
  }
}
