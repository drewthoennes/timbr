const firebaseImport = require('firebase/app');

firebaseImport.initializeApp({
  apiKey: process.env.FIREBASE_KEY,
  authDomain: 'timbr-cs407.firebaseapp.com',
  databaseURL: 'https://timbr-cs407.firebaseio.com',
  projectId: 'timbr-cs407',
  storageBucket: 'timbr-cs407.appspot.com',
  messagingSenderId: '719123149125',
  appId: '1:719123149125:web:3ebca1d4aeb3e9b47b4e2c',
  measurementId: 'G-SW3QDZYMGX',
});
require('firebase/auth');
require('firebase/database');
