/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const { Server } = require('http');
const config = require('./config');
const firebase_import = require('firebase/app')

require('dotenv').config();

const app = express();
const server = Server(app);

// Announce environment
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
  console.log('Running application for production');
} else {
  console.log('Running application for development');
}

// Set up Express.js
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || config.port;

app.get('/favicon.(ico|png)', (req, res) => {
  res.sendFile(`${__dirname}/src/frontend/favicon.png`);
});

app.get('/public/manifest.json', (req, res) => {
  res.sendFile(`${__dirname}/src/frontend/manifest.json`);
});

// Handle errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    res.json({ error: 'Invalid JSON' });
  } else {
    next();
  }
});


// Set up firebase
const firebase = firebase_import.initializeApp({
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "timbr-cs407.firebaseapp.com",
  databaseURL: "https://timbr-cs407.firebaseio.com",
  projectId: "timbr-cs407",
  storageBucket: "timbr-cs407.appspot.com",
  messagingSenderId: "719123149125",
  appId: "1:719123149125:web:3ebca1d4aeb3e9b47b4e2c",
  measurementId: "G-SW3QDZYMGX"
  })

// Catch all for backend API
app.use(require('./src/backend/routes')());

app.get('/index.html', (req, res) => {
  res.redirect('/');
});

// Frontend endpoints
app.use('/public', express.static(`${__dirname}/dist`));

// Catch all for frontend routes
app.all('/*', (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

server.listen(PORT);

console.log(chalk.green(`Started on port ${PORT}`));
