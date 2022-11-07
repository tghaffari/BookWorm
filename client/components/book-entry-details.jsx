import React from 'react';

export default class BookEntryDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookshelf: 'read',
      completedDate: '',
      quote: '',
      pageNumber: ''
    };
    this.handleBookShelfSelect = this.handleBookShelfSelect.bind(this);
    this.handleModalSubmit = this.handleModalSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleQuoteChange = this.handleQuoteChange.bind(this);
    this.handlePageNumberChange = this.handlePageNumberChange.bind(this);
  }

  handleBookShelfSelect(event) {
    if (event.target.value === 'read') {
      this.setState({
        bookshelf: 'read',
        completedDate: ''
      });
    } else if (event.target.value === 'to-read') {
      this.setState({
        bookshelf: 'to-read',
        completedDate: null
      });
    }
  }

  handleDateChange(event) {
    this.setState({ completedDate: event.target.value });
  }

  handleQuoteChange(event) {
    this.setState({ quote: event.target.value });
  }

  handlePageNumberChange(event) {
    this.setState({ pageNumber: event.target.value });
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
    const todaysDate = new Date().toISOString().slice(0, 10);

    if (this.state.bookshelf === 'read') {
      options = (
        <>
          <option value="read">READ</option>
          <option value="to-read">TO-READ</option>
        </>
      );
      input = <input
              type="date"
              id="completedDate"
              name="completedDate"
              className="completed-date"
              max={todaysDate}
              value= {this.state.completedDate}
              onChange={this.handleDateChange}
              required
              />;
      dateCompletedClassName = 'completed-date-label';
    } else if (this.state.bookshelf === 'to-read') {
      options = (
        <>
          <option value="read">READ</option>
          <option value="to-read">TO-READ</option>
        </>
      );
      input = <input
              type="date"
              id="completedDate"
              name="completedDate"
              className="completed-date-deselect"
              value=''
              disabled />;
      dateCompletedClassName = 'completed-date-label-deselect';
    }

    const pageNumberRequirement = (this.state.quote !== '');

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
                <select name="bookshelf" className="bookshelf-select" onChange={this.handleBookShelfSelect} defaultValue={this.state.bookshelf}>
                  {options}
                </select>
              </label>
            </div>
            <div className="row book-modal-padding align-items-center">
              <label htmlFor="completedDate" className={dateCompletedClassName}>Date Completed: </label>
              {input}
            </div>
            <div className="row book-modal-padding align-items-center">
              <label htmlFor='quote' className='quote-label'> Favorite quote? Enter it here!
                <textarea
                  id='quote'
                  className='quote-input'
                  value = {this.state.quote}
                  onChange={this.handleQuoteChange}>
                </textarea>
              </label>
            </div>
            <div className="row book-modal-padding-page-number align-items-center">
              <label htmlFor='pageNumber' className='page-number-label'>Page no.
                <input
                  className="page-number-input"
                  value={this.state.pageNumber}
                  onChange={this.handlePageNumberChange}
                  required={pageNumberRequirement}></input>
              </label>
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
