import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import map from '../../store/map';
import './styles.scss';

class PetsPage extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { store: { pets } } = this.props;

    const petsJsx = Object.entries(pets).map(([id, pet]) => (
      <p key={id}>{ pet.name }</p>
    ));

    return (
      <div id="pets-page">
        <h1>timbr Pets Page</h1>
        { petsJsx }
      </div>
    );
  }
}

PetsPage.propTypes = {
  store: PropTypes.shape({
    pets: PropTypes.object.isRequired,
  }).isRequired,
};

export default connect(map)(withRouter(PetsPage));
