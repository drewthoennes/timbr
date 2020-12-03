/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProfilePicture from '../../assets/images/pet_profile_picture.png';
import Navbar from '../../components/Navbar';
import { setForeignUserPets, getPetProfilePicture, getPetGrowthPictures, updateStreak } from '../../store/actions/pets';
import map from '../../store/map';
import './styles.scss';

import GeneralInformation from './GeneralInformation';
import CareFrequency from './CareFrequency';
import CareCalendar from './CareCalendar';
import GrowthPictures from './GrowthPictures';
import ManagePlant from './ManagePlant';

const getToday = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 10);
};

const getYesterday = () => {
  const date = new Date();
  // subtract one day from current time
  date.setDate(date.getDate() - 1);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 10);
};

class PlantProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.getPlantDetails = this.getPlantDetails.bind(this);
    this.getProfilePicture = this.getProfilePicture.bind(this);
    this.getGrowthPictures = this.getGrowthPictures.bind(this);
    this.fetchEventList = this.fetchEventList.bind(this);
    this.getPlantLocation = this.getPlantLocation.bind(this);
    this.getStreaks = this.getStreaks.bind(this);

    this.state = {
      speciesName: '',
      scientificName: '',
      waterFreq: 0,
      description: '',
      carnivorous: false,
      feedFreq: '',
      fertFreq: 0,
      rotateFreq: 0,
      profilePic: ProfilePicture,
      growthPics: {},
      eventList: [],
      location: '',
      nextCycleDates: [],
      waterStreak: 0,
      fertStreak: 0,
      turnStreak: 0,
      feedStreak: 0,

    };
  }

  componentDidMount() {
    const { match: { params: { username, id } } } = this.props;
    const { history, store: { pets, account: { username: ownUsername } } } = this.props;
    if (!pets[id]) {
      history.push('/notfound');
      return;
    }
    this.getPlantDetails();
    this.fetchEventList();
    this.getProfilePicture();
    this.getGrowthPictures();
    this.getPlantLocation();
    this.getNextCycle();
    this.getStreaks();

    if (!username) {
      Promise.resolve();
      return;
    }
    setForeignUserPets(username, id).catch(() => history.push(`/${ownUsername}`));
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
      diffDays = daysToAdd;
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

  getStreaks() {
    const { match: { params: { id } } } = this.props;
    const { store: { pets } = {} } = this.props;
    const today = getToday();
    const yesterday = getYesterday();
    const waterHistory = Object.keys(pets[id].watered.history || {});
    const waterstreakUpdated = pets[id].watered.streakUpdated;

    // case:water
    if (waterHistory.includes(yesterday) && waterHistory.includes(today)
    && waterstreakUpdated !== today) {
      // user has watered today and did so yesterday (ongoing streak) -- increment streak
      const newStreak = pets[id].watered.streak + 1;
      updateStreak(id, 'watered', newStreak, today);
      this.setState({ waterStreak: newStreak });
    } else {
      // reset streak to 0
      if (pets[id].watered.streak > 0 && waterHistory.includes(yesterday) === false) {
        updateStreak(id, 'watered', 0, today);
        this.setState({ waterStreak: 0 });
      }
      if (waterHistory.includes(yesterday) && waterHistory.includes(today) === false) {
        // case when the user watered yesterday but hasn't yet watered today (checking)
        this.setState({ waterStreak: pets[id].watered.streak });
      }
    }// end of case water

    // case:fertilize
    const fertHistory = Object.keys(pets[id].fertilized.history || {});
    const fertstreakUpdated = pets[id].fertilized.streakUpdated;
    if (fertHistory.includes(yesterday) && fertHistory.includes(today)
    && fertstreakUpdated !== today) {
      // user has watered today and did so yesterday (ongoing streak) -- increment streak
      const newStreak = pets[id].fertilized.streak + 1;
      updateStreak(id, 'fertilized', newStreak, today);
      this.setState({ fertStreak: newStreak });
    } else {
      // reset streak to 0
      if (pets[id].fertilized.streak > 0 && fertHistory.includes(yesterday) === false) {
        updateStreak(id, 'fertilized', 0, today);
        this.setState({ fertStreak: 0 });
      }
      if (fertHistory.includes(yesterday) && fertHistory.includes(today) === false) {
        this.setState({ fertStreak: pets[id].fertilized.streak });
      }
    }// end of case fertilize

    // case:rotate
    const turnHistory = Object.keys(pets[id].turned.history || {});
    const turnstreakUpdated = pets[id].turned.streakUpdated;
    if (turnHistory.includes(yesterday) && turnHistory.includes(today)
    && turnstreakUpdated !== today) {
      // user has watered today and did so yesterday (ongoing streak) -- increment streak
      const newStreak = pets[id].turned.streak + 1;
      updateStreak(id, 'turned', newStreak, today);
      this.setState({ turnStreak: newStreak });
    } else {
      // reset streak to 0
      if (pets[id].turned.streak > 0 && turnHistory.includes(yesterday) === false) {
        updateStreak(id, 'turned', 0, today);
        this.setState({ turnStreak: 0 });
      }
      if (turnHistory.includes(yesterday) && turnHistory.includes(today) === false) {
        this.setState({ turnStreak: pets[id].turned.streak });
      }
    }// end of case turn

    // case: feed -- for carnivorous plants
    const { store: { plants } } = this.props;
    if (plants[pets[id].type] === 'carnivorous') {
      const feedHistory = Object.keys(pets[id].fed.history || {});
      const feedstreakUpdated = pets[id].fed.streakUpdated;
      if (feedHistory.includes(yesterday)
      && feedHistory.includes(today) && feedstreakUpdated !== today) {
        const newStreak = pets[id].fed.streak + 1;
        updateStreak(id, 'fed', newStreak, today);
        this.setState({ feedStreak: newStreak });
      } else {
      // reset streak to 0
        if (pets[id].fed.streak > 0 && feedHistory.includes(yesterday) === false) {
          updateStreak(id, 'fed', 0, today);
          this.setState({ feedStreak: 0 });
        }
        if (feedHistory.includes(yesterday) && feedHistory.includes(today) === false) {
          this.setState({ feedStreak: pets[id].fed.streak });
        }
      }// end of case turn
    }
  }

  fetchEventList() {
    // fetches action history
    this.getStreaks();
    this.getNextCycle();
    const { match: { params: { id } } } = this.props;
    const { store: { pets } = {} } = this.props;
    this.setState({ waterStreak: pets[id].watered.streak });
    this.setState({ fertStreak: pets[id].fertilized.streak });
    this.setState({ turnStreak: pets[id].turned.streak });
    this.setState({ feedStreak: pets[id].fed.streak });
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
      waterFreq, fertFreq, feedFreq, rotateFreq, eventList,
      profilePic, growthPics, location, nextCycleDates,
      waterStreak, fertStreak, turnStreak, feedStreak } = this.state;

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
          <section id="plant-name">
            <h1 className="text-center">{pet?.name}</h1>
          </section>
          <section id="plant-picture-and-information" className="no-border">
            <div>
              <span>
                <img style={{ width: '200px', height: '200px' }} id="profile-picture" src={profilePic} alt="Profile" />
              </span>
            </div>

            <GeneralInformation
              speciesName={speciesName}
              scientificName={scientificName}
              description={description}
              name={pet.name}
              birth={pet?.birth}
              ownedSince={pet?.ownedSince}
              plantLocation={location ?? ''}
              parent={pet.parent ?? null}
              petChildren={pet.children ?? []}
              dead={pet.dead}
              death={pet.death}
            />
          </section>

          {(!own) ? '' : (
            <section id="manage-plant">
              <ManagePlant id={id} pet={pet} username={ownUsername} dead={dead} />
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
                rotateFreq={rotateFreq}
                feedFreq={feedFreq}
                carnivorous={carnivorous}
                nextCycleDates={nextCycleDates}
                waterStreak={parseInt(waterStreak, 10)}
                fertStreak={parseInt(fertStreak, 10)}
                turnStreak={parseInt(turnStreak, 10)}
                feedStreak={parseInt(feedStreak, 10)}
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
