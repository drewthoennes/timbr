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
  }

  handleRegister(e) {
    e.preventDefault();
    /* This method handles registration of a new user by sending the user credentials to the
        corresponding function and redirecting to the login page. */
    const credentials = {
      email: document.getElementById('email').value,
      password: btoa(document.getElementById('password').value),
    };

    authentication(AuthOptions.REGISTER_WITH_TIMBR, credentials)
      .then(() => {
        console.log('User created!');
        // This redirection not working!
        history.push('/login');
      })
      .catch((error) => {
        document.getElementById('error').innerHTML = error.message;
      });
  }

  render() {
    return (
      <div id="register-page">
        <h1>timbr Register Page!</h1>
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
        <p id="error"> </p>
      </div>
    );
  }
}

export default connect(map)(withRouter(RegisterPage));
