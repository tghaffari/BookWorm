import React from 'react';

export default class RenderSearchResult extends React.Component {
  render() {
    const { results, addToLibrary } = this.props;

    const author = results.volumeInfo.authors?.join(', ') ?? '';
    const publishedYear = results.volumeInfo.publishedDate?.slice(0, 4) ?? '';
    const src = results.volumeInfo.imageLinks?.thumbnail ?? '/images/no_book_cover.jpeg';

    return (
      <li key={results.id} className="search-list-element" data-id={results.id}>
        <div className='column-full'>
          <div className='row search-results-padding'>
            <div className='column-flex'>
              <img className='search-image' src={src}></img>
              <div className='column-full text-align-center'>
                <select name='addToLibrary' className='add-dropdown text-align-center' onChange={addToLibrary} defaultValue='default'>
                  <option value='default' disabled>ADD TO LIBRARY</option>
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
