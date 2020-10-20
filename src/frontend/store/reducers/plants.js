import constants from '../const';

// Make sure to add these to the map
const initialState = {
  plants: {},
};

const plants = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_PLANTS:
      return { ...state, plants: action.plants || {} };

    default:
      return state;
  }
};

export default plants;
