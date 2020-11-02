/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import Navbar from '../../components/Navbar';

import { setForeignUserPets, addDate, deletePet } from '../../store/actions/pets';

import { getPlantDetails } from '../../store/actions/plants';
import map from '../../store/map';
import './styles.scss';

class PlantProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.onWater = this.onWater.bind(this);
    this.onFertilize = this.onFertilize.bind(this);
    this.onRotate = this.onRotate.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.fetchEventList = this.fetchEventList.bind(this);

    this.state = {
      speciesName: '',
      scientificName: '',
      waterFreq: 0,
      description: '',
      carn: false,
      feedFreq: '',
      fertFreq: 0,
      imageURL: '',
      showDeleteModal: false,
      eventList: [],
    };
  }

  componentDidMount() {
    const { match: { params: { username, id } } } = this.props;
    const { history, store: { account: { username: ownUsername } } } = this.props;

    console.log('Component did mount');

    this.getPlantDetails();
    this.fetchEventList();

    if (!username) return Promise.resolve();

    return setForeignUserPets(username, id).catch(() => history.push(`/${ownUsername}`));
  }

  onWater() {
    const { match: { params: { id } } } = this.props;
    const today = new Date().toISOString().slice(0, 10);
    addDate(id, 'watered', today).then(() => {
      this.fetchEventList();
    });
  }

  onFertilize() {
    const today = new Date().toISOString().slice(0, 10);
    const { match: { params: { id } } } = this.props;
    addDate(id, 'fertilized', today).then(() => {
      this.fetchEventList();
    });
  }

  onRotate() {
    const { match: { params: { id } } } = this.props;
    const today = new Date().toISOString().slice(0, 10);
    addDate(id, 'turned', today).then(() => {
      this.fetchEventList();
    });
  }

  onEdit() {
    const {
      history,
      match: { params: { id: petId } },
      store: { account: { username: userId } },
    } = this.props;
    history.push(`/${userId}/edit/${petId}`);
  }

  onDelete() {
    this.showDeleteModal(false);

    const {
      history,
      match: { params: { id } },
      store: { account: { username: ownUsername } },
    } = this.props;

    deletePet(id).then(() => {
      history.push(`/${ownUsername}`);
    });
  }

  getPlantType() {
    const { store: { users, pets, account: { username: ownUsername } } } = this.props;
    const { history, match: { params: { username, id } } } = this.props;

    let pet;
    if (username && username !== ownUsername) {
      pet = users[username] ? users[username].pets[id] : { name: '', type: '' };
    } else if (!pets[id]) {
      history.push(`/${ownUsername}`);
    } else {
      pet = pets[id];
    }
    return pet.type;
  }

  getPlantDetails() {
    const plantType = this.getPlantType();
    getPlantDetails(
      (plant) => { this.setState({ speciesName: plant.val() }); }, plantType, 'name',
    );
    getPlantDetails(
      (plant) => { this.setState({ scientificName: plant.val() }); }, plantType, 'scientificName',
    );
    getPlantDetails(
      (plant) => { this.setState({ waterFreq: plant.val() }); }, plantType, 'waterFreq',
    );
    getPlantDetails(
      (plant) => { this.setState({ feedFreq: plant.val() }); }, plantType, 'feedFreq',
    );
    getPlantDetails(
      (plant) => { this.setState({ fertFreq: plant.val() }); }, plantType, 'fertFreq',
    );
    getPlantDetails(
      (plant) => { this.setState({ description: plant.val() }); }, plantType, 'description',
    );
    getPlantDetails(
      (plant) => { this.setState({ carn: plant.val() }); }, plantType, 'carnivorous',
    );
    getPlantDetails(
      (plant) => { this.setState({ imageURL: plant.val() }); }, plantType, 'picture',
    );
  }

  fetchEventList() {
    // fetches action history
    const { match: { params: { id } } } = this.props;
    const { store: { pets } = {} } = this.props;

    const wateredDates = Object.keys(pets[id].watered.history || {});
    const fertilizedDates = Object.keys(pets[id].fertilized.history || {});
    const turnedDates = Object.keys(pets[id].turned.history || {});
    // construct eventList with title and date
    const eventList = [];
    wateredDates.forEach((item) => {
      eventList.push({ title: 'watered 💦', date: `${item}` });
    });
    fertilizedDates.forEach((item) => {
      eventList.push({ title: 'fertilized 🌱', date: `${item}` });
    });
    turnedDates.forEach((item) => {
      eventList.push({ title: 'turned 💃', date: `${item}` });
    });
    this.setState({
      eventList,
    });
  }

  showDeleteModal(cond) {
    this.setState({ showDeleteModal: cond });
  }

  render() {
    const { store: { users, pets, account: { username: ownUsername } } } = this.props;
    const { history, match: { params: { username, id } } } = this.props;
    const { speciesName, scientificName, description, carn,
      imageURL, waterFreq, fertFreq, feedFreq, eventList } = this.state;
    let pet;
    if (username && username !== ownUsername) {
      pet = users[username] ? users[username].pets[id] : { name: '', type: '', birth: '', ownedSince: '' };
    } else if (!pets[id]) {
      history.push('/notfound');
    } else {
      pet = pets[id];
    }
    const { showDeleteModal: show } = this.state;
    return (
      <div>
        <Navbar />
        <h1>{pet.name}</h1>
        <img
          src={imageURL}
          className="photo"
          alt="new"
        />
        <h2>General Information</h2>
        <p>
          Species Name:
          {' '}
          {speciesName}
        </p>
        <p>
          Scientific Name:
          {' '}
          <i>{scientificName}</i>
        </p>
        <p>{description}</p>
        <p>
          Water Schedule:
          {' '}
          {waterFreq}
          {' '}
          Days
        </p>
        <p>
          Fertilization Schedule:
          {' '}
          {fertFreq}
          {' '}
          Days
        </p>
        <p>
          This plant
          {' '}
          {carn}
          {carn ? 'is' : 'is not'}
          {' '}
          carnivorous and hence you
          {' '}
          {carn ? 'must' : 'must not'}
          {' '}
          feed it.
        </p>
        <p>
          {carn ? 'Feed Schedule: ' : ''}
          {carn ? feedFreq : ''}
          {carn ? ' Days' : ''}
        </p>
        <p>
          <i>{pet.name}</i>
          {' '}
          was born on
          {' '}
          {pet.birth}
          .
        </p>
        <p>
          You have owned
          {' '}
          <i>{pet.name}</i>
          {' '}
          since
          {' '}
          {pet.ownedSince}
          .
        </p>
        <div className="container">
          <button type="button" onClick={this.onWater}> Water </button>
          <button type="button" onClick={this.onFertilize}> Fertilize </button>
          <button type="button" onClick={this.onRotate}> Rotate </button>
          <div className="container">
            <button type="button" onClick={this.onEdit}> Edit </button>
            <button type="button" onClick={() => this.showDeleteModal(true)}> Delete </button>
          </div>
        </div>
        <div id="calendar">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends
            events={eventList}
          />
        </div>

        <Modal show={show} onHide={() => this.showDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete {pet?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete {pet?.name}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.showDeleteModal(false)}>
              No
            </Button>
            <Button variant="primary" onClick={this.onDelete}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

PlantProfilePage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
      username: PropTypes.string,
    }),
    pets: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string,
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default connect(map)(withRouter(PlantProfilePage));
