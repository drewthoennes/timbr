import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import map from '../../store/map';
import './styles.scss';

class RegisterPage extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <div id="register-page">
        <p>timbr register page</p>
      </div>
    );
  }
}

export default connect(map)(withRouter(RegisterPage));
