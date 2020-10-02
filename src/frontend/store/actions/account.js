/* eslint-disable no-console */
import { firebase, facebookAuthProvider, googleAuthProvider } from '../../firebase/firebase';
import store from '../index';
import constants from '../const';

/* This method uses firebase auth to create a new user. */
function registerWithTimbr(credentials) {
  // TODO: Firebase auth error handling.
  return firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
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
  return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
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
  return firebase.auth().signInWithPopup(facebookAuthProvider)
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
  return firebase.auth().signInWithPopup(googleAuthProvider)
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
  return firebase.auth().signOut()
    .then((() => {
      console.log('User signed out!');
    }))
    .catch(((error) => {
      console.error(error.message);
    }));
}

function setUID(uid) {
  store.dispatch({
    type: constants.SET_UID,
    uid,
  });
}

export default {
  registerWithTimbr,
  loginWithTimbr,
  loginWithFacebook,
  loginWithGoogle,
  logout,
  setUID,
};
