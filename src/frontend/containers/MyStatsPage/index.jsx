import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import WaterFreqsChart from './WaterFreqsChart';
import ProfilePicture from '../../assets/images/pet_profile_picture.png';
import Navbar from '../../components/Navbar';
import map from '../../store/map';
import './styles.scss';
import { logout } from '../../store/actions/auth';
import { getPetProfilePicture } from '../../store/actions/pets';

class MyStatsPage extends React.Component {
  constructor() {
    super();

    this.state = { profilePics: {} };
    this.getNumPets = this.getNumPets.bind(this);
    this.getNumLivingPets = this.getNumLivingPets.bind(this);
    this.getNumDeadPets = this.getNumDeadPets.bind(this);
    this.getTotalWaterings = this.getTotalWaterings.bind(this);
    this.getTotalTurnings = this.getTotalTurnings.bind(this);
    this.getPetWateringFreqs = this.getPetWateringFreqs.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    const { store: { account: { uid } }, history } = this.props;

    if (!uid) {
      history.push('/login');
    }
  }

  componentDidUpdate() {
    const { store: { account: { uid } }, history } = this.props;

    if (!uid) {
      history.push('/login');
    }
  }

  handleLogout(e) {
    e.preventDefault();

    const { history } = this.props;
    logout()
      .then(() => {
        history.push('/login');
      });
  }

  getNumPets(pets) {
    return Object.keys(pets).length;
  }

  getNumLivingPets(pets) {
    Object.keys(pets).filter(pet => !pet.dead).length;
  }

  getNumDeadPets(pets) {
    Object.keys(pets).filter(pet => pet.dead).length;
  }

  getTotalWaterings(pets) {
    let waterings = 0;
    for (let i in pets) {
      for (let j in pets[i].watered.history) {
        if (pets[i].watered.history[j]) waterings++;
      }
    }
    return waterings;
  }

  getTotalTurnings(pets) {
    let turnings = 0;
    for (let i in pets) {
      for (let j in pets[i].turned.history) {
        if (pets[i].turned.history[j]) turnings++;
      }
    }
    return turnings;
  }

  getPetWateringFreqs(pets, plants) {
    const chartData = [
      { x: '>1 week', y: 0 },
      { x: '1-2 weeks', y: 0 },
      { x: '2-3 weeks', y: 0 },
      { x: '3-4 weeks', y: 0 },
      { x: '4+ weeks', y: 0 },
    ];

    const petTypes = [];
    for (let i in pets) petTypes.push(pets[i].type);

    for (let i in petTypes) {
      const waterFreq = Math.floor(plants[petTypes[i]].waterFreq / 7);
      chartData[waterFreq].y++;
    }

    return chartData;
  }

  render() {
    const { store: { pets, plants, account: { username } } } = this.props;
    const numPets = this.getNumPets(pets);
    const numLivingPets = this.getNumLivingPets(pets);
    const numDeadPets = this.getNumDeadPets(pets);
    const totalWaterings = this.getTotalWaterings(pets);
    const totalTurnings = this.getTotalTurnings(pets);
    const waterFreqData = this.getPetWateringFreqs(pets, plants);

    return (
      <div id="my-stats-page">
        <Navbar />
        <div className="container">
          <h1>{username}'s Statistics</h1>
          <p>I have taken care of {numPets ?? 0} plant{numPets == 1 ? '' : 's'} in total.</p>
          <p>I am currently taking care of {numLivingPets ?? 0} plant{numLivingPets == 1 ? '' : 's'}.</p>
          <p>{numDeadPets ?? 'None'} of my plants {numDeadPets == 1 ? 'has' : 'have'} died.</p>
          <p>I have watered my plants a total of {totalWaterings} time{totalWaterings == 1 ? '' : 's'}.</p>
          <p>I have rotated my plants a total of {totalTurnings} time{totalTurnings == 1 ? '' : 's'}.</p>
          <h4>Watering Requirements of My Plants</h4>
          <WaterFreqsChart data={waterFreqData}/>
        </div>
      </div>
    );
  }
}
MyStatsPage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
      username: PropTypes.string,
    }).isRequired,
    pets: PropTypes.object.isRequired,
    plants: PropTypes.object.isRequired,
  }).isRequired,
};
export default connect(map)(withRouter(MyStatsPage));
