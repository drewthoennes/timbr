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
import PlantGenealogyPage from '../containers/PlantGenealogyPage';
import PlantProfilePage from '../containers/PlantProfilePage';
import AccountPage from '../containers/AccountPage';
import MyStatsPage from '../containers/MyStatsPage';
import ForgetPasswordPage from '../containers/ForgetPasswordPage';
import ChangePasswordPage from '../containers/ChangePasswordPage';
import NotFoundPage from '../containers/NotFoundPage';
import GraveyardPage from '../containers/GraveyardPage';

const history = createBrowserHistory();

const router = (props) => (
  <Router history={history}>
    <Switch>
      <Route exact path={`/${props.store.account.username}`} render={() => <MyPlantsPage own />} />
      <Route exact path={`/${props.store.account.username}/new`} render={() => <NewPlantProfilePage />} />
      <Route exact path={`/${props.store.account.username}/:id`} render={() => <PlantProfilePage own />} />
      <Route exact path={`/${props.store.account.username}/genealogy/:id`} render={() => <PlantGenealogyPage own />} />
      <Route exact path={`/${props.store.account.username}/edit/:id`} render={() => <EditPlantProfilePage />} />
      <Route path="/login" render={() => <LoginPage />} />
      <Route path="/register" render={() => <RegisterPage />} />
      <Route path="/account" render={() => <AccountPage />} />
      <Route path="/my-stats" render={() => <MyStatsPage />} />
      <Route path="/forget-password" render={() => <ForgetPasswordPage />} />
      <Route path="/change-password" render={() => <ChangePasswordPage />} />
      <Route path="/notfound" render={() => <NotFoundPage />} />
      <Route path="/graveyard" render={() => <GraveyardPage />} />
      <Route exact path="/:username" render={() => <MyPlantsPage own={false} />} />
      <Route exact path="/:username/new" render={() => <Redirect to={`/${props.store.account.username || 'login'}`} />} />
      <Route exact path="/:username/:id" render={() => <PlantProfilePage own={false} />} />
      <Route exact path="/:username/genealogy/:id" render={() => <PlantGenealogyPage own={false} />} />
      <Route path="*" render={() => <Redirect to={`/${props.store.account.username || 'login'}`} />} />
    </Switch>
  </Router>
);

export default connect(map)(router);
