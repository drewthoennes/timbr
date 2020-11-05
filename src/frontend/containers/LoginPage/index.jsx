/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["handleAuth"] }] */
/* eslint-disable react/destructuring-assignment */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import map from '../../store/map';
import './styles.scss';
import { loginWithTimbr, loginWithGoogle, loginWithFacebook } from '../../store/actions/auth';
import constants from '../../store/const';

class LoginPage extends React.Component {
  constructor() {
    super();

    this.handleAuth = this.handleAuth.bind(this);

    this.state = {
      email: '',
      password: '',
    };
  }

  componentDidUpdate() {
    const { store: { account: { uid, username } }, history } = this.props;
    if (uid) {
      history.push(`/${username}`);
    }
  }

  /* This method handles login by sending user credentials to the corresponding function
    and redirecting to the home page. */
  handleAuth(option) {
    const { email, password } = this.state;
    const credentials = {
      email, password,
    };

    try {
      let loginMethod;

      switch (option) {
        case constants.LOGIN_WITH_TIMBR:
          loginMethod = () => loginWithTimbr(credentials);
          break;
        case constants.LOGIN_WITH_GOOGLE:
          loginMethod = loginWithGoogle;
          break;
        case constants.LOGIN_WITH_FACEBOOK:
          loginMethod = loginWithFacebook;
          break;
        default:
          break;
      }

      loginMethod()
        .catch((error) => {
          document.getElementById('error').innerHTML = error.message;
        });
    } catch (error) {
      if (document.getElementById('error')) {
        document.getElementById('error').innerHTML = error.message;
      }
    }
  }

  render() {
    const { history } = this.props;
    return (
      <div id="login-page">
        <h1>timbr Login Page!</h1>
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            this.handleAuth(constants.LOGIN_WITH_TIMBR);
          }}
        >
          <input
            id="email"
            type="text"
            placeholder="Email"
            onChange={(event) => { this.setState({ email: event.target.value }); }}
          />

          <input
            id="password"
            type="password"
            autoComplete="on"
            placeholder="Password"
            onChange={(event) => { this.setState({ password: event.target.value }); }}
          />

          <button type="submit">Login</button>
        </form>

        <button
          id="Facebook"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            this.handleAuth(constants.LOGIN_WITH_FACEBOOK);
          }}
        >
          Sign in with Facebook
        </button>

        <button
          id="Google"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            this.handleAuth(constants.LOGIN_WITH_GOOGLE);
          }}
        >
          Sign in with Google
        </button>
        <p id="error" />
        <button
          type="button"
          onClick={() => history.push('/register')}
        >
          Not a user? Register with timbr here.
        </button>
        <button
          type="button"
          onClick={() => history.push('/forget-password')}
        >
          Forgot your password? Reset it here.
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
      username: PropTypes.string,
    }),
  }).isRequired,
};

export default connect(map)(withRouter(LoginPage));
