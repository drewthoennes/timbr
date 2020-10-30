import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar';
import map from '../../store/map';
import { createNewPet } from '../../store/actions/pets';
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
    const { store: { account: { username } } } = this.props;
    const { name, birth, ownedSince } = this.state;
    createNewPet({
      name,
      birth: birth.length ? birth : (new Date()).toISOString().split('T')[0],
      ownedSince: ownedSince.length ? ownedSince : (new Date()).toISOString().split('T')[0],
    }).then((snap) => {
      const { history } = this.props;
      history.push(`/${username}/${snap.key}`);
    });
  }

  render() {
    const { name, birth, ownedSince } = this.state;
    const today = (new Date()).toISOString().split('T')[0];
    const past = new Date((new Date().getFullYear() - 50)).toISOString().split('T')[0];

    return (
      <div id="new-plant-page">
        <Navbar />
        <h1>Create New Plant</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Plant's Name:</Form.Label>
            <Form.Control
              required
              name="name"
              value={name}
              onChange={this.handleChange}
              maxLength="40"
              placeholder="Name"
            />
          </Form.Group>

          <Form.Group controlId="birth">
            <Form.Label>Plant's birthday:</Form.Label>
            <Form.Control
              name="birth"
              type="date"
              min={past}
              max={today}
              value={birth}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId="ownedSince">
            <Form.Label>I've owned this plant since:</Form.Label>
            <Form.Control
              name="ownedSince"
              type="date"
              min={birth.length ? birth : past}
              max={today}
              value={ownedSince}
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
}
NewPlantProfilePage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
      username: PropTypes.string,
    }),
    pets: PropTypes.object.isRequired,
  }).isRequired,
};
export default connect(map)(withRouter(NewPlantProfilePage));
