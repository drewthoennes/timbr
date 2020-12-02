/* eslint-disable no-alert */

import React from 'react';
import { Modal } from 'react-bootstrap';
import { Row, Col } from 'reactstrap';
import './styles.scss';
import { deleteAccount } from '../../store/actions/account';
import { getProviderId } from '../../store/actions/auth';
import constants from '../../store/const';

class DeleteAccount extends React.Component {
  constructor() {
    super();
    this.deleteAccount = this.deleteAccount.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getProvider = this.getProvider.bind(this);

    this.state = {
      isModalOpen: false,
      isOauthModalOpen: false,
      confirmPassword: '',
      reauthError: '',
      providerId: '',
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;

    // this function will set the providerId in the state
    this.getProvider();
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

  deleteAccount() {
    const { confirmPassword } = this.state;
    deleteAccount(confirmPassword)
      .then(() => {
        alert('Account deleted!');
        this.closeModal();
      })
      .catch((error) => {
        if (this.mounted) {
          this.setState({
            reauthError: error.message,
          });
        }
      });
  }

  openModal() {
    const { providerId } = this.state;
    switch (providerId) {
      case constants.FACEBOOK_PROVIDER_ID:
      case constants.GOOGLE_PROVIDER_ID:
        if (this.mounted) {
          this.setState({
            isOauthModalOpen: true,
            reauthError: '',
          });
        }
        break;
      case constants.EMAIL_PROVIDER_ID:
        if (this.mounted) {
          this.setState({
            isModalOpen: true,
            reauthError: '',
          });
        }
        break;
      default:
    }
  }

  closeModal() {
    if (this.mounted) {
      this.setState({
        isModalOpen: false,
        isOauthModalOpen: false,
      });
    }
  }

  render() {
    const { isModalOpen, isOauthModalOpen, reauthError } = this.state;
    return (
      <div>
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

        <Modal id="email-reauth" show={isModalOpen} onHide={this.closeModal}>
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
            <p id="error">{reauthError}</p>
          </Modal.Footer>
        </Modal>

        <Modal id="oauth-reauth" show={isOauthModalOpen} onHide={this.closeModal}>
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
            <p id="error">{reauthError}</p>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default DeleteAccount;
