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
import googleLogo from '../../assets/images/google_logo.png';
import facebookLogo from '../../assets/images/facebook_logo.png';

class LoginPage extends React.Component {
  constructor() {
    super();

    this.handleAuth = this.handleAuth.bind(this);

    this.state = {
      email: '',
      password: '',
      googleLogo,
      facebookLogo,
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
        <h1 className="text-center pt-5 pb-2">timbr</h1>
        <h3 className="text-center" style={{ color: 'white' }}><i>your plants need some love</i></h3>
        <div className="row h-100 ml-4 mr-4">
          <div className="col-sm-6 my-auto">
            <div className="card h-100 border-primary">
              <div className="card-body text-center my-auto">
                <h4 className="mt-2 mb-5">Register</h4>
                <p className="mt-5 mb-0 pt-2 lead text-muted">Don't have a timbr account yet?</p>
                <p className="mt-0 mb-4 lead text-muted">Sign-up now!</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => history.push('/register')}
                >
                  CREATE ACCOUNT
                </button>

              </div>
            </div>
          </div>
          <div className="col-sm-6 my-auto">
            <div className="card h-100 border-primary">
              <div className="card-body text-center">
                <h4 className="mt-2 mb-3">Login</h4>
                <button
                  id="Google"
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleAuth(constants.LOGIN_WITH_GOOGLE);
                  }}
                >
                  <img className="photo" alt="" src={this.state.googleLogo} />
                  {' '}
                  Sign in with Google
                </button>
                <button
                  id="Facebook"
                  type="button"
                  className="btn btn-outline-primary ml-3"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleAuth(constants.LOGIN_WITH_FACEBOOK);
                  }}
                >
                  <img className="photo" alt="" src={this.state.facebookLogo} />
                  {' '}
                  Sign in with Facebook
                </button>
                <form
                  id="login-form"
                  className="mt-3 mb-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.handleAuth(constants.LOGIN_WITH_TIMBR);
                  }}
                >
                  <fieldset>
                    <div className="form-group">
                      <input
                        id="email"
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        onChange={(event) => { this.setState({ email: event.target.value }); }}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        id="password"
                        type="password"
                        className="form-control"
                        autoComplete="on"
                        placeholder="Password"
                        onChange={(event) => { this.setState({ password: event.target.value }); }}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary">LOGIN</button>
                  </fieldset>
                </form>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => history.push('/forget-password')}
                >
                  Forgot your password?
                </button>
                <p id="error" />
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
