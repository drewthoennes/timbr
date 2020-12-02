import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, ButtonGroup, Card, Form, FormControl, ToggleButton } from 'react-bootstrap';
import {
  Container, Row, Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';

import Plus from '../../assets/images/plus.png';
import ProfilePicture from '../../assets/images/pet_profile_picture.png';
import Navbar from '../../components/Navbar';
import map from '../../store/map';
import {
  editPet, getPotentialParents,
  getPetProfilePicture, setPetProfilePicture, removePetProfilePicture,
  getPetGrowthPictures, addPetGrowthPicture, removePetGrowthPicture,
} from '../../store/actions/pets';
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
      isOffshoot: (!!pet?.parent).toString(),
      typeDropdownOpen: false,
      parentDropdownOpen: false,
      profilePic: ProfilePicture,
      profilePictureFeedback: '',
      profilePictureValidationState: 'default',
      resetProfilePicInput: 0,
      growthPics: {},
      growthPictureFeedback: '',
      growthPictureValidationState: 'default',
      resetGrowthPicInput: 0,
      errors: {
        isBirthInvalid: false,
        birthErrorMessage: '',
        typeErrorMessage: '',
        parentErrorMessage: '',
      },
    };

    this.setIsOffshoot = this.setIsOffshoot.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.toggleTypeDropdown = this.toggleTypeDropdown.bind(this);
    this.handleChangeParent = this.handleChangeParent.bind(this);
    this.toggleParentDropdown = this.toggleParentDropdown.bind(this);
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
    this.setState({ profilePic: ProfilePicture });

    getPetProfilePicture(id).then((profilePic) => {
      this.setState({ profilePic });
    });
  }

  getGrowthPictures() {
    const { match: { params: { id } } } = this.props;

    getPetGrowthPictures(id).then((growthPics) => {
      this.setState({ growthPics });
    });
  }

  setProfilePicture(file) {
    const { resetProfilePicInput } = this.state;
    this.setState({ resetProfilePicInput: resetProfilePicInput + 1 });

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

    setPetProfilePicture(id, file)
      .then(() => {
        this.setState({
          profilePictureValidationState: 'success',
          profilePictureFeedback: 'Profile picture updated!',
        });
      })
      .catch(() => {
        this.setState({
          profilePictureValidationState: 'error',
          profilePictureFeedback: 'There was an error uploading your picture. Please try again.',
        });
      })
      .finally(() => this.getProfilePicture());
  }

  addGrowthPicture(file) {
    const { resetGrowthPicInput } = this.state;
    this.setState({ resetGrowthPicInput: resetGrowthPicInput + 1 });

    if (!file) {
      return;
    }
    const { match: { params: { id } } } = this.props;

    const fileSize = file.size / (1024 * 1024); // gets the file size in MB
    if (fileSize > 1) {
      this.setState({
        growthPictureValidationState: 'error',
        growthPictureFeedback: 'File too large! Please upload a file of size less than 1 MB.',
      });
      return;
    }

    addPetGrowthPicture(id, file, (error) => {
      if (error.message) {
        this.setState({
          growthPictureValidationState: 'error',
          growthPictureFeedback: error.message,
        });
        return;
      }
      this.setState({
        growthPictureValidationState: 'success',
        growthPictureFeedback: 'Growth picture added.',
      });
      this.getGrowthPictures();
    });
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
      store: { pets, plants, account: { username } },
    } = this.props;
    const { pet, isOffshoot, profilePic, growthPics, errors } = this.state;

    if (isOffshoot === 'true') {
      if (!pet.parent) {
        errors.parentErrorMessage = `If ${pet.name} is an offshoot, please select a parent plant.`;
        this.setState({ errors });
        return;
      } errors.parentErrorMessage = '';
      let isError = false;

      if (pet.type !== pets[pet.parent].type) {
        const parentType = plants[pets[pet.parent].type].name;
        errors.typeErrorMessage = `Plant must be same species as parent (${parentType})`;
        isError = true;
      } else {
        errors.typeErrorMessage = '';
      }

      if (new Date(pet.birth) < new Date(pets[pet.parent].birth)) {
        errors.isBirthInvalid = true;
        const birthDate = pets[pet.parent].birth.split('-');
        errors.birthErrorMessage = `Plant cannot be older than parent (${birthDate[1]}/${birthDate[2]}/${birthDate[0]})`;
        isError = true;
      } else {
        errors.isBirthInvalid = false;
        errors.birthErrorMessage = '';
      }
      this.setState({ errors });
      if (isError) return;
    } else pet.parent = null;

    pet.profilePic = profilePic !== ProfilePicture;
    pet.growthPics = Object.keys(growthPics);
    editPet(id, pet).then(() => {
      history.push(`/${username}/${id}`);
    });
  }

  toggleTypeDropdown() {
    this.setState((prevState) => ({
      typeDropdownOpen: !prevState.typeDropdownOpen,
    }));
  }

  handleChangeType(type) {
    const { pet } = this.state;
    this.setState({ pet: { ...pet, type } });
  }

  toggleParentDropdown() {
    this.setState((prevState) => ({
      parentDropdownOpen: !prevState.parentDropdownOpen,
    }));
  }

  setIsOffshoot(isOffshoot) {
    this.setState({ isOffshoot });
  }

  handleChangeParent(parent) {
    const { pet } = this.state;
    this.setState({ pet: { ...pet, parent } });
  }

  render() {
    const {
      pet, currPet, profilePic, growthPics,
      profilePictureFeedback, profilePictureValidationState, resetProfilePicInput,
      growthPictureFeedback, growthPictureValidationState, resetGrowthPicInput,
      typeDropdownOpen, parentDropdownOpen, isOffshoot, errors,
    } = this.state;
    const {
      store: { pets, plants },
      match: { params: { id: petId } },
    } = this.props;
    const today = (new Date()).toISOString().split('T')[0];
    const past = new Date((new Date().getFullYear() - 50)).toISOString().split('T')[0];

    const potentialParents = getPotentialParents(petId)
      .map((parent) => ({ id: parent, ...(pets[parent]) }))
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .map((parent) => (
        <DropdownItem
          key={parent.id}
          onClick={() => this.handleChangeParent(parent.id)}
        >
          {parent.name}
        </DropdownItem>
      ));

    const growthPicCards = Object.entries(growthPics || [])
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
          <h1 className="text-center mt-4 mb-3">Edit {currPet.name}</h1>
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
                    <Form.Label>Plant's Name</Form.Label>
                    <Form.Control
                      required
                      name="name"
                      value={pet.name}
                      onChange={this.handleChange}
                      maxLength="40"
                      placeholder="Name"
                    />
                  </Form.Group>
                  <Form.Group controlId="location">
                    <Form.Label>Plant's Location</Form.Label>
                    <Form.Control

                      name="location"
                      value={pet.location}
                      onChange={this.handleChange}
                      maxLength="40"
                      placeholder="eg:living room"
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
                      isInvalid={errors.isBirthInvalid}
                    />
                    <Form.Control.Feedback type="invalid">{errors.birthErrorMessage}</Form.Control.Feedback>
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
                  <Form.Group controlId="type">
                    <Form.Label>Plant's Type:</Form.Label>
                    <Dropdown name="type" isOpen={typeDropdownOpen} toggle={this.toggleTypeDropdown}>
                      <DropdownToggle caret id="size-dropdown">
                        {plants[pet.type]?.name}
                      </DropdownToggle>
                      <DropdownMenu required>
                        {Object.entries(plants)
                          // eslint-disable-next-line
                          .sort(([_, p1], [__, p2]) => p1.name < p2.name ? -1 : 1)
                          .map(([key, plant]) => (
                            <DropdownItem
                              key={key}
                              onClick={() => this.handleChangeType(key)}
                            >
                              {plant.name}
                            </DropdownItem>
                          ))}
                      </DropdownMenu>
                    </Dropdown>
                    <p className="error-message">{errors.typeErrorMessage}</p>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Is this plant an offshoot of another plant?</Form.Label>
                    <br />
                    <ButtonGroup toggle>
                      <ToggleButton
                        type="radio"
                        name="is-not-offshoot"
                        value={false}
                        checked={isOffshoot === 'false'}
                        onChange={(e) => this.setIsOffshoot(e.currentTarget.value)}
                      >No
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        name="is-offshoot"
                        value
                        checked={isOffshoot === 'true'}
                        onChange={(e) => this.setIsOffshoot(e.currentTarget.value)}
                      >Yes
                      </ToggleButton>
                    </ButtonGroup>
                  </Form.Group>

                  { (isOffshoot === 'true') && (
                    <Form.Group controlId="parent">
                      <Form.Label>Parent Plant:</Form.Label>
                      { potentialParents.length > 0 ? (
                        <Dropdown name="type" isOpen={parentDropdownOpen} toggle={this.toggleParentDropdown}>
                          <DropdownToggle caret id="size-dropdown">
                            {pets[pet.parent]?.name}
                          </DropdownToggle>
                          <DropdownMenu required>
                            {potentialParents}
                          </DropdownMenu>
                        </Dropdown>
                      ) : (
                        <Dropdown name="type" isOpen={parentDropdownOpen} toggle={this.toggleParentDropdown} disabled>
                          <DropdownToggle caret id="size-dropdown">
                            No Valid Parents
                          </DropdownToggle>
                        </Dropdown>
                      )}
                      <p className="error-message">{errors.parentErrorMessage}</p>
                    </Form.Group>
                  )}
                </Col>
              </Row>
              <Row className="align-items-center mt-2">
                <Col className="text-center">
                  <Form.Group>
                    <Form.Label>Growth Pictures</Form.Label>
                    <br />
                    {growthPicCards}
                    { Object.keys(growthPics).length < 5 && (
                      <Card className="growth-pic-card">
                        <input
                          key={`growth-${resetGrowthPicInput}`}
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
                </Col>
              </Row>
              <Row className="align-items-center mt-2">
                <Col className="text-center">
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                  <br />
                </Col>
              </Row>
            </Container>
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
    plants: PropTypes.object.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
export default connect(map)(withRouter(EditPlantProfilePage));
