/* eslint-disable no-console */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["changeUsername"] }] */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import map from '../../store/map';
import './styles.scss';
import accountActions from '../../store/actions/account';

class AccountPage extends React.Component {
  constructor() {
    super();

    this.changeUsername = this.changeUsername.bind(this);
  }

  componentDidUpdate() {
    const { store: { account: { uid } }, history } = this.props;
    if (!uid) {
      history.push('/login');
    }
  }

  changeUsername() {
    const username = document.getElementById('username').value;

    accountActions.changeUsername(username);
  }

  render() {
    const { history } = this.props;
    return (
      <div id="account-page">
        <h1>timbr Account Page!</h1>
        <button
          id="home"
          type="button"
          onClick={() => {
            history.push('/');
          }}
        >
          Home
        </button>
        <form id="account-settings">
          <input
            id="username"
            type="text"
            placeholder="Username"
          />
          <button
            id="change-username"
            type="button"
            onClick={this.changeUsername}
          >
            Change Username
          </button>
        </form>
      </div>
    );
  }
}

AccountPage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
    }),
  }).isRequired,
};

export default connect(map)(withRouter(AccountPage));
