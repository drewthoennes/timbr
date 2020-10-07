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
    const { store: { pets }, history } = this.props;
    const pet = pets[this.props.match.params.id];
    console.log(pet);
    return (
      <div>
        <h1>{pet?.name}</h1>
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
