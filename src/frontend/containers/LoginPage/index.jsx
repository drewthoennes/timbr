import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';
import map from '../../store/map';
import './styles.scss';

firebase.initializeApp({
  apiKey: 'AIzaSyAKPviI0W3v3WuBBxMeZblLcr_t7Y63VAs',
  authDomain: 'timbr-cs407.firebaseapp.com',
});

function signInGoogle(event) {
  // console.log(event);
  event.preventDefault();
  const prv = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(prv);
  /*
    .then((result) => {
      const { user } = result;
    });
  */
}

function signInFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  // firebase.auth().signInWithPopup(provider).then((result) => {
  firebase.auth().signInWithPopup(provider).then(() => {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    // const token = result.credential.accessToken;
    // The signed-in user info.
    // const { user } = result;
    // ...
  // }).catch((error) => {
  }).catch(() => {
    // Handle Errors here.
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // The email of the user's account used.
    // const { email } = error;
    // The firebase.auth.AuthCredential type that was used.
    // const { credential } = error;
    // ...
  });
}

function signOut() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
  }).catch(() => {
    // An error happened.
  });
}

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      auth: false,
    };
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => this.setState({ auth: !!user }),
    );
  }

  render() {
    const { auth } = this.state;

    if (!auth) {
      return (
        <div>
          <h1>Click below to sign-in</h1>
          <button type="button" onClick={signInGoogle}>SIGN IN WITH GOOGLE</button>
          <button type="button" onClick={signInFacebook}>SIGN IN WITH FACEBOOK</button>
        </div>
      );
    }
    return (
      <div>
        <h1>Click below to sign-out</h1>
        <button type="button" onClick={signOut}>SIGN OUT</button>

      </div>
    );
  }
}
export default connect(map)(withRouter(LoginPage));
