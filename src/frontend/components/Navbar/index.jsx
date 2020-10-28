import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as Bar, Nav } from 'react-bootstrap';
import 'bootswatch/dist/Minty/bootstrap.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import map from '../../store/map';
import './styles.scss';
import { logout } from '../../store/actions/account';

const Navbar = (props) => (
    
    <div id="navbar">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <Bar>
        <a class="navbar-brand" href="/">timbr</a>
        <Nav className="mr-auto">
          <ul class="navbar-nav mr-auto">
          <span className="plant-link">
            { /* eslint-disable-next-line react/destructuring-assignment */}
            <li class="nav-item">
              <a class="nav-link" href={`/${props.store.account.username}`}>My Plants</a>
            </li>
          </span>
          <span className="plant-link">
            { /* eslint-disable-next-line react/destructuring-assignment */}
            <li class="nav-item">
              <a class="nav-link" href={`/${props.store.account.username}/new`}>New Plant</a>
            </li>
          </span>
          <span className="plant-link">
            <li class="nav-item">
              <a class="nav-link" href="/account">Account</a>
            </li>
          </span>
          </ul>
          <span className="plant-link">
            <li class="nav-item">
              <a class="nav-link" href="/login" onClick={logout}>Logout</a>
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
