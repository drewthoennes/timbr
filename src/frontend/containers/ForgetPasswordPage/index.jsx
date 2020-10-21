/* eslint-disable no-alert */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import map from '../../store/map';

class ForgetPasswordPage extends React.Component {
  constructor() {
    super();

    this.sendResetEmail = this.sendResetEmail.bind(this);
  }

  sendResetEmail() {
    const email = document.getElementById('email').value;
    // TODO: Invoke firebase to send email
    alert(`Email successfully sent to ${email}`);
    const { history } = this.props;
    history.push('/login');
  }

  render() {
    return (
      <div id="forget-password-page">
        <h1>timbr Forget Password Page!</h1>
        <form id="password-reset-form" onSubmit={this.sendResetEmail}>
          <input
            id="email"
            type="text"
            placeholder="Email address"
          />
          <button
            type="submit"
          >
            Send Password Reset Email
          </button>
          <p id="error">Error: Account does not exist! (Hardcoded for now)</p>
        </form>
      </div>
    );
  }
}

ForgetPasswordPage.propTypes = {
  history: PropTypes.object.isRequired,
};

export default connect(map)(withRouter(ForgetPasswordPage));
