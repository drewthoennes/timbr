import React from 'react';
import {
  Switch,
  Route,
  Router,
  Redirect,
} from 'react-router-dom';
import { createBrowserHistory } from 'history';

import LoginPage from '../containers/LoginPage';
import RegisterPage from '../containers/RegisterPage';
import PetsPage from '../containers/PetsPage';
import AccountPage from '../containers/AccountPage';

const history = createBrowserHistory();

const router = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" render={() => <PetsPage />} />
      <Route path="/login" render={() => <LoginPage />} />
      <Route path="/register" render={() => <RegisterPage />} />
      <Route path="/account" render={() => <AccountPage />} />
      <Route path="*" render={() => <Redirect to="/" />} />
    </Switch>
  </Router>
);

export default router;
