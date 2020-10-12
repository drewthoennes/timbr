import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as Bar, Nav } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import map from '../../store/map';
import './styles.scss';

const Navbar = (props) => (
  <div id="navbar">
    <Bar bg="dark" variant="dark">
      <Bar.Brand href="/">timbr</Bar.Brand>
      <Nav className="mr-auto">
        <span className="plant-link">
          { /* eslint-disable-next-line react/destructuring-assignment */}
          <Link to={`/${props.store.account.username}`}>
            My Plants
          </Link>
        </span>
        <span className="plant-link">
          { /* eslint-disable-next-line react/destructuring-assignment */}
          <Link to={`/${props.store.account.username}/new`}>New Plant</Link>
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
