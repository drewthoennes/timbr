import { firebase } from '../../firebase/firebase';
import store from '../index';
import constants from '../const';

export function setPets(pets) {
  return store.dispatch({
    type: constants.SET_PETS,
    pets,
  });
}

/* eslint-disable-next-line object-curly-newline */
export function createNewPet({ parent = '', type = '', name, ownedSince, birth, death = null } = { parent: '' }) {
  const uid = firebase.auth().currentUser?.uid;

  return firebase.database().ref(`/users/${uid}/pets`).push({
    parent,
    type,
    name,
    ownedSince,
    birth,
    death,
    watered: { last: '0', streak: '0' },
    fertilized: { last: '0', streak: '0' },
    turned: { last: '0', streak: '0' },
  });
}

export function setForeignUserPets(username, petId) {
  return firebase.database().ref('/users').orderByChild('username').equalTo(username)
    .once('value')
    .then((user) => {
      if (!user.val()) {
        throw new Error('No user with this username exists');
      }

      const data = Object.values(user.val())[0];
      if (!data.pets?.[petId]) {
        throw new Error('No pet with this ID exists for this user');
      }

      return store.dispatch({
        type: constants.SET_FOREIGN_USER_PETS,
        username,
        pets: data.pets,
      });
    });
}

//set watered data
export function changeWatered(last) {
  const { account: { uid } } = store.getState();
  if (!uid) {
    return Promise.resolve();
  }

  return firebase.database().ref(`users/${uid}`).once('value', (user) => {
    if (user.exists()) {
      firebase.database().ref(`users/${uid}/pets/watered/last`).push({
      last,
      });
    }
  });
} 

// This function is used to get the texts status of the current user. 
export function getWateredState(cb, myStore) {
  const { account: { uid } } = myStore;
  if (!uid) {
    return;
  }
  firebase.database().ref().child('users').child(uid)
    .child('pets').child(petId).child('watered').child('last')
    .on('value', cb);
} 
