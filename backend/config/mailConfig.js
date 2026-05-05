const nodemailer = require("nodemailer");

const createTransporter = () => {
  const requiredEnv = [
    "BREVO_HOST",
    "BREVO_PORT",
    "BREVO_USER",
    "BREVO_PASS",
    "BREVO_FROM_EMAIL",
    "BREVO_FROM_NAME",
  ];

  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Brevo email setup missing: ${missing.join(
        ", "
      )}. Add these in backend/.env and Render Environment Variables.`
    );
  }

  return nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: Number(process.env.BREVO_PORT),
    secure: Number(process.env.BREVO_PORT) === 465,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });
};

module.exports = createTransporter;