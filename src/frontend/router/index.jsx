import React from 'react';
import {
  Switch,
  Route,
  Router,
  Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
import map from '../store/map';

import LoginPage from '../containers/LoginPage';
import RegisterPage from '../containers/RegisterPage';
import MyPlantsPage from '../containers/MyPlantsPage';
import NewPlantProfilePage from '../containers/NewPlantProfilePage';
import PlantProfilePage from '../containers/PlantProfilePage';
import AccountPage from '../containers/AccountPage';
import ForgetPasswordPage from '../containers/ForgetPasswordPage';

const history = createBrowserHistory();

const router = (props) => (
  <Router history={history}>
    <Switch>
      <Route exact path={`/${props.store.account.username}`} render={() => <MyPlantsPage />} />
      <Route exact path={`/${props.store.account.username}/new`} render={() => <NewPlantProfilePage />} />
      <Route exact path={`/${props.store.account.username}/:id`} render={() => <PlantProfilePage />} />
      <Route path="/:username/:id" render={() => <PlantProfilePage />} />
      <Route path="/login" render={() => <LoginPage />} />
      <Route path="/register" render={() => <RegisterPage />} />
      <Route path="/account" render={() => <AccountPage />} />
      <Route path="/forget-password" render={() => <ForgetPasswordPage />} />
      <Route path="*" render={() => <Redirect to={`/${props.store.account.username || 'login'}`} />} />
    </Switch>
  </Router>
);

export default connect(map)(router);
