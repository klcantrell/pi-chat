import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { ApolloProvider } from 'react-apollo';
import Auth from '@aws-amplify/auth';

import ChatPanel from './ChatPanel';
import awsConfig from '../aws.config';

import styles from '../../style/components/app.scss';

Auth.configure({
  identityPoolId: awsConfig.identityPoolId,
  region: awsConfig.region,
});

let client;

class App extends Component {
  state = {
    clientLoaded: false,
  }

  componentDidMount() {
    import('aws-appsync').then(({ default: AWSAppSyncClient }) => {
      client = new AWSAppSyncClient({
        url: awsConfig.graphqlEndpoint,
        region: awsConfig.region,
        auth: {
          type: awsConfig.authenticationType,
          credentials: () => Auth.currentCredentials(),
        },
      });
      this.setState({
        clientLoaded: true,
      })
    });
  }

  render() {
    const { clientLoaded } = this.state;
    return clientLoaded ? (
      <ApolloProvider client={client}>
        <div className={styles.app}>
          <ChatPanel ready={clientLoaded} />
        </div>
      </ApolloProvider>
    ) : (
      <div className={styles.app}>
        <ChatPanel ready={clientLoaded} />
      </div>
    );
  }
}

export default hot(module)(App);