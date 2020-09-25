const firebase = require('firebase');

module.exports = (router) => {
  // endpoint for registering a new user
  router.post('/api/register', (req, res) => {
    // TODO: Validate req.body.email and req.body.password
    firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password);
    res.send('User created!');
  });

  // endpoint for signing in a user
  router.post('/api/login', (req, res) => {
    // TODO: Validate req.body.email and req.body.password
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password);
    res.send('User logged in!');
  });
};
