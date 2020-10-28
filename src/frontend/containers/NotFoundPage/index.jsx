import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import Navbar from '../../components/Navbar';
import map from '../../store/map';

function NotFoundPage(props) {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="hero">
          <h1>404 Not Found</h1>
          <p>We couldn't find the page you were looking for. Sorry about that!</p>
        </div>
      </div>
    </>
  )
}
export default connect(map)(withRouter(NotFoundPage));
