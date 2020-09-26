const express = require('express');

require('../utils/index.js');
const healthEndpoints = require('./health');
const errorEndpoints = require('./error');

module.exports = () => {
  const router = express.Router();

  router.get('/api', (req, res) => {
    res.json({ message: 'timbr API' });
  });

  healthEndpoints(router);
  errorEndpoints(router);
  return router;
};
