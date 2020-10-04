

const nodemailer=require('nodemailer');
const cron=require('node-cron');
const twilio=require('twilio');



//set up firebase admin
var admin = require("firebase-admin");

var serviceAccount = require("/Users/niharikapujar/Desktop/projects/timbr/timbr-cs407-firebase-adminsdk-i9fut-501b161515.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://timbr-cs407.firebaseio.com"
});


// Fetch the user's email and send an email to everyone registered on the database.
var reminders=["water","fertilise","rotate"];

var plantsRef=admin.database().ref('/users/');
plantsRef.on("value",function(snapshot0){
  snapshot0.forEach(function(snapshot1){
      var userEmail=snapshot1.val().email;
      snapshot1.forEach(function(snapshot2){
      snapshot2.forEach(function(e){
        var plantName=e.val().name;
        var userPhoneNumber="+13129521148";
        reminders.forEach(function(r){
        var textBody=`Hello from timbr,\nThis is a friendly reminder to ${r} ${plantName} 🌱`;
        //sendNotificationEmail('niharikapujar@gmail.com',textBody); //send email notification
        //sendNotificationText(userPhoneNumber,textBody); //send text notification
        })
        
      })
      
    })
  
})
})



//set Text alerts
function sendNotificationText(userPhoneNumber,textContent){
var accountSid = process.env.TWILIO_SID; 
var authToken = process.env.TWILIO_AUTHTOKEN;   

var client = new twilio(accountSid, authToken);
//cron.schedule('* * * * *', function() {
client.messages.create({
    body: textContent,
    to: userPhoneNumber,  // Text this number
    from: process.env.PHONE_NUMBER // From a valid Twilio number
}) 
.then((message) => console.log(message.sid));
//console.log('running a cron sms task every minute');
//});//cron task 2
}


//set up Email alerts
mailgun_api = process.env.MAILGUN_API_KEY;
mailgun_domain = process.env.MAILGUN_DOMAIN;
function sendNotificationEmail(emailAddress,textContent){
let mailOptions={
  from:'timbr.alerts@gmail.com', //from address
  to: emailAddress, //to address from firebase 
  subject: 'timbr: Reminder 🌱',
  text: textContent
};
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS
  }
});
//cron.schedule('* * * * *', function() {
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response,'email sent to '+emailAddress);
  }
});  
//console.log('running a cron email task every minute');
//});//cron task 2
}

