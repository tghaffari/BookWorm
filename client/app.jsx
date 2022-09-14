import React from 'react';
import Home from './pages/home';
import Navbar from './components/navbar';
import parseRoute from './lib/parse-route';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  render() {
    return <Navbar />;
  }
}
