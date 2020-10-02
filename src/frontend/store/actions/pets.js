import { firebase } from '../../firebase/firebase';
import store from '../index';
import constants from '../const';

function setPets(pets) {
  return store.dispatch({
    type: constants.SET_PETS,
    pets,
  });
}

/* eslint-disable-next-line object-curly-newline */
function createNewPet({ parent = '', type, name, ownedSince, birth, death } = { parent: '' }) {
  const uid = firebase.auth().currentUser?.uid;

  firebase.database().ref(`/users/${uid}/pets`).push({
    parent,
    type,
    name,
    ownedSince,
    birth,
    death,
    created: Date.now(),
    updated: Date.now(),
  });
}

export default {
  setPets,
  createNewPet,
};
