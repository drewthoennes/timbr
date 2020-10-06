/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import map from '../../store/map';
import './styles.scss';
import accountActions from '../../store/actions/account';

class PlantProfilePage extends React.Component {
  constructor(props) {
    super(props);

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
    const pet = pets[this.props.match.params.id];
    console.log(pet);
    return (
      <div>
        <h1>{pet?.name}</h1>
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

PlantProfilePage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
    }),
    pets: PropTypes.object.isRequired,
  }).isRequired,
};

export default connect(map)(withRouter(PlantProfilePage));
