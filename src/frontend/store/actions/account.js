/* eslint-disable no-console */
/* eslint-disable no-alert */

import { firebase } from '../../firebase/firebase';
import { addToDatabase, reauthenticateUser } from './auth';
import store from '../index';
import constants from '../const';

/* This function changes the username of the current username. */
export function changeUsername(username) {
  // checks if the username is taken by a different user
  return firebase.database().ref('/users').orderByChild('username').equalTo(username)
    .once('value')
    .then((snapshot) => {
      if (snapshot.val()) {
        alert('Could not set username because it is taken by another user.');
        return Promise.reject();
      }

      const { uid } = firebase.auth().currentUser || { uid: '' };
      if (!uid) {
        return Promise.reject(new Error('Provided username is already in use'));
      }

      return firebase.database().ref(`users/${uid}`).once('value').then((user) => {
        if (!user.exists()) {
          return Promise.reject(new Error('Current user does not have an account'));
        }

        return firebase.database().ref(`users/${uid}`).update({
          username,
        });
      });
    });
}

/* This function checks if the current user's email is verified. */
export function isEmailVerified() {
  return firebase.auth().currentUser.emailVerified;
}

/* This function sends verification email to the current user. */
export function sendVerificationEmail() {
  return firebase.auth().currentUser.sendEmailVerification();
}

/* This method uses firebase auth to create a new user. */
export function registerWithTimbr(credentials) {
  return firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
    .then(() => {
      if (firebase.auth().currentUser) {
        addToDatabase()
          .then(() => {
            if (credentials.username) {
              changeUsername(credentials.username);
            }
            sendVerificationEmail();
          });
      }
    });
}

/* This function is used to get the username of the current user. */
export function getUsername(cb, myStore) {
  const { account: { uid } } = myStore;
  if (!uid) {
    return;
  }
  firebase.database().ref().child('users').child(uid)
    .child('username')
    .on('value', cb);
}

/* This function is used to get the phone number of the current user. */
export function getPhoneNumber(cb) {
  const { account: { uid } } = store.getState();
  if (!uid) {
    return;
  }
  firebase.database().ref().child('users').child(uid)
    .child('phoneNumber')
    .on('value', cb);
}

/* This function is used to change the phone number of the current user. */
export function changePhoneNumber(number) {
  const { uid } = firebase.auth().currentUser || { uid: '' };
  if (!uid) {
    return Promise.reject(new Error('No uid'));
  }

  // checks if the phone number is taken by a different user
  return firebase.database().ref('/users').orderByChild('phoneNumber').equalTo(number)
    .once('value')
    .then((snapshot) => {
      if (snapshot.val()) {
        alert('Phone number taken! Please enter a different one.');
        return Promise.reject();
      }

      return firebase.database().ref(`users/${uid}`).once('value').then((user) => {
        if (!user.exists()) {
          return Promise.reject(new Error('Current user does not have an account'));
        }

        const phoneNumber = `+1${number}`;
        return firebase.database().ref(`users/${uid}`).update({
          phoneNumber,
        });
      });
    });
}

/* This function changes the texts status of the current user. */
export function changeTextsOn(textsOn) {
  const { uid } = firebase.auth().currentUser || { uid: '' };
  if (!uid) {
    return Promise.resolve();
  }

  return firebase.database().ref(`users/${uid}`).once('value').then((user) => {
    if (user.exists()) {
      firebase.database().ref(`users/${uid}`).update({
        textsOn,
      });
    }
  });
}

/* This function is used to get the texts status of the current user. */
export function getTextsOn(cb, myStore) {
  const { account: { uid } } = myStore;
  if (!uid) {
    return;
  }
  firebase.database().ref().child('users').child(uid)
    .child('textsOn')
    .on('value', cb);
}

/* This function changes the emails status of the current user. */
export function changeEmailsOn(emailsOn) {
  const { uid } = firebase.auth().currentUser || { uid: '' };
  if (!uid) {
    return Promise.resolve();
  }

  return firebase.database().ref(`users/${uid}`).once('value').then((user) => {
    if (user.exists()) {
      firebase.database().ref(`users/${uid}`).update({
        emailsOn,
      });
    }
  });
}

/* This function is used to get the texts status of the current user. */
export function getEmailsOn(cb, myStore) {
  const { account: { uid } } = myStore;
  if (!uid) {
    return;
  }
  firebase.database().ref().child('users').child(uid)
    .child('emailsOn')
    .on('value', cb);
}

export function getProfilePicture(cb) {
  const { uid } = firebase.auth().currentUser || { uid: '' };
  if (!uid) {
    return Promise.resolve();
  }

  return firebase.database().ref(`users/${uid}`).once('value').then((user) => {
    if (user.exists() && user.val().profilePic) {
      const pictureRef = firebase.storage().ref().child(`profile-pictures/${uid}`);
      pictureRef.getDownloadURL()
        .then(cb)
        .catch((error) => {
          // Do nothing if the user does not have a profile pic sent
          console.log(error.message);
        });
    }
  });
}

export function changeProfilePicture(file) {
  const { uid } = firebase.auth().currentUser || { uid: '' };
  const storageRef = firebase.storage().ref();

  return storageRef.child(`profile-pictures/${uid}`).put(file)
    .then(() => {
      firebase.database().ref(`users/${uid}`).once('value').then((user) => {
        if (user.exists()) {
          firebase.database().ref(`users/${uid}`).update({
            profilePic: true,
          });
        }
      });
    });
}

/* This function is used to delete a user. */
export function deleteAccount(password) {
  const { uid } = firebase.auth().currentUser || { uid: '' };
  const userRef = firebase.database().ref().child('users').child(uid);
  const pictureRef = firebase.storage().ref().child('profile-pictures');

  return reauthenticateUser(password).then(() => {
    userRef.once('value').then((user) => {
      if (user.exists() && user.val().profilePic) {
        pictureRef.child(uid).delete()
          .catch((error) => {
            console.log(error.message);
          });
      }
    })
      .then(() => {
        userRef.remove()
          .then(() => {
            firebase.auth().currentUser.delete();
          });
      });
  });
}

export function setUID(uid) {
  store.dispatch({
    type: constants.SET_UID,
    uid,
  });
}

export function setUsername(username) {
  store.dispatch({
    type: constants.SET_USERNAME,
    username,
  });
}

export function setEmail(email) {
  store.dispatch({
    type: constants.SET_EMAIL,
    email,
  });
}

export function setTextsOn(textsOn) {
  store.dispatch({
    type: constants.SET_TEXTS_ON,
    textsOn,
  });
}

export function setEmailsOn(emailsOn) {
  store.dispatch({
    type: constants.SET_EMAILS_ON,
    emailsOn,
  });
}

export function setAccountLoaded() {
  store.dispatch({
    type: constants.SET_ACCOUNT_LOADED,
  });
}
