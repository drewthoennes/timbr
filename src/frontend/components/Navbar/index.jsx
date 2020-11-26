import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as Bar, Nav } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import map from '../../store/map';
import './styles.scss';
import { logout } from '../../store/actions/auth';

const Navbar = (props) => (

  <div id="navbar">
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <Bar>
        <Link className="navbar-brand" to="/">timbr</Link>
        <Nav className="mr-auto">
          <ul className="navbar-nav mr-auto">
            <span className="plant-link">
              <li className="nav-item">
                { /* eslint-disable-next-line react/destructuring-assignment */}
                <Link className="nav-link" to={`/${props.store.account.username}`}>My Plants</Link>
              </li>
            </span>
            <span className="plant-link">
              <li className="nav-item">
                { /* eslint-disable-next-line react/destructuring-assignment */}
                <Link className="nav-link" to="/graveyard">My Graveyard</Link>
              </li>
            </span>
            <span className="plant-link">
              <li className="nav-item">
                { /* eslint-disable-next-line react/destructuring-assignment */}
                <Link className="nav-link" to={`/${props.store.account.username}/new`}>New Plant</Link>
              </li>
            </span>
            <span className="plant-link">
              <li className="nav-item">
                <Link className="nav-link" to="/account">Account</Link>
              </li>
            </span>
          </ul>
          <span className="plant-link">
            <li className="nav-item">
              <Link className="nav-link" to="/login" onClick={logout}>Logout</Link>
            </li>
          </span>
        </Nav>
      </Bar>
    </nav>
  </div>
);

Navbar.propTypes = {
  store: PropTypes.shape({
    account: PropTypes.shape({
      username: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default connect(map)(Navbar);
