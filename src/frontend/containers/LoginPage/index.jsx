/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["handleAuth"] }] */
/* eslint-disable react/destructuring-assignment */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import map from '../../store/map';
import './styles.scss';
import { loginWithTimbr, loginWithGoogle, loginWithFacebook } from '../../store/actions/account';
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
        <div class="row h-100 ml-4 mr-4">
        <div class="col-sm-6 my-auto">
            <div class="card h-100 border-primary">
              <div class="card-body text-center">
              <button
          id="Facebook"
          type="button"
          class="btn btn-primary"
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
          class="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            this.handleAuth(constants.LOGIN_WITH_GOOGLE);
          }}
        >
          Sign in with Google
        </button>
        
        <form
          id="login-form"
          class="mt-3 mb-3"
          onSubmit={(e) => {
            e.preventDefault();
            this.handleAuth(constants.LOGIN_WITH_TIMBR);
          }}
        >
          <fieldset>
          <div class="form-group">
          <input
            id="email"
            type="email"
            class="form-control"
            placeholder="Enter email"
            onChange={(event) => { this.setState({ email: event.target.value }); }}
          />
          </div>
          <div class="form-group">
          <input
            id="password"
            type="password"
            class="form-control"
            autoComplete="on"
            placeholder="Password"
            onChange={(event) => { this.setState({ password: event.target.value }); }}
          />
          </div>

          <button type="submit" class="btn btn-primary">Login</button>
          </fieldset>
        </form>
        <button
          type="button"
          class="btn btn-link"
          onClick={() => history.push('/forget-password')}
        >
          Forgot your password? Reset it here.
        </button>
        <p id="error" />
        </div>
        </div>
        </div>
        <div class="col-sm-6 my-auto">
            <div class="card h-100 border-primary">
              <div class="card-body text-center my-auto">
        <button
          type="button"
          class="btn btn-primary"
          onClick={() => history.push('/register')}
        >
          Not a user? Register with timbr here.
        </button>
        
        </div>
        </div>
        </div>
      </div>
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
