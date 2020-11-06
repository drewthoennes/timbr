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
import { Container, Row, Col } from 'reactstrap';
import map from '../../store/map';
import './styles.scss';
import { getUsername, getPhoneNumber, getProfilePicture, getTextsOn, getEmailsOn, changeUsername, changePhoneNumber, changeEmailsOn, changeTextsOn, changeProfilePicture, deleteAccount } from '../../store/actions/account';
import { getProviderId } from '../../store/actions/auth';
import ProfilePicture from '../../assets/images/profile_picture.png';
import Navbar from '../../components/Navbar';
import constants from '../../store/const';

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
    this.canChangePassword = this.canChangePassword.bind(this);

    this.state = {
      username: 'timbr-user',
      textsOn: false,
      emailsOn: false,
      phoneNumber: '',
      phoneError: '',
      profilePic: ProfilePicture,
      isModalOpen: false,
      isOauthModalOpen: false,
      confirmPassword: '',
      reauthError: '',
      providerId: '',
      canChangePassword: false,
      pictureFeedback: '',
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

    // this function will set the canChangePassword and providerId in the state
    this.canChangePassword();
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

  getProvider() {
    const providerId = getProviderId();
    this.setState({
      providerId,
    });
    return providerId;
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
      (phoneNumber) => {
        this.mounted && this.setState({
          phoneNumber: phoneNumber.val().substring(2),
        });
      },
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

  canChangePassword() {
    switch (this.getProvider()) {
      case constants.EMAIL_PROVIDER_ID:
        this.setState({ canChangePassword: true });
        break;
      case constants.GOOGLE_PROVIDER_ID:
      case constants.FACEBOOK_PROVIDER_ID:
      default:
        this.setState({ canChangePassword: false });
    }
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

  // The following function changes the profile picture in the database.
  changeProfilePicture(file) {
    if (!file) {
      return;
    }
    const fileSize = file.size / (1024 * 1024); // gets the file size in MB
    if (fileSize > 1) {
      this.setState({
        pictureFeedback: 'File too large! Please upload a file of size less than 1 MB.',
      });
      return;
    }
    changeProfilePicture(file)
      .then(() => {
        this.getCurrentProfilePicture();
        if (this.mounted) {
          this.setState({
            pictureFeedback: 'Profile picture updated!',
          });
        }
      })
      .catch((error) => {
        if (this.mounted) {
          this.setState({
            pictureFeedback: error.message,
          });
        }
      });
  }

  deleteAccount() {
    deleteAccount(this.state.confirmPassword)
      .then(() => {
        alert('Account deleted!');
        this.closeModal();
      })
      .catch((error) => {
        this.mounted && this.setState({
          reauthError: error.message,
        });
      });
  }

  openModal() {
    switch (this.state.providerId) {
      case constants.FACEBOOK_PROVIDER_ID:
      case constants.GOOGLE_PROVIDER_ID:
        this.mounted && this.setState({
          isOauthModalOpen: true,
          reauthError: '',
        });
        break;
      case constants.EMAIL_PROVIDER_ID:
        this.mounted && this.setState({
          isModalOpen: true,
          reauthError: '',
        });
        break;
      default:
    }
  }

  closeModal() {
    this.mounted && this.setState({
      isModalOpen: false,
      isOauthModalOpen: false,
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
        <h2 className="mt-1 mb-4 text-center">My Account</h2>
        <Container class="mt-3">
          <Row className="align-items-center mt-2">
            <Col sm={3}><h5 className="text-right">Profile Picture</h5></Col>
            <Col sm={1} />
            <Col sm={2}>
              <img style={styles} id="profile-picture" src={this.state.profilePic} alt="Profile" />
            </Col>
            <Col sm={6}>
              <label htmlFor="image-uploader">
                Change Profile Picture:
                <br />
                <input
                  type="file"
                  id="image-uploader"
                  accept="image/jpg,image/jpeg,image/png"
                  onChange={(event) => { this.changeProfilePicture(event.target.files[0]); }}
                />
              </label>
              <p id="picture-feedback">{this.state.pictureFeedback}</p>
            </Col>
          </Row>
          <Row className="align-items-center mt-3">
            <Col sm={3}><h5 className="text-right">Username</h5></Col>
            <Col sm={1} />
            <Col sm={5}>
              <input
                id="username"
                type="text"
                className="form-control"
                placeholder={this.state.username}
              />
            </Col>
            <Col sm={3}>
              <button
                id="change-username"
                type="button"
                className="btn btn-outline-primary"
                onClick={this.changeUsername}
              >
                Change Username
              </button>
            </Col>
          </Row>
          <Row className="align-items-center mt-3">
            <Col sm={3}><h5 className="text-right">Phone Number</h5></Col>
            <Col sm={1} />
            <Col sm={5}>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">+1</span>
                </div>
                <input
                  type="tel"
                  className="form-control"
                  placeholder={this.state.phoneNumber}
                  id="phone-number"
                />
              </div>
            </Col>
            <Col sm={3}>
              <button
                id="change-phone-number"
                type="button"
                className="btn btn-outline-primary"
                onClick={this.changePhoneNumber}
              >
                Change Phone Number
              </button>

            </Col>
          </Row>
          <Row>
            <Col sm={3} />
            <Col sm={1} />
            <Col sm={8}>
              <p id="phone-error">{this.state.phoneError}</p>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col sm={3}><h5 className="text-right">Email Notifications</h5></Col>
            <Col sm={1} />
            <Col sm={8}>
              <label htmlFor="email-switch">
                <input type="hidden" id="email-switch" />
                <Switch
                  onChange={this.changeEmailsOn}
                  checked={this.state.emailsOn || false}
                />
              </label>
            </Col>
          </Row>
          <Row className="align-items-center mt-2">
            <Col sm={3}><h5 className="text-right">Text Notifications</h5></Col>
            <Col sm={1} />
            <Col sm={8}>
              <label htmlFor="text-switch">
                <input type="hidden" id="text-switch" />
                <Switch
                  onChange={this.changeTextsOn}
                  checked={this.state.textsOn || false}
                />
              </label>
            </Col>
          </Row>
          <Row className="align-items-center mt-2">
            <Col sm={3}><h5 className="text-right">Delete Account</h5></Col>
            <Col sm={1} />
            <Col sm={8}>
              <button
                id="delete-account"
                type="button"
                className="btn btn-outline-primary"
                onClick={this.openModal}
              >
                Delete Account
              </button>
            </Col>
          </Row>
          <Row style={{ visibility: this.state.canChangePassword ? 'visible' : 'hidden' }} className="align-items-center mt-3">
            <Col sm={3}><h5 className="text-right">Password</h5></Col>
            <Col sm={1} />
            <Col sm={8}>
              <button
                id="change-password"
                type="button"
                className="btn btn-outline-primary"
                onClick={() => history.push('/change-password')}
              >
                Change Password
              </button>
            </Col>
          </Row>
        </Container>

        <Modal id="email-reauth" show={this.state.isModalOpen} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Account Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              id="delete-password"
              type="password"
              className="form-control"
              autoComplete="on"
              placeholder="Enter Password"
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
              className="btn btn-primary"
              onClick={this.deleteAccount}
            >
              Confirm
            </button>
            <p id="error">{this.state.reauthError}</p>
          </Modal.Footer>
        </Modal>

        <Modal id="oauth-reauth" show={this.state.isOauthModalOpen} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure you want to delete your account?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.deleteAccount}
            >
              Confirm Delete Account
            </button>
          </Modal.Body>
          <Modal.Footer>
            <p id="error">{this.state.reauthError}</p>
          </Modal.Footer>
        </Modal>
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
