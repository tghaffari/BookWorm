import React from 'react';
import handleFetchRejection from '../lib/handle-fetch-rejection';

export default class DeleteConfirmationModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick() {
    const token = window.localStorage.getItem('bookWorm-jwt');
    const bookId = this.props.bookId.bookId;

    const init = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': `${token}`
      }
    };

    fetch(`/api/deleteEntry/${bookId}`, init)
      .catch(handleFetchRejection);

    this.props.closeModal();
  }

  render() {
    return (
      <div className = 'modal-background'>
        <div className='delete-modal-window'>
          <i className='bi bi-x delete-modal-exit' onClick={this.props.closeModal}></i>
          <div className='row delete-modal-padding'>
            <div className='column-full text-align-center'>
              <p className='delete-modal-text'>Are you sure you want to delete
              this book from your library?</p>
            </div>
          </div>
          <div className='row justify-content-space-between delete-modal-padding'>
            <div className='column-flex'>
              <button className='delete-button' onClick={this.handleDeleteClick}>DELETE</button>
            </div>
            <div className='column-flex'>
              <button className='no-button' onClick={this.props.closeModal}>NO</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
