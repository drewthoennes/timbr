import constants from '../const';

// Make sure to add these to the map
const initialState = {
  uid: undefined,
  username: undefined,
  email: undefined,
  textsOn: undefined,
  emailsOn: undefined,
  loaded: false,
};

const account = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_UID:
      return { ...state, uid: action.uid };

    case constants.SET_USERNAME:
      return { ...state, username: action.username };

    case constants.SET_EMAIL:
      return { ...state, email: action.email };

    case constants.SET_TEXTS_ON:
      return { ...state, textsOn: action.textsOn };

    case constants.SET_EMAILS_ON:
      return { ...state, emailsOn: action.emailsOn };

    case constants.SET_ACCOUNT_LOADED:
      return { ...state, loaded: true };

    default:
      return state;
  }
};

export default account;
