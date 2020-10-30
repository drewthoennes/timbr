/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import './styles.scss';
import map from '../../store/map';
import { registerWithTimbr } from '../../store/actions/account';

class RegisterPage extends React.Component {
  constructor() {
    super();

    this.handleRegister = this.handleRegister.bind(this);

    this.state = {
      email: '',
      password: '',
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

  handleRegister(e) {
    e.preventDefault();
    const { history } = this.props;
    const { email, password } = this.state;

    /* This method handles registration of a new user by sending the user credentials to the
        corresponding function and redirecting to the login page. */
    const credentials = {
      email, password,
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

  render() {
    const { history } = this.props;
    return (
      <div id="register-page">
        <h1>timbr Register Page!</h1>
        <button
          type="button"
          onClick={() => history.push('/login')}
        >
          Already a user? Go to login
        </button>

        <form
          id="register-form"
          onSubmit={this.handleRegister}
        >

          <input
            id="email"
            type="text"
            placeholder="Email"
            onChange={(event) => { this.setState({ email: event.target.value }); }}
          />

          <input
            id="password"
            type="password"
            autoComplete="on"
            placeholder="Password"
            onChange={(event) => { this.setState({ password: event.target.value }); }}
          />

          <button type="submit">Register</button>
        </form>
        <p id="error"> </p>
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
