const express = require('express');
const apiRoutes = require('../../../src/backend/routes');

let app;
let session;

const createApp = () => {
  app = express();

  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
      res.json({ error: 'Invalid JSON' });
    } else {
      next();
    }
  });

  app.use(apiRoutes());

  return app;
};

const createSession = () => {
  if (app) {
    session = app.listen(42014); // Needs to listen on an unused port
  }
};

const killSession = () => {
  if (session) {
    session.close();
  }
};

const getApp = () => {
  if (!app) {
    return createApp();
  }

  return app;
};

const getNewApp = () => {
  killSession();
  createApp();
  createSession();

  return app;
};

module.exports = {
  getApp,
  getNewApp,
  killSession,
};
