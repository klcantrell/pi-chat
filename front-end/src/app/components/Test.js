import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import style from '../../style/components/test.scss';

class Test extends Component {
  
  render() {
    return (
      <>
        <h1 className={style.header}>sup!</h1>
        <a className="waves-effect waves-light btn">button</a>
      </>
    );
  }
}

export default hot(module)(Test);