import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import map from '../../store/map';
import './styles.scss';
import accountActions from '../../store/actions/account';

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
    accountActions.logout()
      .then(() => {
        history.push('/login');
      });
    // .catch((error) => {
    //   console.error(`Error: ${error.message}`);
    // });
  }

  render() {
    const { store: { pets }, history } = this.props;
    const plantCards = Object.entries(pets).map(([id, pet]) => (
      <a key={id} className="plant-link" href={`/myplants/${id}`}>
        <Card className="plant-card">
          <Card.Body>
            <Card.Title>{pet.name}</Card.Title>
            <Card.Text>{pet.type}</Card.Text>
          </Card.Body>
        </Card>
      </a>
    ));
    return (
      <div id="my-plants-page">
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
    }),
    pets: PropTypes.object.isRequired,
  }).isRequired,
};
export default connect(map)(withRouter(MyPlantsPage));
