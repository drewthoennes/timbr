import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { deletePet } from '../../store/actions/pets';

class ManagePlant extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      show: false,
    };

    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  toggleDeleteModal() {
    this.setState((prevState) => ({
      show: !prevState.show,
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

  render() {
    const { pet } = this.props;
    const { show } = this.state;

    return (
      <div>
        <h2>Manage Plant</h2>
        <Button type="button" onClick={this.edit}>Edit</Button>
        <Button type="button" onClick={this.toggleDeleteModal}>Delete</Button>

        <Modal show={show} onHide={this.toggleDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete {pet?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete {pet?.name}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.toggleDeleteModal}>No</Button>
            <Button variant="primary" onClick={this.delete}>Yes</Button>
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
