import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import map from '../../store/map';
import './styles.scss';

class MyPlantsPage extends React.Component {
  constructor() {
    super();

    this.state = {
      plants: [
        {},
        {},
        {},
        {},
        {},
      ]
    };
  }

  render() {
    let plantCards = [];
    for (let i in this.state.plants) {
      // <Card.Img variant="top" src="holder.js/100px180" />
      plantCards.push((
        <Card key={i} className="plant-card">
          <Card.Body>
            <Card.Title>Plant {parseInt(i) + 1}</Card.Title>
            <Card.Text>Plant Type Here</Card.Text>
          </Card.Body>
        </Card>
      ))
    }
    return (
      <div id="my-plants-page">
        {plantCards}
      </div>
    );
  }
};

export default connect(map)(withRouter(MyPlantsPage));
