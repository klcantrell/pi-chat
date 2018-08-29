import React from 'react';
import { hot } from 'react-hot-loader';
import style from '../style/components/test.scss';

const Test = () => {
  return (
    <>
      <h1 className={style.header}>sup!</h1>
    </>
  );
};

export default hot(module)(Test);