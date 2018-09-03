import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import ChatPanel from './ChatPanel';

class App extends Component {
  render() {
    return (
      <ChatPanel />
    );
  }
}

export default hot(module)(App);