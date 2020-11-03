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

export function editPet(petId, newData) {
  const uid = firebase.auth().currentUser?.uid;

  return firebase.database().ref(`/users/${uid}/pets`).child(petId).update(newData);
}

/* eslint-disable-next-line object-curly-newline */
export function deletePet(petId) {
  const uid = firebase.auth().currentUser?.uid;

  return firebase.database().ref(`/users/${uid}/pets`).child(petId).remove();
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

// updates last action and history based on the action
export function addDate(petId, action, currDate) {
  const { account: { uid } } = store.getState();
  if (!uid) {
    return Promise.resolve();
  }
  return Promise.all([
    firebase.database().ref(`users/${uid}/pets/${petId}/${action}/history/`).child(currDate).set(true),
    firebase.database().ref(`users/${uid}/pets/${petId}/${action}/last/`).set(currDate),
  ]);
}

export function getPetProfilePicture(petId, callback) {
  const { account: { uid } } = store.getState();
  if (!uid) {
    return Promise.resolve();
  }

  return firebase.database().ref(`users/${uid}/pets/${petId}`).once('value', (pet) => {
    if (pet.exists() && pet.val().profilePic) {
      const pictureRef = firebase.storage().ref().child(`pets/profile-pictures/${petId}`);
      pictureRef.getDownloadURL().then(callback);
    }
  });
}

export function setPetProfilePicture(petId, file) {
  const { account: { uid } } = store.getState();
  if (!uid) {
    return Promise.resolve();
  }
  const storageRef = firebase.storage().ref();

  return storageRef.child(`pets/profile-pictures/${petId}`).put(file)
    .then(() => {
      firebase.database().ref(`users/${uid}/pets/${petId}`).once('value', (pet) => {
        if (pet.exists()) {
          firebase.database().ref(`users/${uid}/pets/${petId}`).update({
            profilePic: true,
          });
        }
      });
    });
}

export function removePetProfilePicture(petId) {
  const { account: { uid } } = store.getState();
  if (!uid) {
    return Promise.resolve();
  }
  const storageRef = firebase.storage().ref();

  return storageRef.child(`pets/profile-pictures/${petId}`).delete()
  .then(() => {
    firebase.database().ref(`users/${uid}/pets/${petId}`).once('value', (pet) => {
      if (pet.exists()) {
        firebase.database().ref(`users/${uid}/pets/${petId}`).update({
          profilePic: false,
        });
      }
    });
  });
}
