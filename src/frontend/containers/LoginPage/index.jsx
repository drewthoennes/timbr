import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import map from '../../store/map';
import './styles.scss';

class LoginPage extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <div id="login-page">
        <p>timbr login page</p>
      </div>
    );
  }
}

export default connect(map)(withRouter(LoginPage));
