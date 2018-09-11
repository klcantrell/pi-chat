import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'core-js/fn/object/assign';

import 'materialize-css/js/cash';
// import 'materialize-css/js/component'; // this is now being imported in each component module I bring in
import 'materialize-css/js/global';
import 'materialize-css/js/anime.min';
import 'materialize-css/js/waves';
import 'materialize-css/js/forms';
import '../style/app.global.scss';

import App from './components/App';

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
