import React from 'react';
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
        <a className="navbar-brand" href="/">timbr</a>
        <Nav className="mr-auto">
          <ul className="navbar-nav mr-auto">
            <span className="plant-link">
              <li className="nav-item">
                { /* eslint-disable-next-line react/destructuring-assignment */}
                <a className="nav-link" href={`/${props.store.account.username}`}>My Plants</a>
              </li>
            </span>
            <span className="plant-link">
              <li className="nav-item">
                { /* eslint-disable-next-line react/destructuring-assignment */}
                <a className="nav-link" href={`/${props.store.account.username}/new`}>New Plant</a>
              </li>
            </span>
            <span className="plant-link">
              <li className="nav-item">
                <a className="nav-link" href="/account">Account</a>
              </li>
            </span>
          </ul>
          <span className="plant-link">
            <li className="nav-item">
              <a className="nav-link" href="/login" onClick={logout}>Logout</a>
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
