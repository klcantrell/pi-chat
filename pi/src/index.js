const AWSAppSyncClient = require('aws-appsync').default;
const Amplify = require('aws-amplify').default;
const gql = require('graphql-tag');
const fetch = require('node-fetch');
const awsConfig = require('./aws.config');
const { Auth } = Amplify;

global.fetch = fetch;

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

const TEST_MUTATION = gql`
  mutation {
    createChat(message: "TEST FROM THE PI CODE!") {
      id
      message
      createdAt
      kind
    }
  }
`;

// client.mutate({
//   mutation: TEST_MUTATION,
// });

console.log('pi server started');