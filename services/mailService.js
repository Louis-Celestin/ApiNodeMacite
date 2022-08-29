var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '0essaie0@gmail.com',
    pass: 'kamarahadja23'
  }
});
module.exports=transporter
