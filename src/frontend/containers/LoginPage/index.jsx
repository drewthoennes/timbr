import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';
import map from '../../store/map';
import './styles.scss';
import {
  useSession,
  signin,
  signout
} from 'next-auth/client'


firebase.initializeApp({
  apiKey: "AIzaSyAKPviI0W3v3WuBBxMeZblLcr_t7Y63VAs",
  authDomain: "timbr-cs407.firebaseapp.com",
});


firebase.initializeApp({
  apiKey: "AIzaSyAKPviI0W3v3WuBBxMeZblLcr_t7Y63VAs",
  authDomain: "timbr-cs407.firebaseapp.com",
});


class LoginPage extends React.Component {
  constructor() {
    super();
    



    this.state = {};
  }

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> google auth complete with firebase
  state = {
    auth: false,
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => this.setState({ auth: !!user })
<<<<<<< HEAD
=======
=======
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
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

>>>>>>> google auth complete with firebase


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
    

<<<<<<< HEAD
=======


  render() {

>>>>>>> inital google signin
    return (
      <div id="login-page">
        <p>hi bitch</p>
      </div>
>>>>>>> inital google signin
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
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
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

<<<<<<< HEAD
<<<<<<< HEAD


export default connect(map)(withRouter(LoginPage));
=======
=======
>>>>>>> inital google signin
// export default connect(map)(withRouter(LoginPage));

export default function Page() 
{
  const [ session, loading ] = useSession()

  return <>
    {!session && <>
      Not signed in <br/>
      <button onClick={signin}>Sign in</button>
    </>}
    {session && <>
      Signed in as {session.user.email} <br/>
      <button onClick={signout}>Sign out</button>
    </>}
  </>
};
<<<<<<< HEAD
>>>>>>> inital google signin
=======
  }


};



export default connect(map)(withRouter(LoginPage));
>>>>>>> google auth complete with firebase
=======
>>>>>>> inital google signin
