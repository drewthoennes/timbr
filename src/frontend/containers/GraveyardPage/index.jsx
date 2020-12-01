import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar';
import map from '../../store/map';
import ProfilePicture from '../../assets/images/pet_profile_picture.png';
import { getPetProfilePicture } from '../../store/actions/pets';
import './styles.scss';

class GraveyardPage extends React.Component {
  constructor() {
    super();

    this.state = { profilePics: {} };
    this.getProfilePictures = this.getProfilePictures.bind(this);
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
    // TODO: Refactor this
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

  render() {
    const { store: { pets, account: { username } } } = this.props;
    const { profilePics } = this.state;
    const plantCards = Object.entries(pets).map(([id, pet]) => {
      if (pet.dead) {
        const noEpitaph = () => {
          if (pet.epitaph==='') {
            return(
              <Card.Text>{pet.name} was very loved and will be missed.</Card.Text>
            );
          }
          return(
            <Card.Text>{pet.epitaph}</Card.Text>
          )
        };
        return (
          <span className="plant-link" key={id}>
            <Link to={`/${username}/${id}`}>
              <Card className="plant-card">
                <Card.Img className="card-img" variant="top" src={profilePics[id]} />
                <Card.Body>
                  <Card.Title>{pet.name}</Card.Title>
                  <Card.Text>{pet.birth} to {pet.death}</Card.Text>
                  {noEpitaph()}
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
        <h2>My Graveyard</h2>
        <div className="container">
          {plantCards}
        </div>
      </div>
    );
  }
}
GraveyardPage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
      username: PropTypes.string,
    }).isRequired,
    pets: PropTypes.object.isRequired,
  }).isRequired,
};
export default connect(map)(withRouter(GraveyardPage));
