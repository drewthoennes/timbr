import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import map from '../../store/map';
import LoadingWrapper from '../../containers/LoadingWrapper';
import Router from '../../router';
import 'bootswatch/dist/Minty/bootstrap.min.css';
import './styles.scss';

const App = () => (
  <LoadingWrapper>
    <Router />
  </LoadingWrapper>
);

App.propTypes = {
  store: PropTypes.shape({
    account: PropTypes.shape({
      username: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default connect(map)(App);
