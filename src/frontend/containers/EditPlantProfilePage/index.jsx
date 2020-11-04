import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Card, Form, FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ProfilePicture from '../../assets/images/pet_profile_picture.png';
import Plus from '../../assets/images/plus.png';
import Navbar from '../../components/Navbar';
import map from '../../store/map';
import { editPet, getPetProfilePicture, getPetGrowthPictures,
  addPetGrowthPicture, setPetProfilePicture,
  removePetProfilePicture, removePetGrowthPicture } from '../../store/actions/pets';
import './styles.scss';

class EditPlantProfilePage extends React.Component {
  constructor(props) {
    super(props);

    const {
      store: { pets },
      match: { params: { id: petId } },
    } = this.props;
    const pet = pets[petId];

    this.state = {
      currPet: { ...pet },
      pet: { ...pet },
      profilePic: ProfilePicture,
      growthPics: {},
      profilePictureFeedback: '',
      profilePictureValidationState: 'default',
      growthPictureFeedback: '',
      growthPictureValidationState: 'default',
    };

    this.getProfilePicture = this.getProfilePicture.bind(this);
    this.getGrowthPictures = this.getGrowthPictures.bind(this);
    this.setProfilePicture = this.setProfilePicture.bind(this);
    this.addGrowthPicture = this.addGrowthPicture.bind(this);
    this.removeProfilePicture = this.removeProfilePicture.bind(this);
    this.removeGrowthPicture = this.removeGrowthPicture.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getProfilePicture();
    this.getGrowthPictures();
  }

  componentDidUpdate() {
    const { store: { account: { uid } }, history } = this.props;
    if (!uid) {
      history.push('/login');
    }
  }

  getProfilePicture() {
    const { match: { params: { id } } } = this.props;
    getPetProfilePicture(id, (pictureRef) => {
      pictureRef.getDownloadURL()
        .then((picture) => {
          this.setState({ profilePic: picture });
        })
        .catch(() => {
          this.setState({ profilePic: ProfilePicture });
        });
    });
  }

  getGrowthPictures() {
    const { match: { params: { id } } } = this.props;
    const growthPics = {};
    this.setState({ growthPics });

    getPetGrowthPictures(id, (pictureRef, index) => {
      pictureRef.getDownloadURL()
        .then((picture) => {
          growthPics[index] = picture;
          this.setState({ growthPics });
        })
        .catch(() => {});
    });
  }

  setProfilePicture(file) {
    if (!file) {
      return;
    }
    const { match: { params: { id } } } = this.props;

    const fileSize = file.size / (1024 * 1024); // gets the file size in MB
    if (fileSize > 1) {
      this.setState({
        profilePictureValidationState: 'error',
        profilePictureFeedback: 'File too large! Please upload a file of size less than 1 MB.',
      });
      return;
    }
    if (file) {
      setPetProfilePicture(id, file)
        .then(() => {
          this.setState({
            profilePic: file,
            profilePictureValidationState: 'success',
            profilePictureFeedback: 'Profile picture updated!',
          });
        })
        .catch(() => {
          this.setState({
            profilePictureValidationState: 'error',
            profilePictureFeedback: 'There was an error uploading your picture. Please try again.',
          });
        });
    }
  }

  addGrowthPicture(file) {
    if (!file) {
      return;
    }
    const { growthPictureValidationState } = this.state;
    const { match: { params: { id } } } = this.props;

    const fileSize = file.size / (1024 * 1024); // gets the file size in MB
    if (fileSize > 1) {
      this.setState({
        growthPictureValidationState: 'error',
        growthPictureFeedback: 'File too large! Please upload a file of size less than 1 MB.',
      });
      return;
    }
    if (file && growthPictureValidationState !== 'error') {
      addPetGrowthPicture(id, file, (error) => {
        if (error.message) {
          this.setState({
            growthPictureValidationState: 'error',
            growthPictureFeedback: error.message,
          });
          return;
        }
        this.getGrowthPictures();
      });
    }
  }

  removeProfilePicture() {
    const { match: { params: { id } } } = this.props;

    removePetProfilePicture(id)
      .then(() => {
        this.setState({
          profilePic: ProfilePicture,
          profilePictureValidationState: 'success',
          profilePictureFeedback: 'Profile picture removed.',
        });
      })
      .catch(() => {
        this.setState({
          profilePictureValidationState: 'error',
          profilePictureFeedback: 'There was an error removing your picture. Please try again.',
        });
      });
  }

  removeGrowthPicture(index) {
    const { match: { params: { id } } } = this.props;

    removePetGrowthPicture(id, index, (error) => {
      if (error.message) {
        this.setState({
          growthPictureValidationState: 'error',
          growthPictureFeedback: error.message,
        });
        return;
      }
      this.setState({
        growthPictureValidationState: 'success',
        growthPictureFeedback: 'Growth picture removed.',
      });
      this.getGrowthPictures();
    });
  }

