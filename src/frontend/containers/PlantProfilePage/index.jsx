/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { setForeignUserPets, addDate, getDate } from '../../store/actions/pets';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import map from '../../store/map';
import './styles.scss';


class PlantProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.onWater = this.onWater.bind(this);
    this.onFertilize = this.onFertilize.bind(this);
    this.onRotate = this.onRotate.bind(this);
    this.testFunction=this.testFunction.bind(this);
    this.state = {
    data:[]
      
    };
  }

  async testFunction(){
    const { match: { params: { id } } } = this.props;
    console.log("inside fetch dates")
      const response1 = await getDate(id,'watered');
      console.log("AFTER WATER")
      const response2=await getDate(id,'fertilized');
      console.log("AFTER FERTILIZE")
      const response3= await getDate(id,'turned');
      console.log("AFTER TURN")
      //construct an array of objects
      let eventList=[]
      if(response1!=null){
      response1.forEach(function(item){
        eventList.push({title:'watered',date:`${item}`})
      })
    }
    if(response2!=null){
      response2.forEach(function(item){
        eventList.push({title:'fertilized',date:`${item}`})
      })
    }if(response3!=null){
      response3.forEach(function(item){
        eventList.push({title:'turned',date:`${item}`})
      })
    }
      this.setState({
        data: eventList
      });
    
  }

  componentDidMount() {
    
    const { match: { params: { username, id } } } = this.props;
    const { history, store: { account: { username: ownUsername } } } = this.props;
    
    console.log('Component did mount');
   /* const fetchDates = async () => {
      console.log("inside fetch dates")
      const response1 = await getDate(id,'watered');
      console.log("AFTER WATER")
      const response2=await getDate(id,'fertilized');
      console.log("AFTER FERTILIZE")
      const response3= await getDate(id,'turned');
      console.log("AFTER TURN")
      //construct an array of objects
      let eventList=[]
      if(response1!=null){
      response1.forEach(function(item){
        eventList.push({title:'watered',date:`${item}`})
      })
    }
    if(response2!=null){
      response2.forEach(function(item){
        eventList.push({title:'fertilized',date:`${item}`})
      })
    }if(response3!=null){
      response3.forEach(function(item){
        eventList.push({title:'turned',date:`${item}`})
      })
    }
      this.setState({
        data: eventList
      });
    };
    fetchDates() */
    
    this.testFunction('watered');
    this.testFunction('fertilized');
    this.testFunction('turned');
    if (!username) return Promise.resolve();
    
    return setForeignUserPets(username, id).catch(() => history.push(`/${ownUsername}`));
  }

  onWater() {
    
    
    const { match: { params: { id } } } = this.props;
    const today = new Date().toISOString().slice(0, 10);
    addDate(id, 'watered', today).then((result)=>{
      this.testFunction();
    });
    
    
  }

  onFertilize() {
   
    const today = new Date().toISOString().slice(0, 10);
    const { match: { params: { id } } } = this.props;
    addDate(id, 'fertilized', today).then((result)=>{
      this.testFunction();
    });
    
  }

  onRotate() {
   
    
    const { match: { params: { id } } } = this.props;
    const today = new Date().toISOString().slice(0, 10);
    addDate(id, 'turned', today).then((result)=>{
      this.testFunction();
    });
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
           <p>hi</p>
          <button type="button" onClick={this.onWater}> Water </button>
          <button type="button" onClick={this.onFertilize}> Fertilize </button>
          <button type="button" onClick={this.onRotate}> Rotate </button>
        </div>
        <div id="calendar">
        <FullCalendar
  plugins={[ dayGridPlugin ]}
  initialView="dayGridMonth"
  weekends={false}
  events={this.state.data}
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
