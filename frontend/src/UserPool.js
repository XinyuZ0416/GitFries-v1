import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'eu-west-2_agjEDJ0Vq',
  ClientId: '61tvqdv990235gql3ickio57s7',
};

export default new CognitoUserPool(poolData);
