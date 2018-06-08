// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBbDvqIhqG_tLUFMxr90b98PIHsnRXFh0k',
    authDomain: 'ng-fitness-tracker-46d3f.firebaseapp.com',
    databaseUrl: 'https://ng-fitness-tracker-46d3f.firebaseio.com',
    projectId: 'ng-fitness-tracker-46d3f',
    storageBucket: 'ng-fitness-tracker-46d3f.appspot.com',
    messagingSenderId: '465565028952'
  }
};
