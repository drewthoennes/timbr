import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as Bar, Nav } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import map from '../../store/map';
import './styles.scss';
import { logout } from '../../store/actions/auth';

const Navbar = ({ store: { account: { username } } }) => (

  <div id="navbar">
    <Bar className="navbar navbar-expand-lg navbar-dark bg-primary">
      <Link className="navbar-brand" to="/">timbr</Link>
      <Nav>
        <span className="plant-link">
          <Link className="nav-link" to={`/${username}`}>My Plants</Link>
        </span>
        <span className="plant-link">
          <Link className="nav-link" to={`/${username}/new`}>New Plant</Link>
        </span>
        <span className="plant-link">
          <Link className="nav-link" to="/graveyard">My Graveyard</Link>
        </span>
      </Nav>
      <Nav className="ml-auto justify-content-end">
        <span className="plant-link">
          <Link className="nav-link" to="/my-stats">My Statistics</Link>
        </span>
        <span className="plant-link">
          <Link className="nav-link" to="/account">Account</Link>
        </span>
        <span className="plant-link">
          <Link className="nav-link" to="/login" onClick={logout}>Logout</Link>
        </span>
      </Nav>
    </Bar>
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
