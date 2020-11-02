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

  client.messages.create({
    body: textContent,
    to: userPhoneNumber, // Text this number
    from: process.env.PHONE_NUMBER, // From a valid Twilio number
  })
    .then((message) => console.log(message.sid));
}

// set up Email alerts
function sendNotificationEmail(emailAddress, textContent) {
  transporter.sendMail(mailOptions(emailAddress, textContent), (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`, `email sent to ${emailAddress}`);
    }
  });
}

// sendReminder
function sendReminder(textsOn, emailsOn, userEmail, userPhoneNumber, reminder, plantName) {
  const textBody = `Hello from timbr,\nThis is a friendly reminder to ${reminder} your plant ${plantName} 🌱`;
  if (emailsOn === true && process.env.SEND_EMAILS === 'true') {
    sendNotificationEmail(userEmail, textBody); // send email notification
  }

  if (textsOn === true && process.env.SEND_TEXTS === 'true' && userPhoneNumber !== '+11111111111') {
    sendNotificationText(userPhoneNumber, textBody);// send text notification
  }
}

// Fetch the user's email and send an email to everyone registered on the database.
const reminders = ['water', 'fertilize', 'rotate', 'feed'];

// Runs cron everyday at 11:00 am
cron.schedule('0 11 * * *', () => {
  const plantsRef = admin.database().ref('/users/');
  plantsRef.once('value', (snapshot0) => {
    snapshot0.forEach((snapshot1) => {
      const userEmail = snapshot1.val().email;
      const userPhoneNumber = snapshot1.val().phoneNumber;
      // Check to see status of texts and emails
      const { textsOn } = snapshot1.val();
      const { emailsOn } = snapshot1.val();

      snapshot1.forEach((snapshot2) => {
        snapshot2.forEach((e) => {
          const plantName = e.val().name;

          let lastDate = '';
          let freq = 0;
          const species = e.val().type;

          reminders.forEach((reminder) => {
            switch (reminder) {
              case 'water':
                lastDate = e.val().watered;
                admin.database().ref(`/plants/${species}/waterFreq`).once('value', (data) => {
                  freq = data.val();
                  if (typeof (lastDate) !== 'undefined' && freq != null) {
                    const lastActionDate = new Date(lastDate.last);

                    const diffTime = Math.abs(new Date() - lastActionDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays >= freq) {
                      /* eslint-disable-next-line max-len */
                      sendReminder(textsOn, emailsOn, userEmail, userPhoneNumber, reminder, plantName);
                    }
                  }
                });

                break;

              case 'fertilize':
                lastDate = e.val().fertilized;
                admin.database().ref(`/plants/${species}/fertFreq`).once('value', (data) => {
                  freq = data.val();
                  if (typeof (lastDate) !== 'undefined' && freq != null) {
                    const lastActionDate = new Date(lastDate.last);
                    const diffTime = Math.abs(new Date() - lastActionDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays >= freq) {
                      /* eslint-disable-next-line max-len */
                      sendReminder(textsOn, emailsOn, userEmail, userPhoneNumber, reminder, plantName);
                    }
                  }
                });
                break;
              case 'rotate':
                lastDate = e.val().turned;
                freq = 7;
                if (typeof (lastDate) !== 'undefined' && freq != null) {
                  const lastActionDate = new Date(lastDate.last);
                  const diffTime = Math.abs(new Date() - lastActionDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays >= freq) {
                    /* eslint-disable-next-line max-len */
                    sendReminder(textsOn, emailsOn, userEmail, userPhoneNumber, reminder, plantName);
                  }
                }
                break;
              case 'feed':
                admin.database().ref(`/plants/${species}/feedFreq`).once('value', (data) => {
                  if (data.val()) { // the plant is carnivorous
                    freq = data.val();
                    lastDate = e.val().fed;
                    if (typeof (lastDate) !== 'undefined' && freq != null) {
                      const lastActionDate = new Date(lastDate.last);
                      const diffTime = Math.abs(new Date() - lastActionDate);
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      if (diffDays >= freq) {
                        /* eslint-disable-next-line max-len */
                        sendReminder(textsOn, emailsOn, userEmail, userPhoneNumber, reminder, plantName);
                      }
                    }
                  }
                });
                break;
              default:
                break;
            }// switch case
          });
        });
      });
    });
  });
});
