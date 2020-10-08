/* eslint-disable no-console */
/* eslint-disable no-alert */

import { firebase, facebookAuthProvider, googleAuthProvider } from '../../firebase/firebase';
import store from '../index';
import constants from '../const';

/* Updates the counter value. */
function updateCounter(currentCounter) {
  firebase.database().ref().update({ counter: currentCounter + 1 });
}

/* This method adds the current user to the database, if not already added. */
function addToDatabase() {
  const { uid, email } = firebase.auth().currentUser || { uid: '', email: '' };

  if (!uid) {
    return Promise.resolve();
  }

  let username = 'timbr-user-';
  const textsOn = false;
  const emailsOn = false;

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
          textsOn, // Stores a boolean value if the user has text notifications on or off
          emailsOn, // Stores a boolean value if the user has email notifications on or off
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
  return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
    .then(addToDatabase());
}

/* This function uses Firebase auth to sign in a user using Facebook. */
function loginWithFacebook() {
  return firebase.auth().signInWithPopup(facebookAuthProvider)
    .then(addToDatabase());
}

/* This function uses firebase auth to sign in a user using Google. */
function loginWithGoogle() {
  return firebase.auth().signInWithPopup(googleAuthProvider)
    .then(addToDatabase());
}

/* This function uses firebase auth to log out a user */
function logout() {
  return firebase.auth().signOut();
}

/* This function changes the username of the current username. */
function changeUsername(username) {
  // checks if the username is taken by a different user
  return firebase.database().ref('/users').orderByChild('username').equalTo(username)
    .once('value')
    .then((snapshot) => {
      if (snapshot.val()) {
        alert('Username Taken! Please select a different one.');
        return Promise.reject();
      }

      const { uid } = firebase.auth().currentUser || { uid: '' };
      if (!uid) {
        throw new Error('Provided username is already in use');
      }

      return firebase.database().ref(`users/${uid}`).once('value').then((user) => {
        if (!user.exists()) {
          throw new Error('Current user does not have an account');
        }

        return firebase.database().ref(`users/${uid}`).update({
          username,
        });
      });
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

/* This function changes the texts status of the current user. */
function changeTextsOn(textsOn) {
  const { account: { uid } } = store.getState();
  if (!uid) {
    return Promise.resolve();
  }

  return firebase.database().ref(`users/${uid}`).once('value', (user) => {
    if (user.exists()) {
      firebase.database().ref(`users/${uid}`).update({
        textsOn,
      });
    }
  });
}

/* This function is used to get the texts status of the current user. */
function getTextsOn(cb, myStore) {
  const { account: { uid } } = myStore;
  if (!uid) {
    return;
  }
  firebase.database().ref().child('users').child(uid)
    .child('textsOn')
    .on('value', cb);
}

/* This function changes the emails status of the current user. */
function changeEmailsOn(emailsOn) {
  const { account: { uid } } = store.getState();
  if (!uid) {
    return;
  }

  firebase.database().ref(`users/${uid}`).once('value', (user) => {
    if (user.exists()) {
      firebase.database().ref(`users/${uid}`).update({
        emailsOn,
      });
    }
  });
}

/* This function is used to get the texts status of the current user. */
function getEmailsOn(cb, myStore) {
  const { account: { uid } } = myStore;
  if (!uid) {
    return;
  }
  firebase.database().ref().child('users').child(uid)
    .child('emailsOn')
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
  changeTextsOn,
  getTextsOn,
  changeEmailsOn,
  getEmailsOn,
  setUID,
};
