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
import { createNewPet } from '../../store/actions/pets';
import './styles.scss';

class NewPlantProfilePage extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      birth: '',
      ownedSince: '',
      type: '',
      dropdownOpen: false,
    };
    this.getPlantsList = this.getPlantsList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  componentDidUpdate() {
    const { store: { account: { uid } }, history } = this.props;
    if (!uid) {
      history.push('/login');
    }
  }

  getPlantsList() {
    const list = ['alocasia-amazonica', 'asparagus-setaceus', 'aspidistra-elatior'];
    return list;
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    const { store: { account: { username } } } = this.props;
    const { name, birth, ownedSince, type } = this.state;
    createNewPet({
      name,
      birth: new Date(birth ?? Date.now()),
      ownedSince: new Date(ownedSince ?? Date.now()),
      type,
    }).then((snap) => {
      const { history } = this.props;
      history.push(`/${username}/${snap.key}`);
    });
  }

  handleDropdown(e) {
    this.setState({ type: e.currentTarget.textContent });
  }

  toggleDropdown() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  render() {
    const { name, birth, ownedSince } = this.state;
    const plantList = this.getPlantsList();

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
              min={new Date((new Date().getFullYear() - 50).toString()).toISOString().split('T')[0]}
              max={(new Date(new Date().getTime() - 86400000)).toISOString().split('T')[0]}
              value={birth}
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group controlId="ownedSince">
            <Form.Label>I've owned this plant since:</Form.Label>
            <Form.Control
              name="ownedSince"
              type="date"
              min={new Date(birth.length
                ? birth : (new Date().getFullYear() - 50).toString()).toISOString().split('T')[0]}
              max={(new Date(new Date().getTime() - 86400000)).toISOString().split('T')[0]}
              value={ownedSince}
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group controlId="type">
            <Form.Label>Plant's Type:</Form.Label>
            { /* eslint-disable-next-line react/destructuring-assignment */}
            <Dropdown name="type" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
              <DropdownToggle caret id="size-dropdown">
                { /* eslint-disable-next-line react/destructuring-assignment */}
                {this.state.type}
              </DropdownToggle>
              <DropdownMenu>
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
