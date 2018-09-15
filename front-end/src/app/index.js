import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'core-js/es6/promise';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/fn/object/assign';
import 'core-js/fn/array/find';
import 'core-js/fn/array/from';
import 'core-js/fn/string/includes';
import 'whatwg-fetch'; 

import '../vendor/materialize-css/cash';
// import '../vendor/materialize-css/component'; // this is now being imported in each component module I bring in
import '../vendor/materialize-css/global';
// import '../vendor/materialize-css/anime.min'; // not needed for input animation evidently
import '../vendor/materialize-css/forms';
import '../style/app.global.scss';

import App from './components/App';

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
