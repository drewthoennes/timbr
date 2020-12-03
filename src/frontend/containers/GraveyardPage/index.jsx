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

    const dateString = (d) => {
      if (!d) return '';
      const arr = d.split('-');
      return `${arr[1]}/${arr[2]}/${arr[0]}`;
    };

    const plantCards = Object.entries(pets).map(([id, pet]) => {
      const defaultEpitaph = `${pet.name} was loved and he will be very missed.`;

      if (pet.dead) {
        return (
          <span className="plant-link mt-4" key={id}>
            <Link to={`/${username}/${id}`}>
              <Card className="plant-card h-100">
                <Card.Img className="card-img" variant="top" src={profilePics[id]} />
                <Card.Body>
                  <Card.Title className="dead-body-color"><b>{pet.name}</b></Card.Title>
                  <Card.Text>
                    <span className="plant-dates dead-body-color">
                      { (pet.birth && pet.death) ? (
                        <b>{dateString(pet.birth)} - {dateString(pet.death)}</b>
                      ) : (<b>Died {dateString(pet.death)}</b>)}
                    </span>
                    <br />
                    <span className="epitaph dead-body-color">
                      <i>{ pet.epitaph ? pet.epitaph : defaultEpitaph }</i>
                    </span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </span>
        );
      }
      return null;
    });

    return (

      <div id="my-graveyard-page">
        <Navbar />
        <br />
        <div className="container text-center">
          <div className="row justify-content-center">
            {plantCards}
          </div>
        </div>
        <br />
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
