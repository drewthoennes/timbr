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
        <h1>timbr Pets Page</h1>

      </div>
    );
  }
}

export default connect(map)(withRouter(PetsPage));
