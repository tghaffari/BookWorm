import React from 'react';
import Navbar from './components/navbar';
import parseRoute from './lib/parse-route';
import SearchResults from './pages/search-results';
import PageContainer from './components/page-container';
import MyBooks from './pages/my-books';
import Home from './pages/home';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
  }

  renderPage() {
    const { path, params } = this.state.route;
    if (path === 'search') {
      return <SearchResults params={ params}/>;
    } else if (path === 'library') {
      return <MyBooks />;
    } else if (path === 'home') {
      return <Home />;
    }
  }

  render() {
    return (
      <>
          <Navbar />
          <PageContainer >
            {this.renderPage()}
          </PageContainer>
      </>
    );
  }
}
