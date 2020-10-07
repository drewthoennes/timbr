/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import './styles.scss';
import map from '../../store/map';
import accountActions from '../../store/actions/account';

class RegisterPage extends React.Component {
  constructor() {
    super();

    this.handleRegister = this.handleRegister.bind(this);
  }

  componentDidUpdate() {
    const { store: { account: { uid } }, history } = this.props;
    if (uid) {
      history.push('/');
    }
  }

  handleRegister(e) {
    e.preventDefault();
    const { history } = this.props;

    /* This method handles registration of a new user by sending the user credentials to the
        corresponding function and redirecting to the login page. */
    const credentials = {
      email: document.getElementById('email').value,
      password: btoa(document.getElementById('password').value),
    };

    // Redirects to the login page if registration successful. Else, displays the error message.
    accountActions.registerWithTimbr(credentials)
      .then(() => {
        history.push('/login');
      })
      .catch((error) => {
        document.getElementById('error').innerHTML = error.message;
      });
  }

  render() {
    const { history } = this.props;
    return (
      <div id="register-page">
        <h1>timbr Register Page!</h1>
        <button
          type="button"
          onClick={() => history.push('/login')}
        >
          Already a user? Go to login
        </button>

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

RegisterPage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
    }),
  }).isRequired,
};

export default connect(map)(withRouter(RegisterPage));
