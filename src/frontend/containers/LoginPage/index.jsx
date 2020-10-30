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
    const credentials = {
      email: document.getElementById('email').value,
      password: btoa(document.getElementById('password').value),
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

        <div className="row">
          <div className="col-sm-6">
            <div className="card">
              <div className="card-body">

                <h5 className="card-title">Log In With timbr</h5>
                <p className="card-text">Login card.</p>

                <button
                  id="Facebook"
                  type="button"
                  className="btn btn-primary"
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
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleAuth(constants.LOGIN_WITH_GOOGLE);
                  }}
                >
                  Sign in with Google
                </button>

                <form
                  id="login-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.handleAuth(constants.LOGIN_WITH_TIMBR);
                  }}
                >
                  <div className="form-group">
                    <input
                      id="email"
                      className="form-control"
                      type="text"
                      placeholder="Email"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      id="password"
                      className="form-control"
                      type="password"
                      placeholder="Password"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">Login</button>
                </form>
                <p id="error" />
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Sign-Up With timbr</h5>
                <p className="card-text">Don't have an account yet? Sign up now.</p>
                <button
                  type="button"
                  className="btn btn-primary"
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
