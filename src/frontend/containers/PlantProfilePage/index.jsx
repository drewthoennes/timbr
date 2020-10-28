/* eslint-disable no-console */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import Navbar from '../../components/Navbar';

import { setForeignUserPets, addDate, deletePet } from '../../store/actions/pets';

import map from '../../store/map';
import './styles.scss';

class PlantProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.onWater = this.onWater.bind(this);
    this.onFertilize = this.onFertilize.bind(this);
    this.onRotate = this.onRotate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.state = {
      showDeleteModal: false,
    };
  }

  componentDidMount() {
    const { match: { params: { username, id } } } = this.props;
    const { history, store: { account: { username: ownUsername } } } = this.props;

    console.log('Component did mount');

    if (!username) return Promise.resolve();

    return setForeignUserPets(username, id).catch(() => history.push(`/${ownUsername}`));
  }

  onWater() {
    const { match: { params: { id } } } = this.props;
    const today = new Date().toISOString().slice(0, 10);
    addDate(id, 'watered', today);
  }

  onFertilize() {
    const { match: { params: { id } } } = this.props;
    const today = new Date().toISOString().slice(0, 10);
    addDate(id, 'fertilized', today);
  }

  onRotate() {
    const { match: { params: { id } } } = this.props;

    const today = new Date().toISOString().slice(0, 10);
    addDate(id, 'turned', today);
  }

  onDelete() {
    this.showDeleteModal(false);

    const {
      history,
      match: { params: { id } },
      store: { account: { username: ownUsername } },
    } = this.props;

    deletePet(id).then(() => {
      history.push(`/${ownUsername}`);
    });
  }

  showDeleteModal(cond) {
    this.setState({ showDeleteModal: cond });
  }

  render() {
    const { store: { users, pets, account: { username: ownUsername } } } = this.props;
    const { history, match: { params: { username, id } } } = this.props;

    let pet;
    if (username && username !== ownUsername) {
      pet = users[username] ? users[username].pets[id] : { name: '' };
    } else if (!pets[id]) {
      history.push('/notfound');
    } else {
      pet = pets[id];
    }
    const { showDeleteModal: show } = this.state;
    return (
      <div>
        <Navbar />
        <div className="container">
          <h1>{pet?.name}</h1>
          <button type="button" onClick={this.onWater}> Water </button>
          <button type="button" onClick={this.onFertilize}> Fertilize </button>
          <button type="button" onClick={this.onRotate}> Rotate </button>
          <div className="container">
            <button type="button" onClick={() => this.showDeleteModal(true)}> Delete </button>
          </div>
        </div>

        <Modal show={show} onHide={() => this.showDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete {pet?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete {pet?.name}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.showDeleteModal(false)}>
              No
            </Button>
            <Button variant="primary" onClick={this.onDelete}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
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
