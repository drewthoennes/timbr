import constants from '../const';

// Make sure to add these to the map
const initialState = {
  pets: {},
  geneaology: {
    families: [],
    trees: {},
  },
};

const pets = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_PETS:
      return {
        ...state,
        pets: action.pets || {},
        genealogy: {
          families: action.families,
          trees: action.trees,
        },
      };

    default:
      return state;
  }
};

export default pets;
