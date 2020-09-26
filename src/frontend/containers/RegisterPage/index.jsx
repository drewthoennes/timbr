/* eslint no-console: ["error", { allow: ["log", "err"] }] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["handleRegister"] }] */
/* eslint-disable react/destructuring-assignment */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './styles.scss';
import map from '../../store/map';
import history from '../../router/history';
import authentication from '../../store/reducers/auth';
import AuthOptions from '../../store/const';

class RegisterPage extends React.Component {
  constructor() {
    super();

    this.handleRegister = this.handleRegister.bind(this);

    this.state = {
      error: '',
    };
  }

  errorMessage() {
    const { error } = this.state.error;
    return error;
  }

  handleRegister(e) {
    e.preventDefault();
    /* This method handles registration of a new user by sending the user credentials to the
        corresponding function and redirecting to the login page. */
    // TODO: Validate credentials.
    const credentials = {
      email: document.getElementById('email').value,
      password: btoa(document.getElementById('password').value),
    };

    // TODO: Handle errors returned by firebase, redirect only if registration successful.
    authentication(AuthOptions.REGISTER_WITH_TIMBR, credentials);
    history.push('/login');
  }

  render() {
    return (
      <div id="register-page">
        <h1>timbr Register Page!</h1>
        <p>{this.errorMessage}</p>
        <form
          id="register-form"
          onSubmit={this.handleRegister}
        >

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
