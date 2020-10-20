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
    created: Date.now(),
    updated: Date.now(),
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
export function changeWatered(petId,curr_date) {
  //const uid = firebase.auth().currentUser?.uid;
  const { account: { uid } } = store.getState();
  if (!uid) {
    return Promise.resolve();
  }

  //firebase.database().ref(`users/${uid}/pets/${petId}/watered/history/`).push(
   // curr_date
   // );
   firebase.database().ref(`users/${uid}/pets/${petId}/watered/history/`).child(curr_date).set(true)
  firebase.database().ref(`users/${uid}/pets/${petId}/watered/last/`).set(
    curr_date
    );
    
  }
  


// This function is used to get the texts status of the current user. 
/*export function getWateredState(petId) {
  const { account: { uid } } = store.getState();
  if (!uid) {
    return Promise.resolve();
  }
  var val=firebase.database().ref(`users/${uid}/pets/${petId}/watered/last/`).once('value',DocumentSnapshot);

  
  return val;
} */
