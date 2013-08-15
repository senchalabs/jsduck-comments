var nodemailer = require('nodemailer');
var mailconfig = require('./lib/configwrapper').email;
if (mailconfig.mode === "SES") {
  var transport = nodemailer.createTransport("SES", mailconfig.config);
  if (typeof process.argv[2] !== 'undefined' && process.argv[2].match(/\S+@\S+\.\S+/))
  {
  sendto=process.argv[2];
  from=mailconfig.from;
  var message={from: from, to: sendto, subject: "Test mail", text: "Making sure our SES config works fine...?\nEpoch time: "+Date.now()};
  console.log("Sending mail as "+from + " to " + sendto );
  transport.sendMail(message, function(error){
    if(error) {
      console.log("Error => "+error.message);
    }
    else {
      console.log("Sent successfully.");
    }
  });

  }
  else{
  console.log("Need a valid email to send-to, how about yours?");
  }

}
else {
  console.log("Nothing to do - email.mode is not SES");
}


