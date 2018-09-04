const nodemailer = require('nodemailer');

exports.generateTestTransporter = () => {
  console.log('Using the Test Nodemailer Transporter');
  const smtpTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'fr3yjbymylwvbkc6@ethereal.email',
      pass: 'sCvgzSPfhssNBEH3TQ'
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });
  global.smtpTransporter = smtpTransporter;
};

exports.generateProdTransporter = () => {
  const smtpTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.email_username,
      pass: process.env.email_password
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });
  global.smtpTransporter = smtpTransporter;
  console.log('Running production');
  console.log(`Email in use ${process.env.email_username}`);
};
