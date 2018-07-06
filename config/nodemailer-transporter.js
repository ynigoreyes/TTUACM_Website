const nodemailer = require('nodemailer');

exports.generateTestTransporter = () => {
  console.log('Using the Test Nodemailer Transporter');
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error(err);
      process.exit();
    }
    const smtpTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'blyosbbrqw3dio2v@ethereal.email',
        pass: 'UxphynyVHJ6TEWX6JC'
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    });
    global.smtpTransporter = smtpTransporter;
  });
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
