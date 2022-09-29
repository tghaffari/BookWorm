import React from 'react';
import Navbar from './components/navbar';
import parseRoute from './lib/parse-route';
import SearchResults from './pages/search-results';
import PageContainer from './components/page-container';
import MyBooks from './pages/my-books';
import Home from './pages/home';
import AuthPage from './pages/auth';

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
    } else if (path === 'sign-in') {
      return <AuthPage path = {this.state.route.path} />;
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
