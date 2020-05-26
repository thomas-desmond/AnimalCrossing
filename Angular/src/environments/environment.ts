// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  loginUrl: 'https://animal-crossing.auth.us-east-1.amazoncognito.com/login?client_id=3l8tlpgkpkqo5n6nrivqeklt8r&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=$BASE_URL$/user-verify',
  apigatewayBaseUrl: 'https://gvs362ceak.execute-api.us-east-1.amazonaws.com/live'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
