const nodemailer = require("nodemailer");

const createMailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.BREVO_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.BREVO_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });
};

module.exports = createMailTransporter;