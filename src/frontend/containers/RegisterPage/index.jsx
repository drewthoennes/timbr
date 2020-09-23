import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import map from '../../store/map';
import './styles.scss';
import axios from 'axios'
import history from '../../router/history'
import passwordHash from 'password-hash';

class RegisterPage extends React.Component {
  constructor() {
    super();

    this.state = {
      isRedirect: false,
    };
    this.handleRegister = this.handleRegister.bind(this)
  }

  handleRegister(e) {
    e.preventDefault();

    const credentials = {
      email: document.getElementById("email").value,
      password: passwordHash.generate(document.getElementById("password").value),
    };

    axios
      .post('/api/register', credentials)
      .catch(err => console.log(err))
      .then(res => console.log(res.data))

      history.push('/login');
  }

  render() {
    return (
      <div id="register-page">
        <form id="register-form">
          <input id="email"
            type="text"
            placeholder="Email" />

          <input id="password"
            type="password"
            placeholder="Password" />
          <button onClick={this.handleRegister}>Register</button>
        </form>
      </div>
    );
  }
}

export default connect(map)(withRouter(RegisterPage));
