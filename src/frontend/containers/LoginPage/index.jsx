/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["handleAuth"] }] */
/* eslint-disable react/destructuring-assignment */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import map from '../../store/map';
import './styles.scss';
import accountActions from '../../store/actions/account';
import constants from '../../store/const';

class LoginPage extends React.Component {
  constructor() {
    super();

    this.handleAuth = this.handleAuth.bind(this);
  }

  componentDidUpdate() {
    const { store: { account: { uid } }, history } = this.props;
    if (uid) {
      history.push('/');
    }
  }

  /* This method handles login by sending user credentials to the corresponding function
    and redirecting to the home page. */
  async handleAuth(option) {
    const { history } = this.props;

    // TODO: Validate credentials.
    const credentials = {
      email: document.getElementById('email').value,
      password: btoa(document.getElementById('password').value),
    };

    // TODO: Handle errors returned by firebase, redirect only if login successful.

    let loginMethod;

    switch (option) {
      case constants.LOGIN_WITH_TIMBR:
        loginMethod = () => accountActions.loginWithTimbr(credentials);
        break;
      case constants.LOGIN_WITH_GOOGLE:
        loginMethod = accountActions.loginWithGoogle;
        break;
      case constants.LOGIN_WITH_FACEBOOK:
        loginMethod = accountActions.loginWithFacebook;
        break;
      default:
        break;
    }

    await loginMethod();
    history.push('/');
  }

  render() {
    return (
      <div id="login-page">
        <h1>timbr Login Page!</h1>
        <form id="login-form" onSubmit={() => this.handleAuth(constants.LOGIN_WITH_TIMBR)}>
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
          onClick={() => this.handleAuth(constants.LOGIN_WITH_FACEBOOK)}
        >
          SIGN IN WITH FACEBOOK
        </button>

        <button
          id="Google"
          type="button"
          onClick={() => this.handleAuth(constants.LOGIN_WITH_GOOGLE)}
        >
          SIGN IN WITH GOOGLE
        </button>
      </div>
    );
  }
}

LoginPage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
    }),
  }).isRequired,
};

export default connect(map)(withRouter(LoginPage));
