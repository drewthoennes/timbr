/* eslint-disable no-alert */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import map from '../../store/map';

class ChangePasswordPage extends React.Component {
  constructor() {
    super();

    this.changePassword = this.changePassword.bind(this);
  }

  changePassword() {
    const newpwd = btoa(document.getElementById('new-pwd').value);
    const confirmpwd = btoa(document.getElementById('confirm-pwd').value);
    if (newpwd !== confirmpwd) {
      document.getElementById('error').innerHTML = "Passwords don't match";
      return;
    }

    // TODO: Change pwd in the db

    alert('Password changed!');
    const { history } = this.props;
    history.push('/account');
  }

  render() {
    return (
      <div id="change-password-page">
        <h1>timbr Change Password Page</h1>
        <form id="password-reset-form">
          <input
            id="current-pwd"
            type="password"
            placeholder="Current Password"
          />
          <input
            id="new-pwd"
            type="password"
            placeholder="New Password"
          />
          <input
            id="confirm-pwd"
            type="password"
            placeholder="Confirm New Password"
          />

          <button
            type="button"
            onClick={this.changePassword}
          >
            Change Password
          </button>
          <p id="error">Error: Password incorrect! (Conditional on user input, hardcoded for now)</p>
        </form>
      </div>
    );
  }
}

ChangePasswordPage.propTypes = {
  history: PropTypes.object.isRequired,
};

export default connect(map)(withRouter(ChangePasswordPage));
