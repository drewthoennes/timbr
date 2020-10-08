import { firebase } from '../firebase/firebase';
import accountActions from './actions/account';
import { setPets } from './actions/pets';

firebase.auth().onAuthStateChanged((user) => {
  const uid = user?.uid;
  accountActions.setUID(user?.uid);

  if (user) {
    const petsRef = firebase.database().ref(`/users/${uid}/pets`);

    petsRef.on('value', (snapshot) => {
      setPets(snapshot.val());
    });
  }
});
