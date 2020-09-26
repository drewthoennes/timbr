import firebase from 'firebase/app';
import 'firebase/auth';
import config from './firebase.config';

/* Initialising firebase */

firebase.initializeApp(config);

// add providers and database here

export { firebase as default };
