import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Test from './components/Test';
import Materialize from './vendor/materialize.min';
import '../style/app.global.scss';

console.log(Materialize);

ReactDOM.render(
  <Test />,
  document.getElementById('app')
);