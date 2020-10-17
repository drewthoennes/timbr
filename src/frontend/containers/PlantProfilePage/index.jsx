/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import Navbar from '../../components/Navbar';

import { setForeignUserPets, changeWatered } from '../../store/actions/pets';
//import {changeWatered,getWateredState} from '../../store/actions/pets';
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
    alert('HIII');
    var date=new Date();
    changeWatered(
    {date: true}
    )
    getWateredState(); 
   
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
  startDate={new Date('2016-01-01')}
  endDate={new Date('2016-04-01')}
  values={[
    { date: '2016-01-01', value:true },
    { date: '2016-01-22'  },
    { date: '2016-01-30'  },
    { date: '2016-03-20'},
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