export const amplifyConfig = {
  authenticationFlowType: "USER_PASSWORD_AUTH",
  Auth: {
    region: "us-east-1", // replace with your region
    userPoolId: "us-east-1_2KzMVrl0I", // your Cognito User Pool ID
    userPoolWebClientId: "hd18nu5nf78724dc3lq8av23s", // your Cognito User Pool Client ID
    mandatorySignIn: true,
    authenticationFlowType: "USER_PASSWORD_AUTH", // default password-based flow
    // Add the Cognito block with loginWith and oauth properties
    Cognito: {
      region: "us-east-1", // replace with your region
      userPoolId: "us-east-1_2KzMVrl0I", // your Cognito User Pool ID
      userPoolClientId: "hd18nu5nf78724dc3lq8av23s", // your Cognito User Pool Client ID
      authenticationFlowType: "USER_PASSWORD_AUTH", // default password-based flow
      loginWith: {
        oauth: {},
      },
    },
  },
};
