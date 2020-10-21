import { combineReducers } from 'redux';

import account from './account';
import pets from './pets';
import plants from './plants';
import users from './users';

const reducers = combineReducers({
  account,
  pets,
  plants,
  users,
});

export default reducers;
