import { P } from 'node_modules/@angular/cdk/platform.d-B3vREl3q';

export const environment = {
  production: false,
  inmojo: {
    url: 'https://app.inmojo.at/',
  },
  firebase: {
    // These will be replaced with actual values from the proxy
    apiKey: 'AIzaSyAPg9ICKicD_YP6C1uR4Q41IlTfzWT38jw',
    authDomain: 'inmojo-b2afc.firebaseapp.com',
    databaseURL: 'https://inmojo-b2afc-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'inmojo-b2afc',
    storageBucket: 'inmojo-b2afc.appspot.com',
    messagingSenderId: '1074042277841',
    appId: '1:1074042277841:web:c1d49cc3f2f94eb797daf0',
    measurementId: 'G-G8SVKNQF4R',
  },
  proxyUrl: 'http://localhost:3000/api', // Development proxy URL
};
