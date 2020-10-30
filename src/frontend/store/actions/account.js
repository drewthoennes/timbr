/* eslint-disable no-console */
/* eslint-disable no-alert */

import { firebase, facebookAuthProvider, googleAuthProvider } from '../../firebase/firebase';
import store from '../index';
import constants from '../const';

/* Updates the counter value. */
export function updateCounter(currentCounter) {
  firebase.database().ref().update({ counter: currentCounter + 1 });
}

/* This funciton is used to get the auth provider of the current user. */
export function getProviderId() {
  return firebase.auth().currentUser.providerData[0].providerId;
}

/* This method adds the current user to the database, if not already added. */
export function addToDatabase() {
  const { uid, email } = firebase.auth().currentUser || { uid: '', email: '' };

  if (!uid) {
    return Promise.resolve();
  }

  let username = 'timbr-user-';
  const textsOn = false;
  const emailsOn = false;
  const phoneNumber = '+10000000000';
  const profilePic = false;

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
          phoneNumber,
          textsOn, // Stores a boolean value if the user has text notifications on or off
          emailsOn, // Stores a boolean value if the user has email notifications on or off
          profilePic,
        });
      });
    }
  });
}

export function reauthenticateUser(password) {
  const user = firebase.auth().currentUser;

  switch (getProviderId()) {
    case constants.FACEBOOK_PROVIDER_ID:
      return user.reauthenticateWithPopup(facebookAuthProvider);
    case constants.GOOGLE_PROVIDER_ID:
      return user.reauthenticateWithPopup(googleAuthProvider);
    case constants.EMAIL_PROVIDER_ID:
      return user.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(
        user.email,
        password,
      ));
    default:
  }
  return Promise.resolve();
}

/* This method uses firebase auth to create a new user. */
export function registerWithTimbr(credentials) {
  return firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
    .then(() => {
      if (firebase.auth().currentUser) {
        addToDatabase();
      }
    });
}

/* This method uses firebase auth to sign in a user. */
export function loginWithTimbr(credentials) {
  return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password);
}

/* This function uses Firebase auth to sign in a user using Facebook. */
export function loginWithFacebook() {
  return firebase.auth().signInWithPopup(facebookAuthProvider)
    .then(addToDatabase);
}

/* This function uses firebase auth to sign in a user using Google. */
export function loginWithGoogle() {
  return firebase.auth().signInWithPopup(googleAuthProvider)
    .then(addToDatabase);
}

/* This function uses firebase auth to log out a user */
export function logout() {
  return firebase.auth().signOut();
}

/* This function changes the username of the current username. */
export function changeUsername(username) {
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
  // checks if the phone number is taken by a different user
  return firebase.database().ref('/users').orderByChild('phoneNumber').equalTo(number)
    .once('value')
    .then((snapshot) => {
      if (snapshot.val()) {
        alert('Phone number taken! Please enter a different one.');
        return Promise.reject();
      }

      const { uid } = firebase.auth().currentUser || { uid: '' };
      if (!uid) {
        throw new Error('No uid');
      }

      return firebase.database().ref(`users/${uid}`).once('value').then((user) => {
        if (!user.exists()) {
          throw new Error('Current user does not have an account');
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

export function getProfilePicture(cb) {
  const { account: { uid } } = store.getState();
  if (!uid) {
    return Promise.resolve();
  }

  return firebase.database().ref(`users/${uid}`).once('value', (user) => {
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
export function getEmailsOn(cb, myStore) {
  const { account: { uid } } = myStore;
  if (!uid) {
    return;
  }
  firebase.database().ref().child('users').child(uid)
    .child('emailsOn')
    .on('value', cb);
}

/* This function is used to delete a user. */
export function deleteAccount(password) {
  const { account: { uid } } = store.getState();
  const userRef = firebase.database().ref().child('users').child(uid);
  const pictureRef = firebase.storage().ref().child('profile-pictures');

  return reauthenticateUser(password).then(() => {
    userRef.once('value', (user) => {
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

export function changeProfilePicture(file) {
  const { account: { uid } } = store.getState();
  const storageRef = firebase.storage().ref();

  return storageRef.child(`profile-pictures/${uid}`).put(file)
    .then(() => {
      firebase.database().ref(`users/${uid}`).once('value', (user) => {
        if (user.exists()) {
          firebase.database().ref(`users/${uid}`).update({
            profilePic: true,
          });
        }
      });
    });
}

/* This function sends a reset password email to the given email. */
export function forgotPassword(email) {
  const auth = firebase.auth();
  return auth.sendPasswordResetEmail(email);
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
