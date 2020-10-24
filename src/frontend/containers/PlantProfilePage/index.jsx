/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar';
import { setForeignUserPets, addDate } from '../../store/actions/pets';
import map from '../../store/map';
import './styles.scss';

class PlantProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.onWater = this.onWater.bind(this);
    this.onFertilize = this.onFertilize.bind(this);
    this.onRotate = this.onRotate.bind(this);
    this.fetchEventList = this.fetchEventList.bind(this);
    this.state = {
      eventList: [],

    };
  }

  componentDidMount() {
    const { match: { params: { username, id } } } = this.props;
    const { history, store: { account: { username: ownUsername } } } = this.props;

    console.log('Component did mount');

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

  fetchEventList() {
    // fetches action history
    const { match: { params: { id } } } = this.props;
    const { store: { pets } = {} } = this.props;

    const wateredDates = Object.keys(pets[id].watered.history);
    const fertilizedDates = Object.keys(pets[id].fertilized.history);
    const turnedDates = Object.keys(pets[id].turned.history);
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
    const { eventList } = this.state;
    let pet;
    if (username && username !== ownUsername) {
      pet = users[username] ? users[username].pets[id] : { name: '' };
    } else if (!pets[id]) {
      history.push(`/${ownUsername}`);
    } else {
      pet = pets[id];
    }

    return (
      <div>
        <Navbar />
        <h1>{pet.name}</h1>

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
