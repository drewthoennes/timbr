import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, Card, Jumbotron } from 'react-bootstrap';
import PropTypes from 'prop-types';
import PetCareFreqChart from './PetCareFreqChart';
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
    this.getCareTotal = this.getCareTotal.bind(this);
    this.getPetCareFreqs = this.getPetCareFreqs.bind(this);
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

  getNumPets(pets, living) {
    let results = 0;
    for (let i in pets) {
      if (living ?? !pets[i].dead === !pets[i].dead) results++;
    }
    return results;
  }

  getCareTotal(pets, attr) {
    let cares = 0;
    for (let i in pets) {
      for (let j in pets[i][attr].history) {
        if (pets[i][attr].history[j]) cares++;
      }
    }
    return cares;
  }

  getPetCareFreqs(pets, plants, attr) {
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
      const freq = Math.floor(plants[petTypes[i]][attr] / 7);
      chartData[freq].y++;
    }

    return chartData;
  }

  render() {
    const { store: { pets, plants, account: { username } } } = this.props;
    const numPets = this.getNumPets(pets);
    const numLivingPets = this.getNumPets(pets, true);
    const numDeadPets = this.getNumPets(pets, false);

    const totalWaterings = this.getCareTotal(pets, 'watered');
    const totalTurnings = this.getCareTotal(pets, 'turned');
    const totalFeedings = this.getCareTotal(pets, 'fed');
    const totalFertilizings = this.getCareTotal(pets, 'fertilized');

    const waterFreqData = this.getPetCareFreqs(pets, plants, 'waterFreq');
    const rotateFreqData = this.getPetCareFreqs(pets, plants, 'rotateFreq');
    const feedFreqData = this.getPetCareFreqs(pets, plants, 'feedFreq');
    const fertFreqData = this.getPetCareFreqs(pets, plants, 'fertFreq');

    return (
      <div id="my-stats-page">
        <Navbar />
        <h1 className="page-title">{username}'s Statistics</h1>
        <div className="container">
          <h3 className="text-center">My Plants</h3>
          <Row className="justify-content-center">
            <Card className="stat-card">
              <Card.Body>
                <Card.Title>{numPets}</Card.Title>
                <Card.Text>total plants registered</Card.Text>
              </Card.Body>
            </Card>
            <Card className="stat-card">
              <Card.Body>
                <Card.Title>{numLivingPets}</Card.Title>
                <Card.Text>plants currently under my care</Card.Text>
              </Card.Body>
            </Card>
            <Card className="stat-card">
              <Card.Body>
                <Card.Title>{numDeadPets}</Card.Title>
                <Card.Text>plants in the Graveyard</Card.Text>
              </Card.Body>
            </Card>
          </Row>

          <h3 className="text-center">Plant Care</h3>
          <Row className="justify-content-center">
            <Card className="stat-card">
              <Card.Body>
                <Card.Title>{totalWaterings}</Card.Title>
                <Card.Text>total times watering my plants</Card.Text>
              </Card.Body>
            </Card>
            <Card className="stat-card">
              <Card.Body>
                <Card.Title>{totalTurnings}</Card.Title>
                <Card.Text>total times rotating my plants</Card.Text>
              </Card.Body>
            </Card>
            <Card className="stat-card">
              <Card.Body>
                <Card.Title>{totalFeedings}</Card.Title>
                <Card.Text>total times feeding my plants</Card.Text>
              </Card.Body>
            </Card>
            <Card className="stat-card">
              <Card.Body>
                <Card.Title>{totalFertilizings}</Card.Title>
                <Card.Text>total times fertilizing my plants</Card.Text>
              </Card.Body>
            </Card>
          </Row>

          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Watering Requirements of My Plants</Card.Title>
                  <PetCareFreqChart xLabel="Watering Frequency" data={waterFreqData} height="300"/>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Rotating Requirements of My Plants</Card.Title>
                  <PetCareFreqChart xLabel="Rotating Frequency" data={rotateFreqData} height="300"/>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Feeding Requirements of My Plants</Card.Title>
                  <PetCareFreqChart xLabel="Feeding Frequency" data={feedFreqData} height="300"/>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Fertilizing Requirements of My Plants</Card.Title>
                  <PetCareFreqChart xLabel="Fertilizing Frequency" data={fertFreqData} height="300"/>
                </Card.Body>
              </Card>
            </Col>
          </Row>
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
