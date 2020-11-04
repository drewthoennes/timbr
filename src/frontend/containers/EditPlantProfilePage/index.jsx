import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
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

    this.state = {
      currPet: { ...pet },
      pet: { ...pet },
      petId,
      dropdownOpen: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
  }

  componentDidUpdate() {
    const { store: { account: { uid } }, history } = this.props;
    if (!uid) {
      history.push('/login');
    }
  }

  handleChange(e) {
    const { pet } = this.state;
    this.setState({ pet: { ...pet, [e.target.name]: e.target.value } });
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

  handleDropdown(e) {
    const { pet } = this.state;
    this.setState({ pet: { ...pet, type: e.currentTarget.textContent } });
  }

  toggleDropdown() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  render() {
    const { store: { plants } } = this.props;
    const { pet, currPet } = this.state;
    const plantList = Object.keys(plants);
    const today = (new Date()).toISOString().split('T')[0];
    const past = new Date((new Date().getFullYear() - 50)).toISOString().split('T')[0];
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
                min={past}
                max={today}
                value={pet.birth}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="ownedSince">
              <Form.Label>I've owned this plant since:</Form.Label>
              <Form.Control
                name="ownedSince"
                type="date"
                min={pet.birth?.length ? pet.birth : past}
                max={today}
                value={pet.ownedSince}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="type">
              <Form.Label>Plant's Type:</Form.Label>
              { /* eslint-disable-next-line react/destructuring-assignment */}
              <Dropdown name="type" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                <DropdownToggle caret id="size-dropdown">
                  { /* eslint-disable-next-line react/destructuring-assignment */}
                  {this.state.pet.type}
                </DropdownToggle>
                <DropdownMenu required>
                  {plantList.map((plant) => (
                    <DropdownItem onClick={this.handleDropdown}>{plant}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
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
    plants: PropTypes.object.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
export default connect(map)(withRouter(EditPlantProfilePage));
