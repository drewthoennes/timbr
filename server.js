/* eslint-disable no-console */
const express = require('express');
const chalk = require('chalk');
const { Server } = require('http');
const admin = require('firebase-admin');
const config = require('./config');
require('dotenv').config();

const {
  NODE_ENV,
  PORT,
  FIREBASE_ADMIN_PRIVATE_KEY_ID,
  FIREBASE_ADMIN_PRIVATE_KEY,
  FIREBASE_ADMIN_CLIENT_EMAIL,
  FIREBASE_ADMIN_CLIENT_ID,
  FIREBASE_ADMIN_CLIENT_X509,
} = process.env;

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: 'timbr-cs407',
    private_key_id: FIREBASE_ADMIN_PRIVATE_KEY_ID,
    private_key: FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: FIREBASE_ADMIN_CLIENT_EMAIL,
    client_id: FIREBASE_ADMIN_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: FIREBASE_ADMIN_CLIENT_X509,
  }),
  databaseURL: 'https://timbr-cs407.firebaseio.com',
});

const app = express();
const server = Server(app);
const port = PORT || config.port;
require('./src/backend/alerts/alerts');

// Announce environment
if (!NODE_ENV || NODE_ENV === 'production') {
  console.log('Running application for production');
} else {
  console.log('Running application for development');
}

/*
app.get('/favicon.(ico|png)', (req, res) => {
  res.sendFile(`${__dirname}/src/frontend/favicon.png`)
});
*/

app.get('/public/manifest.json', (req, res) => {
  res.sendFile(`${__dirname}/src/frontend/manifest.json`);
});

// Catch all for backend API
app.use(require('./src/backend/routes')());

app.get('/index.html', (req, res) => res.redirect('/'));

// Frontend endpoints
app.use('/public', express.static(`${__dirname}/dist`));

// Catch all for frontend routes
app.all('/*', (req, res) => res.sendFile(`${__dirname}/dist/index.html`));

server.listen(port);

console.log(chalk.green(`Started on port ${port}`));
