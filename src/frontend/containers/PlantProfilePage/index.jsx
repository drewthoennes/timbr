/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import Navbar from '../../components/Navbar';

import { setForeignUserPets } from '../../store/actions/pets';
import {changeWatered,getWateredState} from '../../store/actions/pets';
import map from '../../store/map';
import './styles.scss';


class PlantProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.onWater = this.onWater.bind(this);
    this.state = {
    }
  }
  
  onWater() {
    const { history, match: { params: { username, id } } } = this.props;
    let today = new Date().toISOString().slice(0, 10);
   // changeWatered(id,
    //{[today]: true}
   // )
   changeWatered(id,today);
    console.log("id is and today is",id,today);
  
    
   
  }

 
  
  componentDidMount() {
    const { match: { params: { username, id } } } = this.props;
    const { history, store: { account: { username: ownUsername } } } = this.props;
    
    console.log('Component did mount');
    
    if (!username) return Promise.resolve();
    
    return setForeignUserPets(username, id).catch(() => history.push(`/${ownUsername}`));
  }


  render() {
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
        <button onClick={this.onWater}> Water </button>
        </div>
         <div id='heatmap'>
         <CalendarHeatmap
  startDate={new Date('2020-04-01')}
  endDate={new Date('2020-11-01')}
  values={[
    { date: '2020-10-20', value:true },
    { date: '2020-10-10', value:true }
    
    // ...and so on
  ]} />
  </div>
      </div>
    );
  }
  handleDateClick = (arg) => { // bind with an arrow function
    alert(arg.dateStr)
    console.log("hello")
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