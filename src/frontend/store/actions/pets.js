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
    profilePic: false,
    watered: { last: '0', streak: '0' },
    fertilized: { last: '0', streak: '0' },
    turned: { last: '0', streak: '0' },
    fed: { last: '0', streak: '0' },
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
  const uid = firebase.auth().currentUser?.uid;
  if (!uid) {
    return Promise.resolve();
  }

  return Promise.all([
    firebase.database().ref(`users/${uid}/pets/${petId}/${action}/history/`).child(currDate).set(true),
    firebase.database().ref(`users/${uid}/pets/${petId}/${action}/last/`).set(currDate),
  ]);
}

export function getPetProfilePicture(petId) {
  const uid = firebase.auth().currentUser?.uid;
  if (!uid) {
    return Promise.resolve();
  }

  return firebase.database().ref(`users/${uid}/pets/${petId}`).once('value').then((pet) => {
    if (petId !== `temp-${uid}` && (!pet.exists() || !pet.val().profilePic)) {
      return Promise.resolve();
    }

    return firebase.storage().ref().child(`pets/profile-pictures/${petId}`).getDownloadURL();
  });
}

export function setPetProfilePicture(petId, file) {
  const uid = firebase.auth().currentUser?.uid;
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
  const uid = firebase.auth().currentUser?.uid;
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

export function getPetGrowthPictures(petId) {
  const uid = firebase.auth().currentUser?.uid;
  if (!uid) {
    return Promise.resolve();
  }

  return firebase.database().ref(`users/${uid}/pets/${petId}`).once('value').then((pet) => {
    if (!pet?.exists() || !pet.val().growthPics?.length) {
      return Promise.resolve({});
    }

    const { growthPics } = pet.val();

    if (!growthPics) {
      return Promise.resolve({});
    }

    const promises = growthPics
      .map((timestamp) => firebase.storage().ref(`pets/growth-pictures/${petId}@${timestamp}`).getDownloadURL());

    return Promise.all(promises)
      .then((fulfilledPromises) => { // eslint-disable-line arrow-body-style
        return fulfilledPromises
          .reduce((acc, promise, index) => ({ ...acc, [pet.val().growthPics[index]]: promise }), {}); // eslint-disable-line max-len
      });
  });
}

export function addPetGrowthPicture(petId, file, callback) {
  const uid = firebase.auth().currentUser?.uid;
  if (!uid) {
    return callback(new Error('User does not exist.'));
  }

  return firebase.database().ref(`users/${uid}/pets/${petId}`).once('value', (pet) => {
    if (!pet.exists()) {
      return callback(new Error('Pet does not exist.'));
    }

    const growthPics = pet.val().growthPics?.slice() ?? [];
    if (growthPics.length === constants.NUM_GROWTH_PICTURES) {
      return callback(new Error(`Maximum growth pictures uploaded (${constants.NUM_GROWTH_PICTURES}). Please remove one or more existing pictures, and try again.`));
    }

    const storageRef = firebase.storage().ref();
    const timestamp = (new Date()).toISOString();
    return storageRef.child(`pets/growth-pictures/${petId}@${timestamp}`).put(file)
      .then(() => {
        growthPics.push(timestamp);
        firebase.database().ref(`users/${uid}/pets/${petId}`).update({ growthPics });
        callback(timestamp);
      });
  });
}

export function removePetGrowthPicture(petId, index, callback) {
  const uid = firebase.auth().currentUser?.uid;
  if (!uid) {
    return callback(new Error('User does not exist.'));
  }

  return firebase.database().ref(`users/${uid}/pets/${petId}`).once('value', (pet) => {
    if (!pet.exists()) {
      return callback(new Error('Pet does not exist.'));
    }

    const growthPics = pet.val().growthPics.slice();
    const storageRef = firebase.storage().ref();
    return storageRef.child(`pets/growth-pictures/${petId}@${index}`).delete()
      .then(() => {
        const i = growthPics.indexOf(index);
        if (i > -1) {
          growthPics.splice(i, 1);
        }
        firebase.database().ref(`users/${uid}/pets/${petId}`).update({ growthPics });
        callback(index);
      });
  });
}
