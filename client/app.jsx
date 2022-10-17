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
import jwtDecode from 'jwt-decode';
import Redirect from './components/redirect';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash)
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('bookWorm-jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('bookWorm-jwt');
    this.setState({ user: null });
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
    const token = window.localStorage.getItem('bookWorm-jwt');
    const user = token ? jwtDecode(token) : null;
    this.setState({ user, isAuthorizing: false });
  }

  renderPage() {
    const { params, path } = this.state.route;
    if (path === 'search') {
      return <SearchResults params={params} path={path}/>;
    } else if (path === 'library') {
      return <MyBooks />;
    } else if (path === 'home') {
      return <Home />;
    } else if (path === 'sign-up' || path === 'sign-in') {
      return <AuthPage />;
    } else if (path === '') {
      return <Redirect to='sign-in' />;
    }
  }

  render() {

    if (this.state.isAuthorizing) return null;

    const { handleSignIn, handleSignOut } = this;
    const { user, route } = this.state;
    const contextValue = { user, route, handleSignIn, handleSignOut };

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
