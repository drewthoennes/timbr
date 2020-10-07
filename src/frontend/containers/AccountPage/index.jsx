/* eslint-disable no-console */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["changeUsername"] }] */
/* eslint-disable react/destructuring-assignment */

import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import map from '../../store/map';
import './styles.scss';
import accountActions from '../../store/actions/account';
import Switch from 'react-switch';

class AccountPage extends React.Component {
  constructor() {
    super();

    this.changeUsername = this.changeUsername.bind(this);
    this.getCurrentUsername = this.getCurrentUsername.bind(this);
    this.getTextsOn = this.getTextsOn.bind(this);
    this.changeTextsOn = this.changeTextsOn.bind(this);
    this.getEmailsOn = this.getEmailsOn.bind(this);
    this.changeEmailsOn = this.changeEmailsOn.bind(this);

    this.state = {
      username: 'timbr-user',
      textsOn: false,
      emailsOn: false,
    };
  }

  componentDidMount() {
    this.getCurrentUsername();
    this.getTextsOn();
    this.getEmailsOn();
  }

  componentDidUpdate(prevProps) {
    /* Changes username, text notifications status, and email notifications status when uid changes. */

    if (prevProps.store && this.props.store
      && this.props.store.account.uid !== prevProps.store.account.uid) {
      this.getCurrentUsername();
      this.getTextsOn();
      this.getEmailsOn();
    }
    
  }

  /* Calls the function to get current username and sets the state. */
  getCurrentUsername() {
    accountActions.getUsername(
      (user) => { this.setState({ username: user.val() }); }, this.props.store,
    );
  }

  /* Calls the function to get current text notifications status and sets the state. */
  getTextsOn() {
    accountActions.getTextsOn(
      (user) => { this.setState({ textsOn: user.val() }); }, this.props.store,
    );
  }

  /* Calls the function to get current email notifications status and sets the state. */
  getEmailsOn() {
    accountActions.getEmailsOn(
      (user) => { this.setState({ emailsOn: user.val() }); }, this.props.store,
    );
  }

  changeUsername() {
    const username = document.getElementById('username').value;
    accountActions.changeUsername(username);
    /* Changes the username in the state. */
    this.getCurrentUsername();
    document.getElementById('username').value = '';
  }

  changeTextsOn(textsEvent) {
    this.setState({ textsOn: textsEvent})
    const textsOn = textsEvent;
    accountActions.changeTextsOn(textsOn);
    /* Changes the text notifications status in the state. */
    this.getTextsOn();
  }

  changeEmailsOn(emailsEvent) {
    this.setState({ emailsOn: emailsEvent})
    const emailsOn = emailsEvent;
    accountActions.changeEmailsOn(emailsOn);
    /* Changes the email notifications status in the state. */
    this.getEmailsOn();
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

          <label htmlFor="text-switch">
            <span>Text Notifications </span>
            <Switch
              onChange={this.changeTextsOn}
              checked={this.state.textsOn}
              id="text-switch"
            />
          </label>

          <p></p>

          <label htmlFor="email-switch">
            <span>Email Notifications </span>
            <Switch
              onChange={this.changeEmailsOn}
              checked={this.state.emailsOn}
              id="email-switch"
            />
          </label>

          <p>
            Current Username:
            {' '}
            {this.state.username}
          </p>
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
