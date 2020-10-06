import { combineReducers } from 'redux';

import account from './account';
import pets from './pets';

const reducers = combineReducers({
  account,
  pets,
});

export default reducers;
