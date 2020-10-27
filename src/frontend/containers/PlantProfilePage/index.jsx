/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar';

import { setForeignUserPets, addDate, getPlantName, getPlantWaterCycle, getPlantDescription, getPlantCarnivore, getPlantSciName, getPlantFeedFreq,  getPlantFertFreq, getPlantImageURL } from '../../store/actions/pets';

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
    this.getSciName =  this.getSciName.bind(this);
    this.getFeedFreq = this.getFeedFreq.bind(this);
    this.getFertFreq = this.getFertFreq.bind(this);
    this.getImageURL = this.getImageURL.bind(this);
    this.onWater = this.onWater.bind(this);
    this.onFertilize = this.onFertilize.bind(this);
    this.onRotate = this.onRotate.bind(this);

    this.state = {
      speciesName: '',
      scientificName: '',
      waterFreq: 0,
      description: '',
      carn: false,
      feedFreq: 0,
      fertFreq: 0,
      imageURL: '',
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

    if (!username) return Promise.resolve();

    return setForeignUserPets(username, id).catch(() => history.push(`/${ownUsername}`));
  }

  getPlantType(){
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

  getSpeciesName(){
    let plantType;
    plantType = this.getPlantType();
    getPlantName(
      (plant) => { this.setState({ speciesName: plant.val() }); }, plantType,
    );
  }

  getSciName(){
    let plantType;
    plantType = this.getPlantType();
    getPlantSciName(
      (plant) => { this.setState({ scientificName: plant.val() }); }, plantType,
    );
  }

  getWateringFreq() {
    let plantType;
    plantType = this.getPlantType();
    getPlantWaterCycle(
      (plant) => { this.setState({ waterFreq: plant.val() }); }, plantType,
    );
  }

  getFeedFreq(){
    let plantType;
    plantType = this.getPlantType();
    getPlantFeedFreq(
      (plant) => { this.setState({ feedFreq: plant.val() }); }, plantType,
    );
  }

  getFertFreq(){
    let plantType;
    plantType = this.getPlantType();
    getPlantFertFreq(
      (plant) => { this.setState({ fertFreq: plant.val() }); }, plantType,
    );
  }

  getDescription(){
    let plantType;
    plantType = this.getPlantType();
    getPlantDescription(
      (plant) => { this.setState({ description: plant.val() }); }, plantType,
    );
  }

  getCarnivore(){
    let plantType;
    plantType = this.getPlantType();
    getPlantCarnivore(
      (plant) => { this.setState({ carn: plant.val() }); }, plantType,
    );
  }

  getImageURL(){
    let plantType;
    plantType = this.getPlantType();
    getPlantImageURL(
      (plant) => { this.setState({ imageURL: plant.val() }); }, plantType,
    );
  }
  
  onWater() {
    const { match: { params: { id } } } = this.props;
    const today = new Date().toISOString().slice(0, 10);
    addDate(id, 'watered', today);
    console.log('id is', id);
  }

  onFertilize() {
    const { match: { params: { id } } } = this.props;
    const today = new Date().toISOString().slice(0, 10);
    addDate(id, 'fertilized', today);
  }

  onRotate() {
    const { match: { params: { id } } } = this.props;

    const today = new Date().toISOString().slice(0, 10);
    addDate(id, 'turned', today);
  }

  render() {
    const { store: { users, pets, account: { username: ownUsername } } } = this.props;
    const { history, match: { params: { username, id } } } = this.props;
    const isCarnivorous = this.state.carn;

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
          src={this.state.imageURL}
          alt="new"
        />
        <h2>General Information</h2>
        <p>{this.state.speciesName}</p>
        <p><i>{this.state.scientificName}</i></p>
        <p>{this.state.description}</p>
        <p>
          This plant {isCarnivorous ? 'is' : 'is not'} carnivorous.
        </p>
        <p>Water Schedule: {this.state.waterFreq} Days</p>
        <p>Fertiliztion Schedule: {this.state.fertFreq} Days</p>
        <p>Feed Schedule: {this.state.feedFreq} Days</p>
        <div>
          <button type="button" onClick={this.onWater}> Water </button>
          <button type="button" onClick={this.onFertilize}> Fertilize </button>
          <button type="button" onClick={this.onRotate}> Rotate </button>
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
