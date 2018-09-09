import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AWSAppSyncClient from 'aws-appsync';
import Auth from '@aws-amplify/auth';
import { ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';

import 'materialize-css/js/cash';
// import 'materialize-css/js/component'; // this is now being imported in each component module I bring in
import 'materialize-css/js/global';
import 'materialize-css/js/anime.min';
import 'materialize-css/js/waves';
import 'materialize-css/js/forms';
import '../style/app.global.scss';

import awsConfig from './aws.config';
import App from './components/App';

Auth.configure({
  identityPoolId: awsConfig.identityPoolId,
  region: awsConfig.region,
});

const client = new AWSAppSyncClient({
  url: awsConfig.graphqlEndpoint,
  region: awsConfig.region,
  auth: {
    type: awsConfig.authenticationType,
    credentials: () => Auth.currentCredentials(),
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('app')
);
