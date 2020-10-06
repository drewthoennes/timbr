/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import map from '../../store/map';
import './styles.scss';
import accountActions from '../../store/actions/account';

class PetsPage extends React.Component {
  constructor() {
    super();

    this.state = {};
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidUpdate() {
    const { store: { account: { uid } }, history } = this.props;
    if (!uid) {
      history.push('/login');
    }
  }

  handleLogout(e) {
    e.preventDefault();

    const { history } = this.props;
    accountActions.logout()
      .then(() => {
        history.push('/login');
      })
      .catch((error) => {
        console.log(`Error: ${error.message}`);
      });
  }

  render() {
    const { store: { pets }, history } = this.props;

    const petsJsx = Object.entries(pets).map(([id, pet]) => (
      <p key={id}>{ pet.name }</p>
    ));

    return (
      <div id="pets-page">
        <h1>timbr Pets Page</h1>
        { petsJsx }
        <button
          id="account"
          type="button"
          onClick={() => {
            history.push('/account');
          }}
        >
          My Account
        </button>
        <button
          id="logout"
          type="button"
          onClick={this.handleLogout}
        >
          Logout
        </button>
      </div>
    );
  }
}

PetsPage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
    }),
    pets: PropTypes.object.isRequired,
  }).isRequired,
};

export default connect(map)(withRouter(PetsPage));
