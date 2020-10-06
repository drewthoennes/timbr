import constants from '../const';

// Make sure to add these to the map
const initialState = {
  pets: {},
};

const pets = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_PETS:
      return { ...state, pets: action.pets || {} };

    default:
      return state;
  }
};

export default pets;
