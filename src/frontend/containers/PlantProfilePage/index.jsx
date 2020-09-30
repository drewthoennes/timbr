import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import map from '../../store/map';
import './styles.scss';

class PlantProfilePage extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <p>Plant: {this.props.match.params.id}</p>
    );
  }
};

export default connect(map)(withRouter(PlantProfilePage));
