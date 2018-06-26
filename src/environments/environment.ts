// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  host: 'http://localhost:80',
  firebase: {
    apiKey: 'AIzaSyAEob0wQqq7fS6Nwhtl38ix0Z70BsLTlZo',
    authDomain: 'acm-development-firebase.firebaseapp.com',
    databaseURL: 'https://acm-development-firebase.firebaseio.com',
    projectId: 'acm-development-firebase',
    storageBucket: 'acm-development-firebase.appspot.com',
    messagingSenderId: '897277162901'
  }
};
