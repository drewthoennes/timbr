/* eslint no-console: ["error", { allow: ["log", "error"] }] */
/* The comment above disable eslint warnings for using console.log and console.error,
    because these are used for debugging purposes. */

import firebase from '../firebase/firebase';

/* This method uses firebase auth to create a new user. */
function register(credentials) {
  firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
    .then((() => {
      console.log('User created!');
    }))
    .catch(((error) => {
      console.error(error.message);
    }));
}

/* This method uses firebase auth to sign in a user. */
function login(credentials) {
  firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
    .then((() => {
      console.log('User signed in!');
    }))
    .catch(((error) => {
      console.error(error.message);
    }));
}

/* This is the entry method for all authentication functions,
     currently only handles login and registration. */
export default function authentication(option, credentials) {
  if (option.toLowerCase() === 'register') {
    register(credentials);
  } else if (option.toLowerCase() === 'login') {
    login(credentials);
  } else {
    console.error('Invalid option.');
  }
}
