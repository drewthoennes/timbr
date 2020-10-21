/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar';

import { setForeignUserPets, addDate, getDate } from '../../store/actions/pets';

import map from '../../store/map';
import './styles.scss';


class PlantProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.onWater = this.onWater.bind(this);
    this.onFertilize = this.onFertilize.bind(this);
    this.onRotate = this.onRotate.bind(this);
    this.state = {
    count:''
      
    };
  }

  componentDidMount() {
    const { match: { params: { username, id } } } = this.props;
    const { history, store: { account: { username: ownUsername } } } = this.props;

    console.log('Component did mount');

    if (!username) return Promise.resolve();
    
    return setForeignUserPets(username, id).catch(() => history.push(`/${ownUsername}`));
  }

  onWater() {
    const { match: { params: { id } } } = this.props;
    const today = new Date().toISOString().slice(0, 10);
    addDate(id, 'watered', today).then((value) => {
      getDate(id,'watered')
    .then((result) => {
        console.log('the result is', result)
        const { count } = this.state;
        return this.setState({count : count.concat('water')});
    })
    
      
    }); 
    
    
  }

  onFertilize() {
    const { match: { params: { id } } } = this.props;
    const today = new Date().toISOString().slice(0, 10);
    addDate(id, 'fertilized', today);
    addDate(id, 'fertilized', today).then((value) => {
      getDate(id,'fertilized')
    .then((result) => {
        console.log('the result is', result)
        const { count } = this.state;
        return this.setState({count : count.concat('fertilized')});
    })
    
      
    });
    console.log("result HERE",result)
  }

  onRotate() {
    const { match: { params: { id } } } = this.props;

    const today = new Date().toISOString().slice(0, 10);
    addDate(id, 'turned', today).then((value) => {
      getDate(id,'turned')
    .then((result) => {
        console.log('the result is', result)
        const { count } = this.state;
        return this.setState({ count: 1 });
    })
    
      
    });
  }

  
  

  render() {
    const { count } = this.state;
    const { store: { users, pets, account: { username: ownUsername } } } = this.props;
    const { history, match: { params: { username, id } } } = this.props;
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
           <p>{count}</p>
          <button type="button" onClick={this.onWater}> Water </button>
          <button type="button" onClick={this.onFertilize}> Fertilize </button>
          <button type="button" onClick={this.onRotate}> Rotate </button>
          <button type="button" onClick={this.onEverything}> Rotate </button>
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
