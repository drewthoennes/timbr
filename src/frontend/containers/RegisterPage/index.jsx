import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import map from '../../store/map';
import './styles.scss';
import axios from 'axios'
import passwordHash from 'password-hash';

class RegisterPage extends React.Component {
  constructor() {
    super();

    this.state = {
      isRedirect: false,
    };
    this.handleRegister = this.handleRegister.bind(this)
  }

  handleRegister() {

    const credentials = {
      email: document.getElementById("email").value,
      password: passwordHash.generate(document.getElementById("password").value),
    };

    axios
      .post('/api/register', credentials)
      .catch(err => console.log(err))
      .then(res => console.log(res.data))

      this.setState({
        isRedirect: true,
      });
  }

  render() {
    if (this.state.isRedirect) {
      return <Redirect to = "/login" />
    }
    return (
      <div id="register-page">
        <form id="register-form" onSubmit = {this.handleRegister}>
          <input id="email"
            type="text"
            placeholder="Email" />

          <input id="password"
            type="password"
            placeholder="Password" />

          <button type="submit">Register</button>
        </form>
      </div>
    );
  }
}

export default connect(map)(withRouter(RegisterPage));
