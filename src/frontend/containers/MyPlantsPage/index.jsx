import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ProfilePicture from '../../assets/images/pet_profile_picture.png';
import Navbar from '../../components/Navbar';
import map from '../../store/map';
import './styles.scss';
import { logout } from '../../store/actions/auth';
import { getPetProfilePicture } from '../../store/actions/pets';

class MyPlantsPage extends React.Component {
  constructor() {
    super();

    this.state = { profilePics: {} };
    this.getProfilePictures = this.getProfilePictures.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    const { store: { account: { uid } }, history } = this.props;

    if (!uid) {
      history.push('/login');
    }

    this.getProfilePictures();
  }

  componentDidUpdate() {
    const { store: { account: { uid } }, history } = this.props;

    if (!uid) {
      history.push('/login');
    }
  }

  getProfilePictures() {
    const { store: { pets } } = this.props;
    const { profilePics } = this.state;
    Object.keys(pets).forEach((id) => {
      profilePics[id] = ProfilePicture;
      this.setState({ profilePics });

      getPetProfilePicture(id).then((picture) => {
        if (picture) {
          profilePics[id] = picture;
          this.setState({ profilePics });
        }
      });
    });
  }

  handleLogout(e) {
    e.preventDefault();

    const { history } = this.props;
    logout()
      .then(() => {
        history.push('/login');
      });
    // .catch((error) => {
    //   console.error(`Error: ${error.message}`);
    // });
  }

  render() {
    const { store: { pets, account: { username } } } = this.props;
    const { profilePics } = this.state;
    const plantCards = Object.entries(pets).map(([id, pet]) => {
      if (!pet.dead) {
        return (
          <span className="plant-link" key={id}>
            <Link to={`/${username}/${id}`}>
              <Card className="plant-card">
                <Card.Img className="card-img" variant="top" src={profilePics[id]} />
                <Card.Body>
                  <Card.Title>{pet.name}</Card.Title>
                  <Card.Text>{pet.type}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </span>
        );
      }
      return null;
    });
    return (
      <div id="my-plants-page">
        <Navbar />
        <div className="container">
          {plantCards}
        </div>
      </div>
    );
  }
}
MyPlantsPage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
      username: PropTypes.string,
    }).isRequired,
    pets: PropTypes.object.isRequired,
  }).isRequired,
};
export default connect(map)(withRouter(MyPlantsPage));
