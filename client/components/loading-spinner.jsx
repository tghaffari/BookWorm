import React from 'react';

export default class LoadingSpinner extends React.Component {
  render() {
    if (!this.props.isLoading) {
      return;
    }

    return (
      <div className='fa-stack fa-4x loading-spinner-container'>
        <i className="fa-solid fa-book-open fa-stack-2x loading-spinner-background"></i>
        <i className="fa-solid fa-book-open fa-stack-1x loading-spinner"></i>
      </div>
    );
  }

}
