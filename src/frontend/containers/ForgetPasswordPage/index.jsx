/* eslint-disable no-alert */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import map from '../../store/map';
import { forgotPassword, getSignInMethod } from '../../store/actions/auth';
import constants from '../../store/const';

class ForgetPasswordPage extends React.Component {
  constructor() {
    super();

    this.sendResetEmail = this.sendResetEmail.bind(this);

    this.setError = this.setError.bind(this);
    this.state = {
      email: '',
      error: '',
    };

    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setError(error) {
    if (this.mounted) {
      this.setState({
        error,
      });
    }
  }

  sendResetEmail() {
    const { email } = this.state;
    const { history } = this.props;

    getSignInMethod(email)
      .then((providers) => {
        // allow password reset if the provider is email
        if (providers.includes(constants.EMAIL_PROVIDER_ID)) {
          forgotPassword(email)
            .then(() => {
              alert(`Password reset email successfully sent to ${email}.`);
              history.push('/login');
            })
            .catch((error) => {
              this.setError(error.message);
            });
        } else if (providers.includes(constants.FACEBOOK_PROVIDER_ID)
                      || providers.includes(constants.GOOGLE_PROVIDER_ID)) {
          // don't allow password reset for fb/google accountd
          this.setError('Can not reset passwors for external accounts.');
        } else {
          // any other provider is invalid
          this.setError('Invalid email.');
        }
      })
      .catch((error) => {
        this.setError(error.message);
      });
  }

  render() {
    const { error } = this.state;
    const { history } = this.props;

    return (
      <div id="forget-password-page">
        <h1>timbr Forget Password Page!</h1>
        <form id="password-reset-form">
          <input
            id="email"
            type="text"
            placeholder="Email address"
            onChange={(event) => { this.setState({ email: event.target.value }); }}
          />
          <button
            type="button"
            onClick={this.sendResetEmail}
          >
            Send Password Reset Email
          </button>
          <p id="error">{ error }</p>
        </form>
        <button
          type="button"
          onClick={() => { history.push('/login'); }}
        >
          Back to Login Page
        </button>
      </div>
    );
  }
}

ForgetPasswordPage.propTypes = {
  history: PropTypes.object.isRequired,
};

export default connect(map)(withRouter(ForgetPasswordPage));
