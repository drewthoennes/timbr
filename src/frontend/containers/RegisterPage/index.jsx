/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["handleRegister"] }] */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './styles.scss';
import axios from 'axios';
import map from '../../store/map';
import history from '../../router/history';

class RegisterPage extends React.Component {
  constructor() {
    super();

    this.handleRegister = this.handleRegister.bind(this);
  }

  handleRegister() {
    /* This method handles registration of a new user by sending the user credentials to the
        corresponding endpoint and redirecting to the login page. */
    // TODO: Validate credentials.
    const credentials = {
      email: document.getElementById('email').value,
      password: btoa(document.getElementById('password').value),
    };

    // TODO: Handle errors returned by firebase.
    axios
      .post('/api/register', credentials)
      .catch((err) => console.log(err))
      .then((res) => console.log(res.data));

    // TODO: Make sure the redirection occurs only when registration was successful.
    history.push('/login');
  }

  render() {
    return (
      <div id="register-page">
        <h1>timbr Register Page!</h1>
        <form id="register-form" onSubmit={this.handleRegister}>
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

          <button type="submit">Register</button>
        </form>
      </div>
    );
  }
}

export default connect(map)(withRouter(RegisterPage));
