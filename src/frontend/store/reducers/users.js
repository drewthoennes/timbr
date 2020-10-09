import constants from '../const';

// Make sure to add these to the map
const initialState = {
  users: {}, // Map of users keyed by username
};

const account = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_FOREIGN_USER_PETS: {
      const { username, pets } = action;
      return {
        ...state,
        users: {
          [username]: { pets },
        },
      };
    }

    default:
      return state;
  }
};

export default account;
