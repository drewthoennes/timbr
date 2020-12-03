import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import './styles.scss';
import { getUsername, changeUsername } from '../../store/actions/account';

class Username extends React.PureComponent {
  constructor() {
    super();

    this.changeUsername = this.changeUsername.bind(this);
    this.getCurrentUsername = this.getCurrentUsername.bind(this);

    this.state = {
      username: 'timbr-user',
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.getCurrentUsername();
  }

  componentDidUpdate(prevProps) {
    const { uid } = this.props;

    /* Changes username when uid changes. */
    if (uid !== prevProps.uid) {
      this.getCurrentUsername();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /* Calls the function to get current username and sets the state. */
  getCurrentUsername() {
    const { uid } = this.props;
    getUsername(
      (user) => {
        if (this.mounted) {
          this.setState({ username: user.val() });
        }
      },
      uid,
    );
  }

  changeUsername() {
    const { username } = this.state;
    const newUsername = document.getElementById('username').value;
    if (username === newUsername) {
      // no op if the current username and new username are the same
      document.getElementById('username').value = '';
      return;
    }
    changeUsername(newUsername);
    /* Changes the username in the state. */
    this.getCurrentUsername();
    document.getElementById('username').value = '';
  }

  render() {
    const { username } = this.state;
    return (
      <Row className="align-items-center mt-3">
        <Col sm={3}><h5 className="text-right">Username</h5></Col>
        <Col sm={1} />
        <Col sm={5}>
          <input
            id="username"
            type="text"
            className="form-control"
            placeholder={username}
          />
        </Col>
        <Col sm={3}>
          <button
            id="change-username"
            type="button"
            className="btn btn-outline-primary"
            onClick={this.changeUsername}
          >
            Change Username
          </button>
        </Col>
      </Row>
    );
  }
}

Username.propTypes = {
  uid: PropTypes.string.isRequired,
};

export default Username;
