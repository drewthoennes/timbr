import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import map from '../../store/map';
import { createNewPet } from '../../store/actions/pets';
import PropTypes from 'prop-types';
import './styles.scss';

class NewPlantProfilePage extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      birth: '',
      ownedSince: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate() {
    const { store: { account: { uid } }, history } = this.props;
    if (!uid) {
      history.push('/login');
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    createNewPet({
      name: this.state.name,
      birth: new Date(this.state.birth ?? Date.now()),
      ownedSince: new Date(this.state.ownedSince ?? Date.now())
    }).then(snap => {
      const { history } = this.props;
      history.push(`/myplants/${snap.key}`);
    });
  }

  render() {
    return (
      <div id="new-plant-page" className="container col-md-6 col-sm-12">
        <h1>Create New Plant</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Plant's Name:</Form.Label>
            <Form.Control required
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
              maxlength="40"
              placeholder="Name"/>
          </Form.Group>

          <Form.Group controlId="birth">
            <Form.Label>Plant's birthday:</Form.Label>
            <Form.Control
              name="birth"
              type="date"
              min={new Date((new Date().getFullYear() - 50).toString()).toISOString().split('T')[0]}
              max={(new Date(new Date().getTime()-86400000)).toISOString().split('T')[0]}
              value={this.state.birth}
              onChange={this.handleChange}
              />
          </Form.Group>
          <Form.Group controlId="ownedSince">
          <Form.Label>I've owned this plant since:</Form.Label>
            <Form.Control
              name="ownedSince"
              type="date"
              min={new Date(this.state.birth.length ?
                this.state.birth : (new Date().getFullYear() - 50).toString()).toISOString().split('T')[0]}
              max={(new Date(new Date().getTime()-86400000)).toISOString().split('T')[0]}
              value={this.state.ownedSince}
              onChange={this.handleChange}
              />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
};
NewPlantProfilePage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
    }),
    pets: PropTypes.object.isRequired,
  }).isRequired,
};
export default connect(map)(withRouter(NewPlantProfilePage));
