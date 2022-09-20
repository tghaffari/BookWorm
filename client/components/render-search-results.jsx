import React from 'react';

export default class RenderSearchResult extends React.Component {
  render() {
    const { results, addToLibrary } = this.props;

    let author = '';
    if (results.volumeInfo.authors !== undefined) {
      author = results.volumeInfo.authors.join(', ');
    }
    let publishedYear = '';
    if (results.volumeInfo.publishedDate !== undefined) {
      publishedYear = results.volumeInfo.publishedDate.slice(0, 4);
    }

    let src = 'https://fivebooks.com/app/uploads/2010/09/no_book_cover.jpg';
    if (results.volumeInfo.imageLinks !== undefined) {
      src = results.volumeInfo.imageLinks.thumbnail;
    }
    return (
      <li key={results.id} className="search-list-element" data-id={results.id}>
        <div className='column-full'>
          <div className='row search-results-padding'>
            <div className='column-flex'>
              <img className='search-image' src={src}></img>
              <div className='column-full text-align-center'>
                <select name='addToLibrary' className='add-dropdown text-align-center' onChange={addToLibrary}>
                  <option value='' disabled selected>ADD TO LIBRARY</option>
                  <option value='read'>READ</option>
                  <option value='to-read'>TO-READ</option>
                </select>
              </div>
            </div>
            <div className='column-flex book-details-container'>
              <h3 className='search-book-title'>{results.volumeInfo.title}</h3>
              <p className='search-author'>{author}</p>
              <p className='search-date'>{publishedYear}</p>
              <p className='search-synopsis'>{results.volumeInfo.description}</p>
            </div>
          </div>
        </div>
      </li>
    );
  }
}
