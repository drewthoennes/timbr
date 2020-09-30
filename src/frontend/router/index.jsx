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
import PlantProfilePage from '../containers/PlantProfilePage';

const router = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/myplants" render={() => <MyPlantsPage />} />
      <Route exact path="/myplants/:id" render={props => <PlantProfilePage {...props}/>} />
      <Route path="/login" render={() => <LoginPage />} />
      <Route path="/register" render={() => <RegisterPage />} />
      <Route path="*" render={() => <Redirect to="/" />} />
    </Switch>
  </Router>
);

export default router;
