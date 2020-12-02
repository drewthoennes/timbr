import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Row,
  Col,
} from 'reactstrap';
import { Button, Form, FormControl, Modal } from 'react-bootstrap';
import ProfilePicture from '../../assets/images/pet_profile_picture.png';
import Navbar from '../../components/Navbar';
import map from '../../store/map';
import { createNewPet, getPetProfilePicture, setPetProfilePicture, removePetProfilePicture } from '../../store/actions/pets';
import { sendVerificationEmail, isEmailVerified } from '../../store/actions/account';
import './styles.scss';

class NewPlantProfilePage extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      birth: '',
      ownedSince: '',
      location: '',
      type: 'alocasia-amazonica',
      dropdownOpen: false,
      profilePic: ProfilePicture,
      profilePicSub: null,
      profilePictureFeedback: '',
      profilePictureValidationState: 'default',
      resetProfilePicInput: 0,
      verifyEmailFeedback: '',
    };

    this.getProfilePicture = this.getProfilePicture.bind(this);
    this.setProfilePicture = this.setProfilePicture.bind(this);
    this.removeProfilePicture = this.removeProfilePicture.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.sendVerificationEmail = this.sendVerificationEmail.bind(this);

    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentDidUpdate() {
    const { store: { account: { uid } }, history } = this.props;
    if (!uid) {
      history.push('/login');
    }
  }

  componentWillUnmount() {
    this.removeProfilePicture();
    this.mounted = false;
  }

  getProfilePicture() {
    const { store: { account: { uid } } } = this.props;
    this.setState({ profilePic: ProfilePicture });

    getPetProfilePicture(`temp-${uid}`).then((profilePic) => {
      this.setState({ profilePic });
    });
  }

  setProfilePicture(file) {
    const { store: { account: { uid } } } = this.props;
    const { resetProfilePicInput } = this.state;
    this.setState({ resetProfilePicInput: resetProfilePicInput + 1 });

    if (!file) {
      return;
    }

    const fileSize = file.size / (1024 * 1024); // gets the file size in MB
    if (fileSize > 1) {
      this.setState({
        profilePic: ProfilePicture,
        profilePictureValidationState: 'error',
        profilePictureFeedback: 'File too large! Please upload a file of size less than 1 MB.',
      });
      return;
    }

    setPetProfilePicture(`temp-${uid}`, file)
      .then(() => {
        this.setState({
          profilePicSub: file,
          profilePictureValidationState: 'success',
          profilePictureFeedback: 'Profile picture updated!',
        });
      })
      .catch(() => {
        this.setState({
          profilePicSub: file,
          profilePictureValidationState: 'error',
          profilePictureFeedback: 'There was an error uploading your picture. Please try again.',
        });
      })
      .finally(() => this.getProfilePicture());
  }

  removeProfilePicture() {
    const { store: { account: { uid } } } = this.props;

    removePetProfilePicture(`temp-${uid}`)
      .then(() => {
        this.setState({
          profilePic: ProfilePicture,
          profilePicSub: null,
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

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    const { store: { account: { uid, username } } } = this.props;
    const { name, birth, ownedSince, type, profilePic, profilePicSub, location } = this.state;

    createNewPet({
      name,
      birth: birth.length ? birth : (new Date()).toISOString().split('T')[0],
      ownedSince: ownedSince.length ? ownedSince : (new Date()).toISOString().split('T')[0],
      type,
      location,
      profilePic: profilePicSub,
    }).then((snap) => {
      const { history } = this.props;

      if (profilePic !== ProfilePicture) {
        this.removeProfilePicture(`temp-${uid}`);
        setPetProfilePicture(snap.key, profilePicSub).then(() => {
          history.push(`/${username}/${snap.key}`);
        });
        return;
      }

      history.push(`/${username}/${snap.key}`);
    });
  }

  handleDropdown(type) {
    this.setState({ type });
  }

  toggleDropdown() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  sendVerificationEmail() {
    sendVerificationEmail()
      .then(() => {
        if (this.mounted) {
          this.setState({
            verifyEmailFeedback: 'Verification Email sent!',
          });
        }
      })
      .catch((error) => {
        if (this.mounted) {
          this.setState({
            verifyEmailFeedback: error.message,
          });
        }
      });
  }

  render() {
    const { store: { plants } } = this.props;
    const { name, birth, ownedSince, location,
      profilePic, profilePictureFeedback,
      profilePictureValidationState, resetProfilePicInput, verifyEmailFeedback } = this.state;
    const today = (new Date()).toISOString().split('T')[0];
    const past = new Date((new Date().getFullYear() - 50)).toISOString().split('T')[0];

    return (
      <div id="new-plant-page">
        <Navbar />
        <h1 className="text-center mt-4 mb-3">Create New Plant</h1>
        <Modal id="verify-email" show={!isEmailVerified()} backdrop="static" onHide={() => { }}>
          <Modal.Header>
            <Modal.Title>Your account is not verified.</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>You must verify your account before adding plants.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { this.sendVerificationEmail(); }}
            >
              Resend Verification Email
            </button>
            <p id="feedback">{verifyEmailFeedback}</p>
          </Modal.Body>
        </Modal>
        <Form onSubmit={this.handleSubmit}>
          <Container className="mt-3">
            <Row className="align-items-center mt-2">
              <Col sm={3} className="d-flex justify-content-around">
                <Form.Group
                  controlId="profilePic"
                  validationstate={profilePictureValidationState}
                >
                  <Form.Label>{profilePic === ProfilePicture ? 'Add' : 'Set'} Profile Picture:</Form.Label>
                  <br />
                  <img style={{ width: '150px' }} id="profile-picture" src={profilePic} alt="Profile" />
                  <Form.Control
                    key={`profile-${resetProfilePicInput}`}
                    name="profilePic"
                    type="file"
                    accept="image/jpg,image/jpeg,image/png"
                    onChange={(event) => { this.setProfilePicture(event.target.files[0]); }}
                  />
                  {profilePic !== ProfilePicture && (
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
              </Col>
              <Col sm={9}>
                <Form.Group controlId="name">
                  <Form.Label>Plant's Name*</Form.Label>
                  <Form.Control
                    required
                    name="name"
                    value={name}
                    onChange={this.handleChange}
                    maxLength="20"
                    placeholder="Name"
                  />
                </Form.Group>
                <Form.Group controlId="location">
                  <Form.Label>Plant's Location</Form.Label>
                  <Form.Control

                    name="location"
                    value={location}
                    onChange={this.handleChange}
                    maxLength="20"
                    placeholder="eg:living room"
                  />
                </Form.Group>

                <Form.Group controlId="birth">
                  <Form.Label>Plant's Birthday</Form.Label>
                  <Form.Control
                    name="birth"
                    type="date"
                    min={past}
                    max={today}
                    value={birth}
                    onChange={this.handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="ownedSince">
                  <Form.Label>Owned Since</Form.Label>
                  <Form.Control
                    name="ownedSince"
                    type="date"
                    min={birth.length ? birth : past}
                    max={today}
                    value={ownedSince}
                    onChange={this.handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="type">
                  <Form.Label>Plant's Type</Form.Label>
                  { /* eslint-disable-next-line react/destructuring-assignment */}
                  <Dropdown color="primary" name="type" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                    <DropdownToggle color="primary" caret id="size-dropdown">
                      { /* eslint-disable-next-line react/destructuring-assignment */}
                      {plants[this.state.type]?.name}
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu" color="primary" required>
                      {Object.entries(plants)
                        // eslint-disable-next-line
                        .sort(([_, p1], [__, p2]) => p1.name < p2.name ? -1 : 1)
                        .map(([key, plant]) => (
                          <DropdownItem
                            color="primary"
                            key={key}
                            onClick={() => this.handleDropdown(key)}
                          >
                            {plant.name}
                          </DropdownItem>
                        ))}
                    </DropdownMenu>
                  </Dropdown>
                </Form.Group>
              </Col>
            </Row>
            <Row className="align-items-center mt-2">
              <Col className="d-flex justify-content-around">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </div>
    );
  }
}
NewPlantProfilePage.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      uid: PropTypes.string,
      username: PropTypes.string,
    }),
    pets: PropTypes.object.isRequired,
    plants: PropTypes.object.isRequired,
  }).isRequired,
};
export default connect(map)(withRouter(NewPlantProfilePage));
