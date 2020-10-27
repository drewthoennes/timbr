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

export function getPlantName(cb, type) {
  firebase.database().ref().child('plants').child(type)
    .child('name')
    .on('value', cb);
}

export function getPlantSciName(cb, type) {
  firebase.database().ref().child('plants').child(type)
    .child('scientificName')
    .on('value', cb);
}

export function getPlantWaterCycle(cb, type) {
  firebase.database().ref().child('plants').child(type)
    .child('waterFreq')
    .on('value', cb);
}

export function getPlantFeedFreq(cb, type) {
  firebase.database().ref().child('plants').child(type)
    .child('feedFreq')
    .on('value', cb);
}

export function getPlantFertFreq(cb, type) {
  firebase.database().ref().child('plants').child(type)
    .child('fertFreq')
    .on('value', cb);
}

export function getPlantDescription(cb, type) {
  firebase.database().ref().child('plants').child(type)
    .child('description')
    .on('value', cb);
}

export function getPlantCarnivore(cb, type)  {
  firebase.database().ref().child('plants').child(type)
    .child('carnivore')
    .on('value', cb);
}

export function getPlantImageURL(cb, type)  {
  firebase.database().ref().child('plants').child(type)
    .child('picture')
    .on('value', cb);
}
// updates last action and history based on the action
export function addDate(petId, action, currDate) {
  const { account: { uid } } = store.getState();
  if (!uid) {
    return Promise.resolve();
  }
  return Promise.all([
    firebase.database().ref(`users/${uid}/pets/${petId}/${action}/history/`).child(currDate).set(true),
    firebase.database().ref(`users/${uid}/pets/${petId}/${action}/last/`).set(currDate)]);
}
