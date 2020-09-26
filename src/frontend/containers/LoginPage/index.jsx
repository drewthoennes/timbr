/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["handleLogin"] }] */
/* eslint-disable react/destructuring-assignment */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import map from '../../store/map';
import './styles.scss';
import history from '../../router/history';
import authentication from '../../store/actions/auth';

class LoginPage extends React.Component {
  constructor() {
    super();

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    /* This method handles login by sending user credentials to the corresponding function
        and redirecting to the home page. */
    // TODO: Validate credentials.
    const credentials = {
      email: document.getElementById('email').value,
      password: btoa(document.getElementById('password').value),
    };

    // TODO: Handle errors returned by firebase, redirect only if login successful.
    authentication('login', credentials);
    history.push('/');
  }

  render() {
    return (
      <div id="login-page">
        <h1>timbr Login Page!</h1>
        <form id="login-form" onSubmit={this.handleLogin}>
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
      </div>
    );
  }
}

export default connect(map)(withRouter(LoginPage));
