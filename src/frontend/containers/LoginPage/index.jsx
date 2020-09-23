import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';
import map from '../../store/map';
import './styles.scss';
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======

<<<<<<< HEAD
firebase.initializeApp({
  apiKey: "AIzaSyAKPviI0W3v3WuBBxMeZblLcr_t7Y63VAs",
  authDomain: "timbr-cs407.firebaseapp.com",
});
>>>>>>> google auth complete with firebase
=======
>>>>>>> changes

firebase.initializeApp({
  apiKey: "AIzaSyAKPviI0W3v3WuBBxMeZblLcr_t7Y63VAs",
  authDomain: "timbr-cs407.firebaseapp.com",
});
>>>>>>> google auth complete with firebase

firebase.initializeApp({
  apiKey: "AIzaSyAKPviI0W3v3WuBBxMeZblLcr_t7Y63VAs",
  authDomain: "timbr-cs407.firebaseapp.com",
});

class LoginPage extends React.Component {
  constructor() {
    super();
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> google auth complete with firebase
=======

>>>>>>> google auth complete with firebase
=======
    

>>>>>>> changes

    this.state = {};
  }

  state = {
    auth: false,
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => this.setState({ auth: !!user })
<<<<<<< HEAD
    );
  }

<<<<<<< HEAD
<<<<<<< HEAD


=======
>>>>>>> google auth complete with firebase
=======
>>>>>>> google auth complete with firebase
  signIn = (event) => {
    console.log(event);
    event.preventDefault();
    const prv = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(prv)
      .then(function (result) {
        var user = result.user;
      })
  };

<<<<<<< HEAD
<<<<<<< HEAD


  signOut = () => {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
    }).catch(function (error) {
=======
=======
>>>>>>> google auth complete with firebase
  

  signOut = () => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
<<<<<<< HEAD
>>>>>>> google auth complete with firebase
=======
>>>>>>> google auth complete with firebase
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
<<<<<<< HEAD
<<<<<<< HEAD

    }
    return (
      <div>
        <h1>Click below to sign-out</h1>
        <button onClick={this.signOut.bind(this)}>SIGN OUT</button>

      </div>
=======
>>>>>>> changes
    );


=======

    }
      return (
        <div>
          <h1>Click below to sign-out</h1>
          <button onClick={this.signOut.bind(this)}>SIGN OUT</button>

        </div>
      );
    

>>>>>>> google auth complete with firebase
=======

    }
      return (
        <div>
          <h1>Click below to sign-out</h1>
          <button onClick={this.signOut.bind(this)}>SIGN OUT</button>

        </div>
      );
    

>>>>>>> google auth complete with firebase
  }


};

<<<<<<< HEAD

<<<<<<< HEAD
<<<<<<< HEAD
export default connect(map)(withRouter(LoginPage));

=======

export default connect(map)(withRouter(LoginPage));
>>>>>>> google auth complete with firebase
=======
=======
>>>>>>> changes

export default connect(map)(withRouter(LoginPage));
<<<<<<< HEAD
>>>>>>> google auth complete with firebase
=======
>>>>>>> changes
