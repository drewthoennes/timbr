import store from '../index';
import constants from '../const';

export default function setPlants(plants) {
  store.dispatch({
    type: constants.SET_PLANTS,
    plants,
  });
}
