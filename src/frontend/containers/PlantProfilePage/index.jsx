/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProfilePicture from '../../assets/images/pet_profile_picture.png';
import Navbar from '../../components/Navbar';
import { setForeignUserPets, getPetProfilePicture, getPetGrowthPictures } from '../../store/actions/pets';
import map from '../../store/map';
import './styles.scss';

import GeneralInformation from './GeneralInformation';
import CareFrequency from './CareFrequency';
import CareCalendar from './CareCalendar';
import GrowthPictures from './GrowthPictures';
import ManagePlant from './ManagePlant';

class PlantProfilePage extends React.Component {
  constructor(props) {
    super(props);
    // const { store: { pets }, history, match: { params: { id } } } = props;
    // if (!pets[id]) {
    //   history.push('/notfound');
    //   return;
    // }

    this.getPlantDetails = this.getPlantDetails.bind(this);
    this.getProfilePicture = this.getProfilePicture.bind(this);
    this.getGrowthPictures = this.getGrowthPictures.bind(this);
    this.fetchEventList = this.fetchEventList.bind(this);
    this.getPlantLocation = this.getPlantLocation.bind(this);

    this.state = {
      speciesName: '',
      scientificName: '',
      waterFreq: 0,
      description: '',
      carnivorous: false,
      feedFreq: '',
      fertFreq: 0,
      profilePic: ProfilePicture,
      growthPics: {},
      eventList: [],
      location: '',
      nextCycleDates: [],
    };
  }

