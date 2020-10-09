import React from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import map from '../../store/map';
import './styles.scss';

const LoadingWrapper = (props) => {
  const { children, store: { account: { loaded } } } = props;

  if (!loaded) {
    return (
      <div id="loading-wrapper" className="container d-flex flex-row justify-content-center">
        <div className="d-flex flex-column justify-content-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  return (<>{ children }</>);
};

LoadingWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  store: PropTypes.shape({
    account: PropTypes.shape({
      loaded: PropTypes.bool,
    }).isRequired,
  }).isRequired,
};

export default connect(map)(LoadingWrapper);
