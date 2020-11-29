import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { deletePet, deadPet } from '../../store/actions/pets';

const getToday = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 10);
};

class ManagePlant extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      showDelete: false,
      showDead: false,
      epitaph: '',
    };

    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleDeadModal = this.toggleDeadModal.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.dead = this.dead.bind(this);
  }

  toggleDeleteModal() {
    this.setState((prevState) => ({
      showDelete: !prevState.showDelete,
    }));
  }

  toggleDeadModal() {
    this.setState((prevState) => ({
      showDead: !prevState.showDead,
    }));
  }

  edit() {
    const { history, id, username } = this.props;
    history.push(`/${username}/edit/${id}`);
  }

  delete() {
    this.toggleDeleteModal();

    const { history, id, username } = this.props;
    history.push(`/${username}/edit/${id}`);

    deletePet(id).then(() => {
      history.push(`/${username}`);
    });
  }

  dead() {
    this.toggleDeadModal();

    const { history, id } = this.props;
    const { epitaph } = this.state;

    deadPet(id, epitaph, getToday()).then(() => {
      history.push('/graveyard');
    });
  }

  render() {
    const { pet } = this.props;
    const { showDelete, showDead } = this.state;

    return (
      <div>
        <Button type="button" onClick={this.edit}>Edit</Button>
        <Button type="button" onClick={this.toggleDeadModal}>Mark as Dead</Button>
        <Button type="button" onClick={this.toggleDeleteModal}>Delete</Button>

        <Modal show={showDelete} onHide={this.toggleDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete {pet?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete {pet?.name}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.toggleDeleteModal}>No</Button>
            <Button variant="primary" onClick={this.delete}>Yes</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDead} onHide={this.toggleDeadModal}>
          <Modal.Header closeButton>
            <Modal.Title>We're sorry for your loss.</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              placeholder="Add an epitaph to remember your plant, if you'd like."
              onChange={(event) => { this.setState({ epitaph: event.target.value }); }}
              className="form-control w-100"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.toggleDeadModal}>Wait, not dead yet!</Button>
            <Button variant="primary" onClick={this.dead}>Confirm</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

ManagePlant.propTypes = {
  history: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  pet: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
};

export default withRouter(ManagePlant);
