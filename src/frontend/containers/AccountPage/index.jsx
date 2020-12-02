/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-alert */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import map from '../../store/map';
import './styles.scss';
import Navbar from '../../components/Navbar';
import ProfilePicture from './ProfilePicture';
import Username from './Username';
import PhoneNumber from './PhoneNumber';
import Notifications from './Notifications';
import DeleteAccount from './DeleteAccount';
import ChangePassword from './ChangePassword';

class AccountPage extends React.Component {
  componentDidUpdate() {
    const { store: { account: { uid } }, history } = this.props;

    if (!uid) {
      history.push('/login');
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
          <ChangePassword
            history={history}
          />
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
