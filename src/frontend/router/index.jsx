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
import EditPlantProfilePage from '../containers/EditPlantProfilePage';
import PlantProfilePage from '../containers/PlantProfilePage';
import AccountPage from '../containers/AccountPage';
import ForgetPasswordPage from '../containers/ForgetPasswordPage';
import ChangePasswordPage from '../containers/ChangePasswordPage';
import NotFoundPage from '../containers/NotFoundPage';
import GraveyardPage from '../containers/GraveyardPage';

const history = createBrowserHistory();

const router = (props) => (
  <Router history={history}>
    <Switch>
      <Route exact path={`/${props.store.account.username}`} render={() => <MyPlantsPage />} />
      <Route exact path={`/${props.store.account.username}/new`} render={() => <NewPlantProfilePage />} />
      <Route exact path={`/${props.store.account.username}/:id`} render={() => <PlantProfilePage own />} />
      <Route exact path={`/${props.store.account.username}/edit/:id`} render={() => <EditPlantProfilePage />} />
      <Route path="/:username/:id" render={() => <PlantProfilePage own={false} />} />
      <Route path="/login" render={() => <LoginPage />} />
      <Route path="/register" render={() => <RegisterPage />} />
      <Route path="/account" render={() => <AccountPage />} />
      <Route path="/forget-password" render={() => <ForgetPasswordPage />} />
      <Route path="/change-password" render={() => <ChangePasswordPage />} />
      <Route path="/notfound" render={() => <NotFoundPage />} />
      <Route path="/graveyard" render={() => <GraveyardPage />} />
      <Route path="*" render={() => <Redirect to={`/${props.store.account.username || 'login'}`} />} />
    </Switch>
  </Router>
);

export default connect(map)(router);
