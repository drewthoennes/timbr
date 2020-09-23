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


<<<<<<< HEAD
firebase.initializeApp({
  apiKey: "AIzaSyAKPviI0W3v3WuBBxMeZblLcr_t7Y63VAs",
  authDomain: "timbr-cs407.firebaseapp.com",
});


=======
>>>>>>> 354f416927979786ced9277a1e8c902044bb4926
class LoginPage extends React.Component {
  constructor() {
    super();


<<<<<<< HEAD

    this.state = {};
  }

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> google auth complete with firebase
=======
    this.state = {};
  }

>>>>>>> 354f416927979786ced9277a1e8c902044bb4926
  state = {
    auth: false,
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => this.setState({ auth: !!user })
<<<<<<< HEAD
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
    return (
      <div id="login-page">
        <p>hi bitch</p>
      </div>
>>>>>>> inital google signin
=======
>>>>>>> 354f416927979786ced9277a1e8c902044bb4926
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
>>>>>>> inital google signin
=======
  }


};



export default connect(map)(withRouter(LoginPage));
>>>>>>> google auth complete with firebase
=======


export default connect(map)(withRouter(LoginPage));
>>>>>>> 354f416927979786ced9277a1e8c902044bb4926
