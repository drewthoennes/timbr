import { firebase, facebookAuthProvider, googleAuthProvider } from '../../firebase/firebase';
import constants from '../const';

/* This funciton is used to get the auth provider of the current user. */
export function getProviderId() {
  return firebase.auth().currentUser.providerData[0].providerId;
}

/* Updates the counter value. */
export function updateCounter(currentCounter) {
  firebase.database().ref().update({ counter: currentCounter + 1 });
}

/* This method adds the current user to the database, if not already added. */
export function addToDatabase() {
  const { uid, email } = firebase.auth().currentUser || { uid: '', email: '' };

  if (!uid) {
    return Promise.resolve();
  }

  let username = constants.USERNAME_PREFIX;
  const textsOn = false;
  const emailsOn = false;
  const newAcc = true;
  const phoneNumber = constants.DEFAULT_PHONE_NUMBER;
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
          newAcc,
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

/* This function is used to change a user's password. */
export function changePassword(newpwd) {
  const user = firebase.auth().currentUser;

  return user.updatePassword(newpwd);
}

/* This function sends a reset password email to the given email. */
export function forgotPassword(email) {
  const auth = firebase.auth();
  return auth.sendPasswordResetEmail(email);
}

/* This function gets the sign in method for the given email. */
export function getSignInMethod(email) {
  const auth = firebase.auth();
  return auth.fetchSignInMethodsForEmail(email);
}
