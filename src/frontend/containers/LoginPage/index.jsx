/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["handleAuth"] }] */
/* eslint-disable react/destructuring-assignment */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';
import map from '../../store/map';
import './styles.scss';
import history from '../../router/history';
import authentication from '../../store/reducers/auth';
import AuthOptions from '../../store/const';

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      auth: false,
    };
  }

  /* Changes the state if auth state changed. */
  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => this.setState({ auth: !!user }),
    );
    this.handleAuth = this.handleAuth.bind(this);
  }

  handleAuth(option) {
    /* This method handles login by sending user credentials to the corresponding function
        and redirecting to the home page. */

    // TODO: Validate credentials.
    const credentials = {
      email: document.getElementById('email').value,
      password: btoa(document.getElementById('password').value),
    };

    // TODO: Handle errors returned by firebase, redirect only if login successful.
    authentication(option, credentials);
    history.push('/');
  }

  render() {
    // TODO: Redirect to home page if the user is already signed in.
    const { auth } = this.state.auth;
    if (auth) {
      // redirect to home page, will add this once sign out is integrated.
    }
    return (
      <div id="login-page">
        <h1>timbr Login Page!</h1>
        <form id="login-form" onSubmit={() => this.handleAuth(AuthOptions.LOGIN_WITH_TIMBR)}>
          <input
            id="email"
            type="text"
            placeholder="Email"
          />

          <input
            id="password"
            type="password"
            placeholder="Password"
          />

          <button type="submit">Login</button>
        </form>

        <button
          id="Facebook"
          type="button"
          onClick={() => this.handleAuth(AuthOptions.LOGIN_WITH_FACEBOOK)}
        >
          SIGN IN WITH FACEBOOK
        </button>

        <button
          id="Google"
          type="button"
          onClick={() => this.handleAuth(AuthOptions.LOGIN_WITH_GOOGLE)}
        >
          SIGN IN WITH GOOGLE
        </button>
      </div>
    );
  }
}
export default connect(map)(withRouter(LoginPage));
