import React from 'react';
import { hot } from 'react-hot-loader';
import './Test.scss';

const Test = () => {
  return (
    <>
      <h1 className="header">sup!</h1>
    </>
  );
};

export default hot(module)(Test);