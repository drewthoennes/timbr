/* eslint-disable no-console */
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const Twilio = require('twilio');
const admin = require('firebase-admin');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = (emailAddress, textContent) => ({
  from: 'timbr.alerts@gmail.com', // from address
  to: emailAddress, // to address from firebase
  subject: 'timbr: Reminder 🌱',
  text: textContent,
});

// set Text alerts
function sendNotificationText(userPhoneNumber, textContent) {
  const accountSid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_AUTHTOKEN;
  const client = new Twilio(accountSid, authToken);
  // cron.schedule('*/1 * * * *', function() {
  client.messages.create({
    body: textContent,
    to: userPhoneNumber, // Text this number
    from: process.env.PHONE_NUMBER, // From a valid Twilio number
  })
    .then((message) => console.log(message.sid));
  // console.log('running a cron sms task every 10 minutes');
  // });//cron task 2
}

// set up Email alerts
function sendNotificationEmail(emailAddress, textContent) {
  // cron.schedule('*/1 * * * *', function() {
  transporter.sendMail(mailOptions(emailAddress, textContent), (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`, `email sent to ${emailAddress}`);
    }
  });
  // console.log('running a cron email task every 10 minutes');
  // });//cron task 2
}

// Fetch the user's email and send an email to everyone registered on the database.
const reminders = ['water', 'fertilize', 'rotate'];

// Schedule for texts and emails every 10 minutes
cron.schedule('*/10 * * * *', () => {
  const plantsRef = admin.database().ref('/users/');
  plantsRef.once('value', (snapshot0) => {
    snapshot0.forEach((snapshot1) => {
      const userEmail = snapshot1.val().email;

      // Check to see status of texts and emails
      const { textsOn } = snapshot1.val();
      const { emailsOn } = snapshot1.val();

      snapshot1.forEach((snapshot2) => {
        snapshot2.forEach((e) => {
          const plantName = e.val().name;
          const userPhoneNumber = '+17657759145';

          reminders.forEach((r) => {
            const textBody = `Hello from timbr,\nThis is a friendly reminder to ${r} ${plantName} 🌱`;

            if (emailsOn === true && process.env.SEND_EMAILS === 'true') {
              sendNotificationEmail(userEmail, textBody); // send email notification
            }

            if (textsOn === true  && process.env.SEND_TEXTS === 'true') {
              sendNotificationText(userPhoneNumber, textBody);// send text notification
            }
          });
        });
      });
    });
  });
});
