/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import { firebase, facebookAuthProvider, googleAuthProvider } from '../firebase/firebase';
import AuthOptions from '../const';

/* This method uses firebase auth to create a new user. */
function registerWithTimbr(credentials) {
  // TODO: Firebase auth error handling.
  firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
    .then((() => {
      console.log('User created!');
    }))
    .catch(((error) => {
      console.error(error.message);
    }));
}

/* This method uses firebase auth to sign in a user. */
function loginWithTimbr(credentials) {
  // TODO: Firebase auth error handling.
  firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
    .then((() => {
      console.log('User signed in!');
    }))
    .catch(((error) => {
      console.error(error.message);
    }));
}

/* This function uses Firebase auth to sign in a user using Facebook. */
function loginWithFacebook() {
  // TODO: Firebase auth error handling.
  firebase.auth().signInWithPopup(facebookAuthProvider)
    .then((() => {
      console.log('User logged in with Facebook!');
    }))
    .catch(((error) => {
      console.error(error.message);
    }));
}

/* This function uses firebase auth to sign in a user using Google. */
function loginWithGoogle() {
  // TODO: Firebase auth error handling.
  firebase.auth.signInWithPopup(googleAuthProvider)
    .then((() => {
      console.log('User logged in with Google!');
    }))
    .catch(((error) => {
      console.error(error.message);
    }));
}

/* This function uses firebase auth to log out a user */
function logout() {
  // TODO: Firebase auth error handling.
  firebase.auth().signOut()
    .then((() => {
      console.log('User signed out!');
    }))
    .catch(((error) => {
      console.error(error.message);
    }));
}

/* This is the entry method for all authentication functions,
     currently only handles login and registration. */
export default function authentication(option, credentials) {
  switch (option) {
    case AuthOptions.REGISTER_WITH_TIMBR:
      registerWithTimbr(credentials);
      break;
    case AuthOptions.LOGIN_WITH_TIMBR:
      loginWithTimbr(credentials);
      break;
    case AuthOptions.LOGIN_WITH_FACEBOOK:
      loginWithFacebook();
      break;
    case AuthOptions.LOGIN_WITH_GOOGLE:
      loginWithGoogle();
      break;
    case AuthOptions.LOGOUT:
      logout();
      break;
    default:
      console.error('Invalid Option.');
  }
}
