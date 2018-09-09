const AWSAppSyncClient = require('aws-appsync').default;
const Auth = require('@aws-amplify/auth').default;
const gql = require('graphql-tag');
const fetch = require('node-fetch');
const awsConfig = require('./aws.config');

global.fetch = fetch;

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

const TEST_MUTATION = gql`
  mutation {
    createChat(message: "YET ANOTHER TEST FROM THE PI CODE!") {
      id
      message
      createdAt
      kind
    }
  }
`;

// client.mutate({
//   mutation: TEST_MUTATION,
// }).then(res => {
//   console.log(res);
// });

console.log('pi server started');