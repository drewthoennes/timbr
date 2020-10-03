

const nodemailer=require('nodemailer');
//set up email content
const emailRecipients='pujarniharika@gmail.com';
const emailSubject='timbr: Reminder to water your plant'
const emailContent='Hello, this is a friendly reminder to water your plant 🌱'

//set up SMS content
const textRecipients="+13129521148"
const textBody="timbr: Hello, this is a friendly reminder to water your plant 🌱"

//setting up email and text alerts




mailgun_api = process.env.MAILGUN_API_KEY;
mailgun_domain = process.env.MAILGUN_DOMAIN;

const cron = require('node-cron');
//Schedule tasks to be run on the server
cron.schedule('* * * * *', function() {
//set up email alerts
let mailOptions={
  from:'timbr.alerts@gmail.com', //from address
  to: emailRecipients, //get to address 
  subject: emailSubject,
  text: emailContent
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
var accountSid = process.env.TWILIO_SID; 
var authToken = process.env.TWILIO_AUTHTOKEN;   

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

cron.schedule('* * * * *', function() {
client.messages.create({
    body: textBody,
    to: textRecipients,  // Text this number
    from: process.env.PHONE_NUMBER // From a valid Twilio number
}) 
.then((message) => console.log(message.sid));
console.log('running a task2 every minute');
});//cron job2 



