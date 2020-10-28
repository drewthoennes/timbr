/* eslint-disable no-alert */
/* eslint-disable react/no-unused-state */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import map from '../../store/map';
import Navbar from '../../components/Navbar';

class ChangePasswordPage extends React.Component {
  constructor() {
    super();

    this.changePassword = this.changePassword.bind(this);
    this.state = {
      currentpwd: '',
      newpwd: '',
      confirmpwd: '',
    };
  }

  changePassword() {
    const { newpwd, confirmpwd } = this.state;
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
        <Navbar />
        <form id="password-reset-form">
          <input
            id="current-pwd"
            type="password"
            placeholder="Current Password"
            onChange={(event) => this.setState({
              currentpwd: event.target.value,
            })}
          />
          <input
            id="new-pwd"
            type="password"
            placeholder="New Password"
            onChange={(event) => this.setState({
              newpwd: event.target.value,
            })}
          />
          <input
            id="confirm-pwd"
            type="password"
            placeholder="Confirm New Password"
            onChange={(event) => this.setState({
              confirmpwd: event.target.value,
            })}
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
