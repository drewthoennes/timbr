/* eslint-disable no-alert */
/* eslint-disable react/no-unused-state */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import map from '../../store/map';
import Navbar from '../../components/Navbar';
import { changePassword, reauthenticateUser } from '../../store/actions/account';

class ChangePasswordPage extends React.Component {
  constructor() {
    super();

    this.changePassword = this.changePassword.bind(this);
    this.state = {
      currentpwd: '',
      newpwd: '',
      confirmpwd: '',
      error: '',
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  changePassword() {
    const { history } = this.props;
    const { newpwd, confirmpwd, currentpwd } = this.state;
    if (newpwd !== confirmpwd) {
      this.setState({
        error: 'Passwords don\'t match.',
      });
      return;
    }

    reauthenticateUser(currentpwd).then(() => {
      changePassword(newpwd)
        .then(() => {
          alert('Password changed!');
          history.push('/account');
        })
        .catch((error) => {
          if (this.mounted) {
            this.setState({ error: error.message });
          }
        });
    })
      .catch((error) => {
        if (this.mounted) {
          this.setState({ error: error.message });
        }
      });
  }

  render() {
    const { error } = this.state;
    return (
      <div id="change-password-page">
        <Navbar />
        <Container class="mt-4">
          <Row className="text-center mt-3">
            <Col sm={3} />
            <Col sm={6}>
              <h1>Change Password</h1>
              <input
                id="current-pwd"
                type="password"
                className="form-control mt-2"
                autoComplete="on"
                placeholder="Current Password"
                onChange={(event) => this.setState({
                  currentpwd: event.target.value,
                })}
              />
              <input
                id="new-pwd"
                type="password"
                className="form-control mt-2"
                autoComplete="on"
                placeholder="New Password"
                onChange={(event) => this.setState({
                  newpwd: event.target.value,
                })}
              />
              <input
                id="confirm-pwd"
                type="password"
                className="form-control mt-2"
                autoComplete="on"
                placeholder="Confirm New Password"
                onChange={(event) => this.setState({
                  confirmpwd: event.target.value,
                })}
              />

              <button
                type="button"
                className="btn btn-primary mt-2"
                onClick={this.changePassword}
              >
                Change Password
              </button>
              <p id="error">{error}</p>
            </Col>
            <Col sm={3} />
          </Row>
        </Container>
        <form id="password-reset-form" />
      </div>
    );
  }
}

ChangePasswordPage.propTypes = {
  history: PropTypes.object.isRequired,
};

export default connect(map)(withRouter(ChangePasswordPage));
