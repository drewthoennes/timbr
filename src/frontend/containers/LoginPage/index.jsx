/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["handleLogin"] }] */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import map from '../../store/map';
import './styles.scss';
import history from '../../router/history';

class LoginPage extends React.Component {
  constructor() {
    super();

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    /* This method handles login by sending user credentials to the corresponding endpoint,
        setting the current user's email and redirecting to the home page. */
    // TODO: Validate credentials.
    const credentials = {
      email: document.getElementById('email').value,
      password: btoa(document.getElementById('password').value),
    };

    // TODO: Handle errors returned by firebase.
    axios
      .post('/api/login', credentials)
      .catch((err) => console.log(err))
      .then((res) => console.log(res.data));

    // TODO: Make sure the next two lines happen only if login was successful.
    history.push('/');
    localStorage.setItem('currentUser', document.getElementById('email').value);
  }

  render() {
    return (
      <div id="login-page">
        <h1>timbr Login Page!</h1>
        <form id="register-form" onSubmit={this.handleLogin}>
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
