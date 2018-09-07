import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import ChatPanel from './ChatPanel';
import styles from '../../style/components/app.scss'

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <ChatPanel />
      </div>
    );
  }
}

export default hot(module)(App);