/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-alert */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Switch from 'react-switch';
import { Modal } from 'react-bootstrap';
import map from '../../store/map';
import './styles.scss';
import { getUsername, getPhoneNumber, getProfilePicture, getTextsOn, getEmailsOn, changeUsername, changePhoneNumber, changeEmailsOn, changeTextsOn, changeProfilePicture, deleteAccount } from '../../store/actions/account';
import ProfilePicture from '../../assets/images/profile_picture.png';
import Navbar from '../../components/Navbar';

class AccountPage extends React.Component {
  constructor() {
    super();

    this.changeUsername = this.changeUsername.bind(this);
    this.getCurrentUsername = this.getCurrentUsername.bind(this);
    this.getCurrentPhoneNumber = this.getCurrentPhoneNumber.bind(this);
    this.getCurrentProfilePicture = this.getCurrentProfilePicture.bind(this);
    this.getTextsOn = this.getTextsOn.bind(this);
    this.changeTextsOn = this.changeTextsOn.bind(this);
    this.getEmailsOn = this.getEmailsOn.bind(this);
    this.changeEmailsOn = this.changeEmailsOn.bind(this);
    this.changePhoneNumber = this.changePhoneNumber.bind(this);
    this.changeProfilePicture = this.changeProfilePicture.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.state = {
      username: 'timbr-user',
      textsOn: false,
      emailsOn: false,
      phoneNumber: '',
      phoneError: '',
      profilePic: ProfilePicture,
      isModalOpen: false,
      confirmPassword: '',
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.getCurrentUsername();
    this.getCurrentPhoneNumber();
    this.getCurrentProfilePicture();
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
      this.getCurrentProfilePicture();
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
    // Get the phone number from the database, hard coded for now
    getPhoneNumber(
      (phoneNumber) => { this.mounted && this.setState({ phoneNumber: phoneNumber.val() }); },
    );
  }

  /* Calls the function to get the url for the current profile picture and sets the state. */
  getCurrentProfilePicture() {
    // Comment out the following lines when not testing profile picture.
    getProfilePicture(
      (picture) => { picture && this.mounted && this.setState({ profilePic: picture }); },
    );
  }

  /* Calls the function to get current text notifications status and sets the state. */
  getTextsOn() {
    getTextsOn(
      (user) => { this.mounted && this.setState({ textsOn: user.val() }); }, this.props.store,
    );
  }

  /* Calls the function to get current email notifications status and sets the state. */
  getEmailsOn() {
    getEmailsOn(
      (user) => { this.mounted && this.setState({ emailsOn: user.val() }); }, this.props.store,
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
    // removes the leading zeroes
    const number = parseInt(document.getElementById('phone-number').value, 10);

    // Error handling for phone number
    if (number < 0 || number.toString().length !== 10) {
      this.setState({
        phoneError: 'Phone number invalid!',
      });
      return;
    }
    this.setState({
      phoneError: '',
    });
    changePhoneNumber(number);
    /* Changes the phone number in the state. */
    this.getCurrentPhoneNumber();
    document.getElementById('phone-number').value = '';
  }

  changeProfilePicture(file) {
    // The following function changes the profile picture in the database.
    changeProfilePicture(file)
      .then(() => {
        console.log('Profile Picture updated!');
        this.getCurrentProfilePicture();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  deleteAccount() {
    deleteAccount(this.state.confirmPassword)
      .then(() => {
        this.closeModal();
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  openModal() {
    this.mounted && this.setState({
      isModalOpen: true,
    });
  }

  closeModal() {
    this.mounted && this.setState({
      isModalOpen: false,
    });
  }

  render() {
    const { history } = this.props;
    const styles = {
      width: '150px',
    };
    return (
      <div id="account-page">
        <Navbar />
        <br />
        <img style={styles} id="profile-picture" src={this.state.profilePic} alt="Profile" />
        <br />
        <label htmlFor="image-uploader">
          Change Profile Picture:
          <input
            type="file"
            id="image-uploader"
            accept="image/jpg,image/jpeg,image/png"
            onChange={(event) => { this.changeProfilePicture(event.target.files[0]); }}
          />
        </label>
        <br />
        <form id="account-settings">

          <label htmlFor="text-switch">
            <input type="hidden" id="text-switch" />
            <span>Text Notifications </span>
            <Switch
              onChange={this.changeTextsOn}
              checked={this.state.textsOn || false}
            />
          </label>
          <p>{'\n'}</p>
          <label htmlFor="email-switch">
            <input type="hidden" id="email-switch" />
            <span>Email Notifications </span>
            <Switch
              onChange={this.changeEmailsOn}
              checked={this.state.emailsOn || false}
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
          <input
            type="tel"
            placeholder="Enter phone number"
            id="phone-number"
          />
          <button
            id="change-phone-number"
            type="button"
            onClick={this.changePhoneNumber}
          >
            Change Phone number
          </button>
          <p id="phone-error">{this.state.phoneError}</p>
          <button
            id="change-password"
            type="button"
            onClick={() => history.push('/change-password')}
          >
            Change Password
          </button>
          <br />
          <button
            id="delete-account"
            type="button"
            onClick={this.openModal}
          >
            Delete my timbr account
          </button>

          <Modal show={this.state.isModalOpen} onHide={this.closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm delete account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                id="delete-password"
                type="password"
                placeholder="Re-enter password"
                onChange={(event) => {
                  if (this.mounted) {
                    this.setState({ confirmPassword: event.target.value });
                  }
                }}
              />
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                id="confirm-password"
                onClick={this.deleteAccount}
              >
                Confirm
              </button>
            </Modal.Footer>
          </Modal>
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