  handleChange(e) {
    const { pet } = this.state;
    this.setState({ pet: { ...pet, [e.target.name]: e.target.value } });
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    const {
      match: { params: { id } },
      history,
      store: { account: { username } },
    } = this.props;
    const { pet } = this.state;
    editPet(id, pet).then(() => {
      history.push(`/${username}/${id}`);
    });
  }

  render() {
    const { pet, currPet, profilePic, growthPics,
      profilePictureFeedback, profilePictureValidationState,
      growthPictureFeedback, growthPictureValidationState } = this.state;
    const today = (new Date()).toISOString().split('T')[0];
    const past = new Date((new Date().getFullYear() - 50)).toISOString().split('T')[0];

    const growthPicCards = Object.entries(growthPics)
      .sort(([i], [j]) => {
        if (new Date(i) < new Date(j)) return -1;
        return 1;
      })
      .map(([index, picture]) => (
        <Card className="growth-pic-card" key={index}>
          <Card.Img className="card-img" variant="top" src={picture} />
          <Card.Body>
            <Card.Title>{(new Date(index)).toISOString().split('T')[0]}</Card.Title>
            <Card.Text style={{ textAlign: 'center' }}>
              <Button
                className="btn btn-danger"
                style={{ marginTop: '10px', marginBottom: '10px' }}
                onClick={() => { this.removeGrowthPicture(index); }}
              >
                Remove
              </Button>
            </Card.Text>
          </Card.Body>
        </Card>
      ));
    return (
      <>
        <Navbar />
        <div id="edit-plant-page" className="container">
          <h1>Edit {currPet.name}</h1>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group
              controlId="profilePic"
              validationstate={profilePictureValidationState}
            >
              <Form.Label>{profilePic === ProfilePicture ? 'Add' : 'Set'} Profile Picture:</Form.Label>
              <br />
              <img style={{ width: '150px' }} id="profile-picture" src={profilePic} alt="Profile" />
              <Form.Control
                name="profilePic"
                type="file"
                accept="image/jpg,image/jpeg,image/png"
                onChange={(event) => { this.setProfilePicture(event.target.files[0]); }}
              />
              { profilePic !== ProfilePicture && (
                <>
                  <Button
                    className="btn btn-danger"
                    style={{ marginTop: '10px', marginBottom: '10px' }}
                    onClick={() => { this.removeProfilePicture(); }}
                  >
                    Remove Picture
                  </Button>
                  <br />
                </>
              )}
              <FormControl.Feedback />
              <Form.Label className={`text-${profilePictureValidationState === 'error' ? 'danger' : profilePictureValidationState}`}>
                {profilePictureFeedback}
              </Form.Label>
            </Form.Group>

            <Form.Group controlId="name">
              <Form.Label>Plant's Name:</Form.Label>
              <Form.Control
                required
                name="name"
                value={pet.name}
                onChange={this.handleChange}
                maxLength="40"
                placeholder="Name"
              />
            </Form.Group>

            <Form.Group controlId="birth">
              <Form.Label>Plant's birthday:</Form.Label>
              <Form.Control
                name="birth"
                type="date"
                min={past}
                max={today}
                value={pet.birth}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="ownedSince">
              <Form.Label>I've owned this plant since:</Form.Label>
              <Form.Control
                name="ownedSince"
                type="date"
                min={pet.birth?.length ? pet.birth : past}
                max={today}
                value={pet.ownedSince}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Growth Pictures</Form.Label>
              <br />
              {growthPicCards}
              { Object.keys(growthPics).length < 5 && (
                <Card className="growth-pic-card">
                  <input
                    type="file"
                    className="file-select"
                    onChange={(event) => { this.addGrowthPicture(event.target.files[0]); }}
                  />
                  <Card.Img className="card-img" variant="top" src={Plus} />
                  <Card.Body>
                    <Card.Title>Add Growth Picture</Card.Title>
                  </Card.Body>
                </Card>
              )}

              <br />
              <FormControl.Feedback />
              <Form.Label className={`text-${growthPictureValidationState === 'error' ? 'danger' : growthPictureValidationState}`}>
                {growthPictureFeedback}
              </Form.Label>
            </Form.Group>

            <br />
            <Button variant="primary" type="submit" style={{ marginTop: '1rem' }}>
              Submit
            </Button>
          </Form>
        </div>
      </>
    );
  }
}
EditPlantProfilePage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
      username: PropTypes.string,
    }),
    pets: PropTypes.object.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
export default connect(map)(withRouter(EditPlantProfilePage));
