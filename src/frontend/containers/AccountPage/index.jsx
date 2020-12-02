/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-alert */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import map from '../../store/map';
import './styles.scss';
import { getProviderId } from '../../store/actions/auth';
import Navbar from '../../components/Navbar';
import constants from '../../store/const';
import ProfilePicture from './ProfilePicture';
import Username from './Username';
import PhoneNumber from './PhoneNumber';
import Notifications from './Notifications';
import DeleteAccount from './DeleteAccount';

class AccountPage extends React.Component {
  constructor() {
    super();
    this.canChangePassword = this.canChangePassword.bind(this);

    this.state = {
      canChangePassword: false,
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;

    // this function will set the canChangePassword and providerId in the state
    this.canChangePassword();
  }

  componentDidUpdate() {
    const { store: { account: { uid } }, history } = this.props;

    if (!uid) {
      history.push('/login');
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  canChangePassword() {
    switch (getProviderId()) {
      case constants.EMAIL_PROVIDER_ID:
        this.setState({ canChangePassword: true });
        break;
      case constants.GOOGLE_PROVIDER_ID:
      case constants.FACEBOOK_PROVIDER_ID:
      default:
        this.setState({ canChangePassword: false });
    }
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
          <Notifications
            uid={uid}
          />
          <DeleteAccount />
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
