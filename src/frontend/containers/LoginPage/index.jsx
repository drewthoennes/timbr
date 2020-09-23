import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';
import map from '../../store/map';
import './styles.scss';

firebase.initializeApp({
  apiKey: "AIzaSyAKPviI0W3v3WuBBxMeZblLcr_t7Y63VAs",
  authDomain: "timbr-cs407.firebaseapp.com",
});

class LoginPage extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  state = {
    auth: false,
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => this.setState({ auth: !!user })
    );
  }



  signIn = (event) => {
    console.log(event);
    event.preventDefault();
    const prv = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(prv)
      .then(function (result) {
        var user = result.user;
      })
  };



  signOut = () => {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
    }).catch(function (error) {
      // An error happened.
    });
  }



  render() {
    if (!this.state.auth) {
      return (
        <div>
          <h1>Click below to sign-in</h1>
          <button onClick={this.signIn.bind(this)}>SIGN IN</button>
        </div>
      );

    }
    return (
      <div>
        <h1>Click below to sign-out</h1>
        <button onClick={this.signOut.bind(this)}>SIGN OUT</button>

      </div>
    );


  }


};


export default connect(map)(withRouter(LoginPage));

