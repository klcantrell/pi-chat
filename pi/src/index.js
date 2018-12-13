const AWSAppSyncClient = require('aws-appsync').default;
const Auth = require('@aws-amplify/auth').default;
const gql = require('graphql-tag');
const fetch = require('node-fetch');
const awsConfig = require('./aws.config');
const sensor = require('node-dht-sensor');

global.fetch = fetch;

console.log('pi server started');

const celsiusToFahrenheit = celsius => ((celsius * 9 / 5) + 32);

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

const CHAT_MUTATION = gql`
  mutation CreateChat($message: String!) {
    createChat(message: $message) {
      id
      message
      createdAt
      kind
    }
  }
`;

setInterval(() => {
  sensor.read(22, 4, (err, temperature, humidity) => {
    if (!err) {
      client.mutate({
        mutation: CHAT_MUTATION,
        variables: {
          message: `It's ${celsiusToFahrenheit(temperature).toFixed(1)}°F!`
        }
      }).catch(err => {
        console.log(err);
      });
    } else {
      console.log(err);
    }
  });
}, 4000);