/* eslint-disable no-alert */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import map from '../../store/map';
import { forgotPassword } from '../../store/actions/account';

class ForgetPasswordPage extends React.Component {
  constructor() {
    super();

    this.sendResetEmail = this.sendResetEmail.bind(this);
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

  sendResetEmail() {
    const { email } = this.state;
    const { history } = this.props;

    forgotPassword(email)
      .then(() => {
        alert(`Password reset email successfully sent to ${email}.`);
        history.push('/login');
      })
      .catch((error) => {
        if (this.mounted) {
          this.setState({
            error: error.message,
          });
        }
      });
  }

  render() {
    const { error } = this.state;
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
      </div>
    );
  }
}

ForgetPasswordPage.propTypes = {
  history: PropTypes.object.isRequired,
};

export default connect(map)(withRouter(ForgetPasswordPage));