  componentDidMount() {
    const { match: { params: { username, id } } } = this.props;
    const { history, store: { account: { username: ownUsername } } } = this.props;

    this.getPlantDetails();
    this.fetchEventList();
    this.getProfilePicture();
    this.getGrowthPictures();
    this.getPlantLocation();
    this.getNextCycle();

    if (!username) return Promise.resolve();
    return setForeignUserPets(username, id).catch(() => history.push(`/${ownUsername}`));
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.getPlantDetails();
    }
  }

  getProfilePicture() {
    const { match: { params: { id } } } = this.props;
    this.setState({ profilePic: ProfilePicture });

    getPetProfilePicture(id).then((profilePic) => {
      if (profilePic) {
        this.setState({ profilePic });
      }
    });
  }

  getGrowthPictures() {
    const { match: { params: { id } } } = this.props;

    getPetGrowthPictures(id).then((growthPics) => {
      this.setState({ growthPics });
    });
  }

  getPlantType() {
    const { own, store: { users, pets } } = this.props;
    const { history, match: { params: { username, id } } } = this.props;

    let pet;
    if (!own) {
      pet = users[username] ? users[username].pets[id] : { name: '', type: '' };
    } else if (!pets[id]) {
      history.push('/notfound');
    } else {
      pet = pets[id];
    }
    return pet?.type;
  }

  getPlantDetails() {
    const { store: { plants } } = this.props;
    const type = this.getPlantType();
    const plant = plants[type];

    this.setState({ ...plants[type], speciesName: plant?.name || '' });
  }

  getPlantLocation() {
    const { match: { params: { id } } } = this.props;
    const { store: { pets } = {} } = this.props;
    this.setState({ location: pets[id].location });
  }

  /* eslint-disable-next-line class-methods-use-this */
  getTargetDate(date, daysToAdd) {
    date.setDate(date.getDate() + daysToAdd);
    const diffTime = Math.abs(date - new Date());
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > daysToAdd) {
      diffDays = 0;
    }
    return [date, diffDays];
  }

  getNextCycle() {
    const { match: { params: { id } } } = this.props;
    const { store: { pets } } = this.props;
    const { store: { plants } } = this.props;
    const { type } = pets[id];

    let nextFeedDates = [];
    const nextWaterDates = this.getTargetDate(new Date(pets[id].watered.last),
      plants[type].waterFreq);
    const nextFertDates = this.getTargetDate(new Date(pets[id].fertilized.last),
      plants[type].fertFreq);
    const nextTurnDates = this.getTargetDate(new Date(pets[id].turned.last),
      plants[type].rotateFreq);
    if (plants[type].carnivorous) {
      nextFeedDates = this.getTargetDate(new Date(pets[id].fed.last),
        plants[type].feedFreq);
    }

    this.setState({ nextCycleDates: [nextWaterDates[1], nextFertDates[1],
      nextTurnDates[1], nextFeedDates[1]] });
  }

  fetchEventList() {
    // fetches action history
    this.getNextCycle();
    const { match: { params: { id } } } = this.props;
    const { store: { pets } = {} } = this.props;
    const wateredDates = Object.keys(pets[id]?.watered.history || {});
    const fertilizedDates = Object.keys(pets[id]?.fertilized.history || {});
    const turnedDates = Object.keys(pets[id]?.turned.history || {});
    const fedDates = Object.keys(pets[id]?.fed.history || {});
    // construct eventList with title and date
    const eventList = [];
    wateredDates.forEach((item) => {
      eventList.push({ title: 'Watered 💦', date: `${item}` });
    });
    fertilizedDates.forEach((item) => {
      eventList.push({ title: 'Fertilized 🌱', date: `${item}` });
    });
    turnedDates.forEach((item) => {
      eventList.push({ title: 'Turned 💃', date: `${item}` });
    });
    fedDates.forEach((item) => {
      eventList.push({ title: 'Fed 🍽', date: `${item}` });
    });
    this.setState({
      eventList,
    });
  }

  render() {
    const { own, store: { users, pets, account: { username: ownUsername } } } = this.props;
    const { history, match: { params: { username, id } } } = this.props;
    const { speciesName, scientificName, description, carnivorous,
      waterFreq, fertFreq, feedFreq, eventList,
      profilePic, growthPics, location, nextCycleDates } = this.state;

    let pet;
    let dead = false;
    if (!own) {
      pet = users[username]
        ? users[username].pets[id]
        : { name: '', type: '', birth: '', ownedSince: '', death: '', watered: {}, fertilized: {}, turned: {}, fed: {}, dead: 0 };
    } else if (!pets[id]) {
      history.push('/notfound');
      return null;
    } else {
      pet = pets[id];
      dead = (pet?.dead === 1);
    }

    return (
      <div>
        <Navbar />

        <div id="plant-profile-page" className="container">
          <section id="plant-name-and-information" className="no-border">
            <div>
              <h1>{pet?.name}</h1>
              <span>
                <img style={{ width: '150px' }} id="profile-picture" src={profilePic} alt="Profile" />
              </span>
            </div>

            <GeneralInformation
              speciesName={speciesName}
              scientificName={scientificName}
              description={description}
              birth={pet?.birth}
              ownedSince={pet?.ownedSince}
              location={location}

              dead={pet.dead ? pet.dead : 0}
              death={pet.death ? pet.death : ''}
            />
          </section>

          {(!own || dead) ? '' : (
            <section id="manage-plant">
              <ManagePlant id={id} pet={pet} username={ownUsername} />
            </section>
          )}

          {!own ? '' : (
            <section id="care-frequency">
              <CareFrequency
                id={id}
                pet={pet}
                dead={pet.dead ? pet.dead : 0}
                waterFreq={waterFreq}
                fertFreq={fertFreq}
                feedFreq={feedFreq}
                carnivorous={carnivorous}
                nextCycleDates={nextCycleDates}
                onChange={this.fetchEventList}
              />
            </section>
          )}

          <section id="care-calendar">
            <CareCalendar events={eventList} />
          </section>

          <section id="growth-pictures">
            <GrowthPictures pictures={growthPics} foreignPlant={!own} />
          </section>
        </div>
      </div>
    );
  }
}

PlantProfilePage.propTypes = {
  own: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
      username: PropTypes.string,
    }),
    pets: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    plants: PropTypes.object.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string,
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default connect(map)(withRouter(PlantProfilePage));
