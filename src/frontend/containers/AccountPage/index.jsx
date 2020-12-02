/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-alert */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { Container, Row, Col } from 'reactstrap';
import map from '../../store/map';
import './styles.scss';
import { getUsername, getPhoneNumber, getProfilePicture, getTextsOn, getEmailsOn, changeUsername, changePhoneNumber, changeEmailsOn, changeTextsOn, changeProfilePicture, deleteAccount } from '../../store/actions/account';
import { getProviderId } from '../../store/actions/auth';
import Navbar from '../../components/Navbar';
import constants from '../../store/const';
import ProfilePicture from './ProfilePicture';
import Username from './Username';
import PhoneNumber from './PhoneNumber';
import Notifications from './Notifications';

class AccountPage extends React.Component {
  constructor() {
    super();
    this.deleteAccount = this.deleteAccount.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.canChangePassword = this.canChangePassword.bind(this);

    this.state = {
      isModalOpen: false,
      isOauthModalOpen: false,
      confirmPassword: '',
      reauthError: '',
      providerId: '',
      canChangePassword: false,
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;

    // this function will set the canChangePassword and providerId in the state
    this.canChangePassword();
  }

  componentDidUpdate(prevProps) {
    const { store: { account: { uid } }, history } = this.props;

    if (!uid) {
      history.push('/login');
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
    const { store: { account: { uid } }, history } = this.props;
    return (
      <div id="account-page">
        <Navbar />
        <br />
        <h2 className="mt-1 mb-4 text-center">My Account</h2>
        <Container className="mt-3">
          <ProfilePicture
            uid={uid}
          />
          <Username
            uid={uid}
          />
          <PhoneNumber
            uid={uid}
          />
          <Row>
            <Col sm={3} />
            <Col sm={1} />
            <Col sm={8}>
              <p id="phone-error">{this.state.phoneError}</p>
            </Col>
          </Row>
          <Notifications
            uid={uid}
          />
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
