/* eslint-disable no-console */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["changeUsername"] }] */
/* eslint-disable react/destructuring-assignment */

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
    this.getUsername = this.getUsername.bind(this);
    this.state = ({
      username: 'timbr-user',
    });
  }

  componentDidMount() {
    this.getUsername();
  }

  getUsername() {
    const username = accountActions.getUsername();
    this.setState({
      username,
    });
  }

  changeUsername() {
    const username = document.getElementById('username').value;
    accountActions.changeUsername(username);
    this.getUsername();
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
          <p>
            Current username:
            {this.state.username}
          </p>
          <input
            id="username"
            type="text"
            placeholder="Username"
          />
          <button
            id="change-username"
            type="submit"
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
