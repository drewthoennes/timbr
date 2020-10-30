import { firebase } from '../../firebase/firebase';
import store from '../index';
import constants from '../const';

export default function setPlants(plants) {
  store.dispatch({
    type: constants.SET_PLANTS,
    plants,
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

export function getPlantCarnivore(cb, type) {
  firebase.database().ref().child('plants').child(type)
    .child('carnivore')
    .on('value', cb);
}

export function getPlantImageURL(cb, type) {
  firebase.database().ref().child('plants').child(type)
    .child('picture')
    .on('value', cb);
}
