import constants from '../const';

// Make sure to add these to the map
const initialState = {
  uid: undefined,
};

const account = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_UID:
      return { ...state, uid: action.uid };

    default:
      return state;
  }
};

export default account;
