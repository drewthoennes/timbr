/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const { Server } = require('http');
const config = require('./config');

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
