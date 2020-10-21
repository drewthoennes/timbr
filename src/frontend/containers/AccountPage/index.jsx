/* eslint-disable no-console */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["changeUsername"] }] */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Switch from 'react-switch';
import Input from 'react-phone-number-input/input';
import map from '../../store/map';
import './styles.scss';
import { getUsername, getTextsOn, getEmailsOn, changeUsername, changeEmailsOn, changeTextsOn } from '../../store/actions/account';

class AccountPage extends React.Component {
  constructor() {
    super();

    this.changeUsername = this.changeUsername.bind(this);
    this.getCurrentUsername = this.getCurrentUsername.bind(this);
    this.getCurrentPhoneNumber = this.getCurrentPhoneNumber.bind(this);
    this.getTextsOn = this.getTextsOn.bind(this);
    this.changeTextsOn = this.changeTextsOn.bind(this);
    this.getEmailsOn = this.getEmailsOn.bind(this);
    this.changeEmailsOn = this.changeEmailsOn.bind(this);
    this.changePhoneNumber = this.changePhoneNumber.bind(this);

    this.state = {
      username: 'timbr-user',
      textsOn: false,
      emailsOn: false,
      phoneNumber: '',
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.getCurrentUsername();
    this.getCurrentPhoneNumber();
    this.getTextsOn();
    this.getEmailsOn();
  }

  componentDidUpdate(prevProps) {
    const { store: { account: { uid } }, history } = this.props;

    if (!uid) {
      history.push('/login');
    }

    /* Changes username, text notifications status,
    and email notifications status when uid changes. */
    if (prevProps.store && this.props.store
      && this.props.store.account.uid !== prevProps.store.account.uid) {
      this.getCurrentUsername();
      this.getCurrentPhoneNumber();
      this.getTextsOn();
      this.getEmailsOn();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /* Calls the function to get current username and sets the state. */
  getCurrentUsername() {
    getUsername(
      (user) => { this.mounted && this.setState({ username: user.val() }); }, this.props.store,
    );
  }

  getCurrentPhoneNumber() {
    // TODO: Get the phone number from the database, hard coded for now
    this.setState({
      phoneNumber: '123456789',
    });
  }

  /* Calls the function to get current text notifications status and sets the state. */
  getTextsOn() {
    getTextsOn(
      (user) => { this.setState({ textsOn: user.val() }); }, this.props.store,
    );
  }

  /* Calls the function to get current email notifications status and sets the state. */
  getEmailsOn() {
    getEmailsOn(
      (user) => { this.setState({ emailsOn: user.val() }); }, this.props.store,
    );
  }

  changeUsername() {
    const username = document.getElementById('username').value;
    if (this.state.username === username) {
      // no op if the current username and new username are the same
      document.getElementById('username').value = '';
      return;
    }
    changeUsername(username);
    /* Changes the username in the state. */
    this.getCurrentUsername();
    document.getElementById('username').value = '';
  }

  changeTextsOn(textsEvent) {
    this.setState({ textsOn: textsEvent });
    const textsOn = textsEvent;
    changeTextsOn(textsOn);
    /* Changes the text notifications status in the state. */
    this.getTextsOn();
  }

  changeEmailsOn(emailsEvent) {
    this.setState({ emailsOn: emailsEvent });
    const emailsOn = emailsEvent;
    changeEmailsOn(emailsOn);
    /* Changes the email notifications status in the state. */
    this.getEmailsOn();
  }

  changePhoneNumber() {
    const number = document.getElementById('phone-number').value;
    console.log(`Phone number entered: ${number}`);
    document.getElementById('phone-number').value = '';

    // Error handling for phone number
    // checking if the length is 14 to account for the formatting of the phone number
    if (number.toString().length !== 14) {
      document.getElementById('phone-error').innerHTML = 'Phone number invalid!';
    } else {
      document.getElementById('phone-error').innerHTML = '';
      this.setState({
        phoneNumber: number,
      });
    }
    // TODO: Change the phone number in the database
  }

  render() {
    const { history, store: { account: { username } } } = this.props;

    return (
      <div id="account-page">
        <h1>timbr Account Page!</h1>
        <button
          id="home"
          type="button"
          onClick={() => {
            history.push(`/${username}`);
          }}
        >
          Home
        </button>

        <form id="account-settings">

          <label htmlFor="text-switch">
            <input type="hidden" id="text-switch" />
            <span>Text Notifications </span>
            <Switch
              onChange={this.changeTextsOn}
              checked={this.state.textsOn}
            />
          </label>
          <p>{'\n'}</p>
          <label htmlFor="email-switch">
            <input type="hidden" id="email-switch" />
            <span>Email Notifications </span>
            <Switch
              onChange={this.changeEmailsOn}
              checked={this.state.emailsOn}
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
          <p>
            Current Phone Number:
            {' '}
            {this.state.phoneNumber}
          </p>
          +1
          {' '}
          <Input
            placeholder="Enter phone number"
            id="phone-number"
            country="US"
            onChange={() => {}}
          />
          <button
            id="change-phone-number"
            type="button"
            onClick={this.changePhoneNumber}
          >
            Change Phone number
          </button>
          <p id="phone-error"> </p>
          <button
            id="change-password"
            type="button"
            onClick={() => history.push('/change-password')}
          >
            Change Password
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
      username: PropTypes.string,
    }),
  }).isRequired,
};

export default connect(map)(withRouter(AccountPage));
