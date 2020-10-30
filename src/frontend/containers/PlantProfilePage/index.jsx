/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar';

import { setForeignUserPets, addDate } from '../../store/actions/pets';

import { getPlantName, getPlantWaterCycle, getPlantDescription, getPlantCarnivore, getPlantSciName, getPlantFeedFreq, getPlantFertFreq, getPlantImageURL } from '../../store/actions/plants';
import map from '../../store/map';
import './styles.scss';

class PlantProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.getSpeciesName = this.getSpeciesName.bind(this);
    this.getPlantType = this.getPlantType.bind(this);
    this.getWateringFreq = this.getWateringFreq.bind(this);
    this.getDescription = this.getDescription.bind(this);
    this.getCarnivore = this.getCarnivore.bind(this);
    this.getSciName = this.getSciName.bind(this);
    this.getFeedFreq = this.getFeedFreq.bind(this);
    this.getFertFreq = this.getFertFreq.bind(this);
    this.getImageURL = this.getImageURL.bind(this);
    this.onWater = this.onWater.bind(this);
    this.onFertilize = this.onFertilize.bind(this);
    this.onRotate = this.onRotate.bind(this);
    this.fetchEventList = this.fetchEventList.bind(this);

    this.state = {
      speciesName: '',
      scientificName: '',
      waterFreq: 0,
      description: '',
      carn: false,
      feedFreq: 0,
      fertFreq: 0,
      imageURL: '',
      eventList: [],
    };
  }

  componentDidMount() {
    const { match: { params: { username, id } } } = this.props;
    const { history, store: { account: { username: ownUsername } } } = this.props;

    console.log('Component did mount');

    this.getSpeciesName();
    this.getSciName();
    this.getWateringFreq();
    this.getDescription();
    this.getCarnivore();
    this.getFertFreq();
    this.getFeedFreq();
    this.getImageURL();
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

  getSpeciesName() {
    const plantType = this.getPlantType();
    getPlantName(
      (plant) => { this.setState({ speciesName: plant.val() }); }, plantType,
    );
  }

  getSciName() {
    const plantType = this.getPlantType();
    getPlantSciName(
      (plant) => { this.setState({ scientificName: plant.val() }); }, plantType,
    );
  }

  getWateringFreq() {
    const plantType = this.getPlantType();
    getPlantWaterCycle(
      (plant) => { this.setState({ waterFreq: plant.val() }); }, plantType,
    );
  }

  getFeedFreq() {
    const plantType = this.getPlantType();
    getPlantFeedFreq(
      (plant) => { this.setState({ feedFreq: plant.val() }); }, plantType,
    );
  }

  getFertFreq() {
    const plantType = this.getPlantType();
    getPlantFertFreq(
      (plant) => { this.setState({ fertFreq: plant.val() }); }, plantType,
    );
  }

  getDescription() {
    const plantType = this.getPlantType();
    getPlantDescription(
      (plant) => { this.setState({ description: plant.val() }); }, plantType,
    );
  }

  getCarnivore() {
    const plantType = this.getPlantType();
    getPlantCarnivore(
      (plant) => { this.setState({ carn: plant.val() }); }, plantType,
    );
  }

  getImageURL() {
    const plantType = this.getPlantType();
    getPlantImageURL(
      (plant) => { this.setState({ imageURL: plant.val() }); }, plantType,
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

  render() {
    const { store: { users, pets, account: { username: ownUsername } } } = this.props;
    const { history, match: { params: { username, id } } } = this.props;
    const { speciesName, scientificName, description, carn,
      imageURL, waterFreq, fertFreq, feedFreq, eventList } = this.state;
    let pet;
    if (username && username !== ownUsername) {
      pet = users[username] ? users[username].pets[id] : { name: '', type: '' };
    } else if (!pets[id]) {
      history.push(`/${ownUsername}`);
    } else {
      pet = pets[id];
    }

    return (
      <div>
        <Navbar />
        <h1>{pet.name}</h1>
        <img
          src={imageURL}
          alt="new"
        />
        <h2>General Information</h2>
        <p>{speciesName}</p>
        <p><i>{scientificName}</i></p>
        <p>{description}</p>
        <p>
          This plant
          {' '}
          {carn ? 'is' : 'is not'}
          {' '}
          carnivorous.
        </p>
        <p>
          Water Schedule:
          {waterFreq}
          {' '}
          Days
        </p>
        <p>
          Fertiliztion Schedule:
          {fertFreq}
          {' '}
          Days
        </p>
        <p>
          Feed Schedule:
          {feedFreq}
          {' '}
          Days
        </p>
        <div>
          <button type="button" onClick={this.onWater}> Water </button>
          <button type="button" onClick={this.onFertilize}> Fertilize </button>
          <button type="button" onClick={this.onRotate}> Rotate </button>
        </div>
        <div id="calendar">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends
            events={eventList}
          />
        </div>
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
