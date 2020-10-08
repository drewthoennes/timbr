/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import map from '../../store/map';
import './styles.scss';

class PlantProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { store: { pets }, match: { params: id } } = this.props;
    const pet = pets[id];
    return (
      <div>
        <h1>{pet?.name}</h1>
      </div>
    );
  }
}

PlantProfilePage.propTypes = {
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
    }),
    pets: PropTypes.object.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default connect(map)(withRouter(PlantProfilePage));
