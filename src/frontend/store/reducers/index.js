import { combineReducers } from 'redux';

import account from './account';
import pets from './pets';
import users from './users';

const reducers = combineReducers({
  account,
  pets,
  users,
});

export default reducers;
