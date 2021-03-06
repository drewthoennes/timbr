/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import './styles.scss';
import { Modal } from 'react-bootstrap';
import map from '../../store/map';
import { registerWithTimbr } from '../../store/actions/account';
import { loginWithGoogle } from '../../store/actions/auth';

class RegisterPage extends React.Component {
  constructor() {
    super();

    this.handleRegister = this.handleRegister.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.signInWithGoogle = this.signInWithGoogle.bind(this);

    this.state = {
      email: '',
      username: '',
      password: '',
      isOauthModalOpen: false,
      modalError: '',
      oauthDenied: false,
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentDidUpdate() {
    const { store: { account: { uid, username } }, history } = this.props;
    if (uid) {
      history.push(`/${username}`);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  signInWithGoogle() {
    loginWithGoogle()
      .then(() => {
        this.closeModal();
      })
      .catch((error) => {
        if (this.mounted) {
          this.setState({
            modalError: error.message,
          });
        }
      });
  }

  handleRegister(e) {
    e.preventDefault();

    const { history } = this.props;
    const { email, username, password, oauthDenied } = this.state;
    if (email.match(/^[\w.+-]+@gmail\.com$/) && !oauthDenied) {
      this.openModal();
      return;
    }
    /* This method handles registration of a new user by sending the user credentials to the
        corresponding function and redirecting to the login page. */
    const credentials = {
      email, username, password,
    };

    // Redirects to the login page if registration successful. Else, displays the error message.
    registerWithTimbr(credentials)
      .then(() => {
        history.push('/login');
      })
      .catch((error) => {
        document.getElementById('error').innerHTML = error.message;
      });
  }

  closeModal() {
    if (this.mounted) {
      this.setState({
        isOauthModalOpen: false,
        oauthDenied: true,
      });
    }
  }

  openModal() {
    if (this.mounted) {
      this.setState({
        isOauthModalOpen: true,
      });
    }
  }

  render() {
    const { history } = this.props;
    return (
      <div id="register-page">
        <h1 className="text-center pt-5 pb-2">timbr</h1>
        <h3 className="text-center" style={{ color: 'white' }}><i>your plants need some love</i></h3>
        <div className="row h-100 ml-4 mr-4">
          <div className="col-sm-3" />
          <div className="col-sm-6 my-auto">
            <div className="card h-100 border-primary">
              <div className="card-body text-center my-auto">
                <h4 className="mt-2 mb-3">Register</h4>
                <form
                  id="register-form"
                  onSubmit={this.handleRegister}
                >
                  <fieldset>
                    <div className="form-group">
                      <input
                        id="email"
                        type="email"
                        className="form-control"
                        placeholder="Email*"
                        onChange={(event) => { this.setState({ email: event.target.value }); }}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        id="password"
                        type="password"
                        className="form-control"
                        autoComplete="on"
                        placeholder="Password*"
                        onChange={(event) => { this.setState({ password: event.target.value }); }}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        id="username"
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        onChange={(event) => { this.setState({ username: event.target.value }); }}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">REGISTER</button>
                  </fieldset>
                </form>
                <p id="error"> </p>
                <button
                  type="button"
                  className="btn btn-link mb-2"
                  onClick={() => history.push('/login')}
                >
                  Already a user? Go to login
                </button>
              </div>
            </div>
          </div>
          <div className="col-sm-3" />
        </div>

        <Modal id="can-oauth" show={this.state.isOauthModalOpen} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Gmail Account</Modal.Title>
          </Modal.Header>
          <p>Looks like you're registering with a Gmail account.
            Do you want to sign in with Google instead?
          </p>
          <Modal.Body>
            <button
              type="button"
              onClick={this.signInWithGoogle}
            >
              Sign in with Google
            </button>
            <button
              type="button"
              onClick={this.closeModal}
            >
              Continue registering with timbr
            </button>
          </Modal.Body>
          <Modal.Footer>
            <p id="modal-error">{this.state.modalError}</p>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

RegisterPage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
      username: PropTypes.string,
    }),
  }).isRequired,
};

export default connect(map)(withRouter(RegisterPage));
