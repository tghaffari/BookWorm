import React from 'react';
import Navbar from './components/navbar';
import parseRoute from './lib/parse-route';
import SearchResults from './pages/search-results';
import PageContainer from './components/page-container';
import MyBooks from './pages/my-books';
import Home from './pages/home';
import AuthPage from './pages/auth';
import AuthBackround from './components/auth-background';
import AppContext from './lib/app-context';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash)

    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });

    this.setState({ isAuthorizing: false });
  }

  renderPage() {
    const { path, params } = this.state.route;
    if (path === 'search') {
      return <SearchResults params={ params}/>;
    } else if (path === 'library') {
      return <MyBooks />;
    } else if (path === 'home') {
      return <Home />;
    } else if (path === 'sign-up') {
      return <AuthPage path = { path } />;
    }
  }

  render() {
    if (this.state.isAuthorizing) return null;
    const { user } = this.state;
    const contextValue = { user };

    return (
      <AppContext.Provider value={contextValue}>
        <>
            <Navbar />
            <AuthBackround />
            <PageContainer >
              {this.renderPage()}
            </PageContainer>
        </>
      </AppContext.Provider>
    );
  }
}
