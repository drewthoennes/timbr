/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer=require('nodemailer');
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

//setting up email and text alerts
//grab email/text prefrences from module
var notificationSettings = require('./alerts/notifications.js');
mailgun_api = process.env.MAILGUN_API_KEY;
mailgun_domain = process.env.MAILGUN_DOMAIN;

const cron = require('node-cron');
//Schedule tasks to be run on the server
cron.schedule('* * * * *', function() {
//set up email alerts
let mailOptions={
  from:'timbr.alerts@gmail.com', //from address
  to: notificationSettings.emailRecipients, //get to address 
  subject:notificationSettings.emailSubject,
  text:notificationSettings.emailContent
};
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS
  }
});
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});  
console.log('running a task1 every minute');
}); //cron job1

//Text alerts
var twilio = require('twilio');
var accountSid = process.env.TWILIO_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTHTOKEN;   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

cron.schedule('* * * * *', function() {
client.messages.create({
    body: notificationSettings.textBody,
    to: notificationSettings.textRecipients,  // Text this number
    from: process.env.PHONE_NUMBER // From a valid Twilio number
})
.then((message) => console.log(message.sid));
console.log('running a task2 every minute');
});//cron job2
