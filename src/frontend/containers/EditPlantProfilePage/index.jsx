import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar';
import map from '../../store/map';
import { editPet } from '../../store/actions/pets';
import './styles.scss';

class EditPlantProfilePage extends React.Component {
  constructor(props) {
    super(props);

    const {
      store: { pets },
      match: { params: { id: petId } },
    } = this.props;
    const pet = pets[petId];

    this.state = { currPet: {...pet}, pet: {...pet}, petId };

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
    this.setState({ pet: { [e.target.name]: e.target.value } });
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    const { history, store: { account: { username } } } = this.props;
    const { pet, petId } = this.state;
    editPet(petId, pet).then(() => {
      history.push(`/${username}/${petId}`);
    });
  }

  render() {
    const { pet, currPet } = this.state;

    return (
      <>
        <Navbar />
        <div id="edit-plant-page" className="container">
          <h1>Edit {currPet.name}</h1>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Plant's Name:</Form.Label>
              <Form.Control
                required
                name="name"
                value={pet.name}
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
                min={new Date((new Date().getFullYear() - 50).toString()).toISOString().split('T')[0]}
                max={(new Date(new Date().getTime() - 86400000)).toISOString().split('T')[0]}
                value={pet.birth}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="ownedSince">
              <Form.Label>I've owned this plant since:</Form.Label>
              <Form.Control
                name="ownedSince"
                type="date"
                min={new Date(pet.birth?.length
                  ? pet.birth : (new Date().getFullYear() - 50).toString()).toISOString().split('T')[0]}
                max={(new Date(new Date().getTime() - 86400000)).toISOString().split('T')[0]}
                value={pet.ownedSince}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </>
    );
  }
}
EditPlantProfilePage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
      username: PropTypes.string,
    }),
    pets: PropTypes.object.isRequired,
  }).isRequired,
};
export default connect(map)(withRouter(EditPlantProfilePage));
