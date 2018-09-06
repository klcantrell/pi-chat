import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AWSAppSyncClient from 'aws-appsync';
import Amplify, { Auth } from 'aws-amplify';
import { Provider } from 'react-apollo';
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

Amplify.configure({
  Auth: {
    identityPoolId: awsConfig.identityPoolId,
    region: awsConfig.region,
  },
});


const client = new AWSAppSyncClient({
  url: awsConfig.graphqlEndpoint,
  region: awsConfig.region,
  auth: {
    type: awsConfig.authenticationType,
    credentials: () => Auth.currentCredentials(),
  },
});

client.query({
  query: gql`
    {
      singleChat {
        items {
          id
          message
          createdAt
        }
      }
    }
  `,
})
  .then(res => console.log(res.data))
  .catch(err => console.log(err));

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
