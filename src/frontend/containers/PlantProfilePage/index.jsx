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
    this.getEventList = this.getEventList.bind(this);
    this.state = {
    count:0,
    eventsArr:{},
    data:''
      
    };
  }

  componentDidMount() {
    
    const { match: { params: { username, id } } } = this.props;
    const { history, store: { account: { username: ownUsername } } } = this.props;
    
    console.log('Component did mount');
    const fetchDates = async () => {
      const response = await getDate(id,'watered');
      //const { data } = await response;
      //const {data}=response[0]
      let data = [];
      data.push("hi dude");
      console.log("data over here is",data,' and response is ',response)
      this.setState({
        data
      });
    };
    fetchDates();
  
    /*getDate(id,'watered').then((response)=>{
      console.log("HI THE RESULT IS",response);
      let data = [];
      //data.push("hi dude");
      data="hey there";
      this.setState({ data:data });
      console.log("inside data is",this.data)

    });
    console.log("data is",this.data)*/
    if (!username) return Promise.resolve();
    
    return setForeignUserPets(username, id).catch(() => history.push(`/${ownUsername}`));
  }

  onWater() {
    //checking if other actions have been performed yet
    const { count } = this.state;
    if(count==0){
      this.setState({ count: 1 })
    }else{
      this.setState({ count: 4 })
    }
    
    const { match: { params: { id } } } = this.props;
    const today = new Date().toISOString().slice(0, 10);
    addDate(id, 'watered', today).then((value) => {
      getDate(id,'watered')
    .then((result) => {
        console.log('the result is', result)
        console.log("count is",{count})
        this.getEventList(1,result);
        
    })
    
      
    }); 
    
    
  }

  onFertilize() {
    const { count } = this.state;
    if(count==0){
      this.setState({ count: 2 })
    }else{
      this.setState({ count: 4 })
    }
    const today = new Date().toISOString().slice(0, 10);
    const { match: { params: { id } } } = this.props;
    addDate(id, 'fertilized', today).then((value) => {
      getDate(id,'fertilized')
    .then((result) => {
        console.log('the result is', result)
        this.getEventList(2,result);
    })
  });
    
  }

  onRotate() {
    const { count } = this.state;
    if(count==0){
      this.setState({ count: 3 })
    }else{
      this.setState({ count: 4 })
    }
    
    const { match: { params: { id } } } = this.props;
    const today = new Date().toISOString().slice(0, 10);
    addDate(id, 'turned', today).then((value) => {
      getDate(id,'turned')
    .then((result) => {
        console.log('the result is', result)
        this.getEventList(3,result);
    })
    
      
    });
  }

  getEventList(count,result){
    var wateredEvents='';
    var fertilizedEvents='';
    
    
    const { match: { params: { id } } } = this.props;
    console.log("here it is",count,result)
    //get watered dates
    Promise.all([
    getDate(id,'watered'),
    //get filtered dates
    getDate(id,'fertilized')
    
  ]).then(function(results){
    console.log("results are",results)
    let difference = results[0].filter(x => !results[1].includes(x));
    console.log("difference is",difference)
    return difference;
  })
    //let difference = wateredEvents.filter(x => !fertilizedEvents.includes(x));
    console.log("outside watered",wateredEvents);
  
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
   /* let test=this.state.data;
    let itemList = this.state.data.map(function(item) {
      return <li className="item" key={item.id}>{item.title}</li>; 
  }); */

    return (
      <div>
        <Navbar />
        <h1>{pet.name}</h1>
        
        <div>
           <p>{this.state.data}</p>
          <button type="button" onClick={this.onWater}> Water </button>
          <button type="button" onClick={this.onFertilize}> Fertilize </button>
          <button type="button" onClick={this.onRotate}> Rotate </button>
        </div>
        <div id="calendar">
        <FullCalendar
  plugins={[ dayGridPlugin ]}
  initialView="dayGridMonth"
  weekends={false}
  events={[
    { title: 'event 1', date: '2020-10-01' },
    { title: 'event 2', date: '2020-10-21' }
  ]}
    />
        </div>
        <div id="heatmap">
          <CalendarHeatmap
            startDate={new Date('2020-04-01')}
            endDate={new Date('2020-11-01')}
            values={[
              { date: '2020-10-20', value: 1 },
              { date: '2020-10-10', value: 2},
              { date: '2020-10-10', value:3}

              // ...and so on
            ]}
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
