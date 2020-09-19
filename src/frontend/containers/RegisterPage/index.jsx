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
        <title>Register</title>
        <RegisterForm />
      </div>
    );
  }
}

class RegisterForm extends React.Component {
  constructor () {
      super();

      this.state = {
          email: '',
          password: '',
          username: ''
      }
  }

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value});
  }

  handleRegister() {
    // TODO
    console.log("Handle register")
  }

  render() {
      return (
          <form>
            <input type="text"
            value={ this.state.email }
            name="email"
            placeholder="Email"
            onChange={ this.handleChange }/>

            <input type="text"
            value={ this.state.username }
            name="username"
            placeholder="Username"
            onChange={ this.handleChange }/>

            <input type="password"
            value={ this.state.password }
            name="password"
            placeholder="Password"
            onChange={ this.handleChange }/>

            <button onClick = { this.handleRegister }>Register</button>
          </form>
      )
  }
}

export default connect(map)(withRouter(RegisterPage));
