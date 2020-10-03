/* eslint-disable no-console */
import { firebase, facebookAuthProvider, googleAuthProvider } from '../../firebase/firebase';
import store from '../index';
import constants from '../const';

/* This method adds the current user to the database, if not already added. */
function addToDatabase() {
  const { uid, email } = firebase.auth().currentUser;

  if (!uid) {
    return Promise.resolve();
  }

  return firebase.database().ref(`users/${uid}`).once('value', (user) => {
    if (!user.exists()) {
      firebase.database().ref(`users/${uid}`).set({
        /* We can store something else other than the email,
          possibly the username. */
        email,
      });
    }
  });
}

/* This method uses firebase auth to create a new user. */
function registerWithTimbr(credentials) {
  return firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password);
}

/* This method uses firebase auth to sign in a user. */
function loginWithTimbr(credentials) {
  return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
    .then(() => {
      addToDatabase();
    });
}

/* This function uses Firebase auth to sign in a user using Facebook. */
function loginWithFacebook() {
  return firebase.auth().signInWithPopup(facebookAuthProvider)
    .then(() => {
      addToDatabase();
    });
}

/* This function uses firebase auth to sign in a user using Google. */
function loginWithGoogle() {
  return firebase.auth().signInWithPopup(googleAuthProvider)
    .then(() => {
      addToDatabase();
    });
}

/* This function uses firebase auth to log out a user */
function logout() {
  return firebase.auth().signOut()
    .then(() => {
      console.log('User signed out!');
    })
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
