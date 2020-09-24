const firebase = require('firebase');

module.exports = (router) => {
  router.post('/api/register', (req, res) => {
    firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password);
    res.send('User created!');
  });
};
