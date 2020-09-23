import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import map from '../../store/map';
import './styles.scss';

class PetsPage extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <div id="pets-page">
        <p>timbr pets page</p>
      </div>
    );
  }
}

export default connect(map)(withRouter(PetsPage));
