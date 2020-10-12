import { firebase } from '../firebase/firebase';
import { setUID, setUsername, setEmail, setTextsOn, setEmailsOn, setAccountLoaded } from './actions/account';
import { setPets } from './actions/pets';

firebase.auth().onAuthStateChanged((user) => {
  const uid = user?.uid;
  setUID(user?.uid);

  if (user) {
    const userRef = firebase.database().ref(`/users/${uid}`);

    userRef.on('value', (snapshot) => {
      const { username, email, textsOn, emailsOn, pets } = snapshot.val();

      Promise.all([
        setUsername(username),
        setEmail(email),
        setTextsOn(textsOn),
        setEmailsOn(emailsOn),
        setPets(pets),
      ]).then(setAccountLoaded);
    });
  } else {
    setAccountLoaded();
  }
});
