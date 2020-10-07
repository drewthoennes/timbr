/* eslint-disable no-console */
import { firebase, facebookAuthProvider, googleAuthProvider } from '../../firebase/firebase';
import store from '../index';
import constants from '../const';

/* Updates the counter value. */
function updateCounter(currentCounter) {
  firebase.database().ref().update({ counter: currentCounter + 1 });
}

/* This method adds the current user to the database, if not already added. */
function addToDatabase() {
  const { uid, email } = firebase.auth().currentUser;

  if (!uid) {
    return Promise.resolve();
  }

  let username = 'timbr-user-';

  // check if the user exists in the database
  return firebase.database().ref(`users/${uid}`).once('value', (user) => {
    if (!user.exists()) {
      // get and increment the counter value and create the username
      firebase.database().ref('counter').once('value', (counter) => {
        username += counter.val();
        updateCounter(counter.val());

        // set the values in the database
        firebase.database().ref(`users/${uid}`).set({
          email,
          username,
        });
      });
    }
  });
}

/* This method uses firebase auth to create a new user. */
function registerWithTimbr(credentials) {
  return firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
    .then(() => {
      if (firebase.auth().currentUser) {
        addToDatabase();
      }
    });
}

/* This method uses firebase auth to sign in a user. */
function loginWithTimbr(credentials) {
  return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password);
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
  return firebase.auth().signOut();
}

/* This function changes the username of the current username. */
function changeUsername(username) {
  const { account: { uid } } = store.getState();
  if (!uid) {
    return;
  }

  firebase.database().ref(`users/${uid}`).once('value', (user) => {
    if (user.exists()) {
      firebase.database().ref(`users/${uid}`).update({
        username,
      });
    }
  });
}

/* This function is used to get the username of the current user. */
function getUsername(cb, myStore) {
  const { account: { uid } } = myStore;
  if (!uid) {
    return;
  }
  firebase.database().ref().child('users').child(uid)
    .child('username')
    .on('value', cb);
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
  changeUsername,
  getUsername,
  setUID,
};
