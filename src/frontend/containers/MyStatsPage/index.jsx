import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import PetCareFreqChart from './PetCareFreqChart';
import PetsOverTimeChart from './PetsOverTimeChart';
import Navbar from '../../components/Navbar';
import map from '../../store/map';
import './styles.scss';
import { logout } from '../../store/actions/auth';

class MyStatsPage extends React.Component {
  constructor(props) {
    super(props);

    this.getNumPets = this.getNumPets.bind(this);
    this.getCareTotal = this.getCareTotal.bind(this);
    this.getPetCareFreqs = this.getPetCareFreqs.bind(this);
    this.getPetsOverTime = this.getPetsOverTime.bind(this);
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

  getNumPets(living) {
    const { store: { pets } } = this.props;

    let results = 0;
    for (const i in pets) {
      if ((living ?? !pets[i].dead) === !pets[i].dead) results++;
    }
    return results;
  }

  getCareTotal(attr) {
    const { store: { pets } } = this.props;

    let cares = 0;
    for (const i in pets) {
      for (const j in pets[i][attr].history) {
        if (pets[i][attr].history[j]) cares++;
      }
    }
    return cares;
  }

  getPetCareFreqs(attr) {
    const { store: { pets, plants } } = this.props;

    const chartData = [
      { x: '>1 week', y: 0 },
      { x: '1-2 weeks', y: 0 },
      { x: '2-3 weeks', y: 0 },
      { x: '3-4 weeks', y: 0 },
      { x: '4+ weeks', y: 0 },
    ];

    const petTypes = [];
    for (const i in pets) petTypes.push(pets[i].type);

    for (const i in petTypes) {
      const freq = Math.floor(plants[petTypes[i]][attr] / 7);
      chartData[freq].y++;
    }

    return chartData;
  }

  getPetsOverTime() {
    const { store: { pets } } = this.props;

    const chartData = [];

    const d = new Date();
    d.setHours(0, 0, 0, 0);

    /* LCV is a date variable that decrements itself by one week every iteration
      Loop terminates when oldest ownership date is reached */
    let olderPlants = true;
    for (d.setDate(d.getDate() - d.getDay()); olderPlants; d.setDate(d.getDate() - 7)) {
      let numAlive = 0;
      olderPlants = false;

      for (const i in pets) {
        // If at least one pet is older than the current d value, flip olderPlants to true
        if (pets[i].ownedSince && new Date(pets[i].ownedSince) < d) olderPlants = true;

        // Check if the pet was alive during the current d value
        if (new Date(pets[i].ownedSince ?? 0) < d
          && (!pets[i].dead || (new Date(pets[i].death) > d))) numAlive++;
      }

      // Append results to chartData
      chartData.unshift({ x: d.toISOString().split('T')[0], y: numAlive });
    }

    return chartData;
  }

  render() {
    const { store: { account: { username } } } = this.props;
    const numPets = this.getNumPets();
    const numLivingPets = this.getNumPets(true);
    const numDeadPets = this.getNumPets(false);

    const totalWaterings = this.getCareTotal('watered');
    const totalTurnings = this.getCareTotal('turned');
    const totalFeedings = this.getCareTotal('fed');
    const totalFertilizings = this.getCareTotal('fertilized');

    const waterFreqData = this.getPetCareFreqs('waterFreq');
    const rotateFreqData = this.getPetCareFreqs('rotateFreq');
    const feedFreqData = this.getPetCareFreqs('feedFreq');
    const fertFreqData = this.getPetCareFreqs('fertFreq');

    const plantsOverTimeData = this.getPetsOverTime();

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
                  <PetCareFreqChart xLabel="Watering Frequency" data={waterFreqData} height={300} />
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Rotating Requirements of My Plants</Card.Title>
                  <PetCareFreqChart xLabel="Rotating Frequency" data={rotateFreqData} height={300} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Feeding Requirements of My Plants</Card.Title>
                  <PetCareFreqChart xLabel="Feeding Frequency" data={feedFreqData} height={300} />
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Fertilizing Requirements of My Plants</Card.Title>
                  <PetCareFreqChart xLabel="Fertilizing Frequency" data={fertFreqData} height={300} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card>
            <Card.Body>
              <Card.Title>How Many Plants I've Owned Over Time</Card.Title>
              <PetsOverTimeChart xLabel="Week" data={plantsOverTimeData} height={300} />
            </Card.Body>
          </Card>
          <br />
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
