import React from 'react';

export default class DeleteConfirmationModal extends React.Component {
  render() {
    return (
      <div className = 'modal-background'>
        <div className='delete-modal-window'>
          <i className='bi bi-x delete-modal-exit' onClick={this.props.closeModal}></i>
          <div className='row delete-modal-padding'>
            <div className='column-full text-align-center'>
              <p className='confirmation-text'>Are you sure you want to delete
              this book from your library?</p>
            </div>
          </div>
          <div className='row justify-content-space-between delete-modal-padding'>
            <div className='column-flex'>
              <button className='delete-button'>DELETE</button>
            </div>
            <div className='column-flex'>
              <button className='no-button'>NO</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
