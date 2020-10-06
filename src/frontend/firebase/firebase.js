import firebase from 'firebase';
import config from './firebase.config';

/* Initialising firebase */

firebase.initializeApp(config);

// add providers and database here
const database = firebase.database();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

export {
  firebase, googleAuthProvider, facebookAuthProvider, database as default,
};
