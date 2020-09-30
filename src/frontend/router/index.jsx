import React from 'react';
import {
  Switch,
  Route,
  Router,
  Redirect,
} from 'react-router-dom';
import history from './history';

import LoginPage from '../containers/LoginPage';
import RegisterPage from '../containers/RegisterPage';
import MyPlantsPage from '../containers/MyPlantsPage';

const router = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/my-plants" render={() => <MyPlantsPage />} />
      <Route path="/login" render={() => <LoginPage />} />
      <Route path="/register" render={() => <RegisterPage />} />
      <Route path="*" render={() => <Redirect to="/" />} />
    </Switch>
  </Router>
);

export default router;
