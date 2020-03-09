const nodemailer = require('nodemailer');
const CustomError = require('./../models/customError.model');
var handlebars = require('handlebars');
var log4js = require('log4js');
const logger = log4js.getLogger('webApi');
var fs = require('fs');

var readHTMLFile = function (path, callback) {

  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      throw err;
    }
    else {
      callback(null, html);
    }
  });

};

let transporter = nodemailer.createTransport({
  host: 'email-smtp.eu-west-1.amazonaws.com',
  port: 587,
  //secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});
/*
let transporter = nodemailer.createTransport({
  service: 'SMTP',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});*/

module.exports.emailSender = function emailSender(pathTemplate, to,from , subject, replacements) {

  try {
    readHTMLFile(pathTemplate, function (err, html) {
      if (err) {
        logger.error('Error occured while reading file \r\n' + err);
        return;
      }
      try {
        if (html) {
          var template = handlebars.compile(html);
          var htmlToSend = template(replacements);
          var mailOptions = {
            from: process.env.EMAIL,
            //from: from,
            to: to,
            subject: process.env.ENVOIRNMENT == "UAT" ? " (UAT) " + subject : process.env.ENVOIRNMENT == "DEV" ? " (DEV) " + subject : subject,
            html: htmlToSend
          };
          transporter.sendMail(mailOptions)
            .then(() => {
              console.log('Successfully sent');
              logger.info('Successfully sent');
            })
            .catch((err) => {
              if (err)
                console.log(err);
              logger.error('Error occured sending email \r\n' + err);
            });
        }
      }
      catch (e) {
        console.log(e);
        logger.error('Error occured sending email \r\n' + e);
      }
    })
  } catch (error) {
    logger.error('Error occured  \r\n' + error);
  }



};









