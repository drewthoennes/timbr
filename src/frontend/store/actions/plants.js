import { firebase } from '../../firebase/firebase';
import store from '../index';
import constants from '../const';

export default function setPlants(plants) {
  store.dispatch({
    type: constants.SET_PLANTS,
    plants,
  });
}

export function getPlantDetails(cb, type, feature) {
  firebase.database().ref().child('plants').child(type)
    .child(feature)
    .on('value', cb);
}
