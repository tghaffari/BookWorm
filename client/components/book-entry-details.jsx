import React from 'react';

export default class BookEntryDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookshelf: 'read',
      completedDate: null
    };
    this.handleBookShelfSelect = this.handleBookShelfSelect.bind(this);
    this.handleModalSubmit = this.handleModalSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleBookShelfSelect(event) {
    if (event.target.value === 'read') {
      this.setState({ bookshelf: 'read' });
    } else if (event.target.value === 'to-read') {
      this.setState({ bookshelf: 'to-read' });
    }
  }

  handleDateChange(event) {
    this.setState({ completedDate: event.target.value });
  }

  handleModalSubmit(event) {
    event.preventDefault();

    const bookDetails = this.props.book;
    bookDetails.completedAt = this.state.completedDate;

    this.props.saveBook(bookDetails);

    this.props.closeModal();
  }

  render() {
    let options = null;
    let input = null;
    let dateCompletedClassName = null;
    if (this.state.bookshelf === 'read') {
      options = (
        <>
          <option value="read" selected >READ</option>
          <option value="to-read">TO-READ</option>
        </>
      );
      input = <input type="date" id="completedDate" name="completedDate" className="completed-date" required onChange={this.handleDateChange}/>;
      dateCompletedClassName = 'completed-date-label';
    } else if (this.state.bookshelf === 'to-read') {
      options = (
        <>
          <option value="read">READ</option>
          <option value="to-read" selected>TO-READ</option>
        </>
      );
      input = <input type="date" id="completedDate" name="completedDate" className="completed-date-deselect" disabled />;
      dateCompletedClassName = 'completed-date-label-deselect';
    }

    return (
      <div className='modal-background'>
        <div className='book-details-modal-window'>
          <i className="bi bi-x book-modal-exit" onClick={this.props.closeModal}></i>
          <form onSubmit={this.handleModalSubmit}>
            <div className="row book-modal-padding">
              <div className='column-flex'>
                <img className='book-image' src={this.props.book.coverImgURL}></img>
              </div>
              <div className='column-flex modal-book-details'>
                <h3 className='modal-book-title'>{this.props.book.title}</h3>
                <p className='modal-author'>By: {this.props.book.author}</p>
                <p className='modal-date'>{this.props.book.publishedYear}</p>
              </div>
            </div>
            <div className="row book-modal-padding align-items-center">
              <label id="bookshelf" className="bookshelf-label">Bookshelf:
                <select name="bookshelf" className="bookshelf-select" onChange={this.handleBookShelfSelect}>
                  {options}
                </select>
              </label>
            </div>
            <div className="row book-modal-padding align-items-center">
              <label htmlFor="completedDate" className={dateCompletedClassName}>Date Completed: </label>
              {input}
            </div>
            <div className="row book-modal-padding justify-content-end">
              <div className="column-flex">
                <button className="modal-save-button">SAVE</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
