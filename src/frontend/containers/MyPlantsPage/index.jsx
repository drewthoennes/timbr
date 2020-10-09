import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar';
import map from '../../store/map';
import './styles.scss';
import { logout } from '../../store/actions/account';

class MyPlantsPage extends React.Component {
  constructor() {
    super();

    this.state = {};
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidUpdate() {
    const { store: { account: { uid } }, history } = this.props;

    if (!uid) {
      history.push('/login');
    }
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
    const { store: { pets, account: { username } }, history } = this.props;
    const plantCards = Object.entries(pets).map(([id, pet]) => (
      <span className="plant-link" key={id}>
        <Link to={`/${username}/${id}`}>
          <Card className="plant-card">
            <Card.Body>
              <Card.Title>{pet.name}</Card.Title>
              <Card.Text>{pet.type}</Card.Text>
            </Card.Body>
          </Card>
        </Link>
      </span>
    ));
    return (
      <div id="my-plants-page">
        <Navbar />
        <div className="container">
          {plantCards}
        </div>
        <div className="container">
          <button
            id="account"
            type="button"
            onClick={() => {
              history.push('/account');
            }}
          >
            My Account
          </button>

          <button
            id="account"
            type="button"
            onClick={() => {
              history.push(`/${username}`);
            }}
          >
            Go to Username
          </button>

          <button
            id="logout"
            type="button"
            onClick={this.handleLogout}
          >
            Logout
          </button>
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
