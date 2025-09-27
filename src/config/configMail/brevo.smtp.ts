import * as nodemailer from 'nodemailer';

export const transporterBrevo = nodemailer.createTransport({
  host: process.env.SMTP_BREVO_HOST,
  port: parseInt(process.env.SMTP_BREVO_PORT, 10),
  secure: false,
  auth: {
    user: process.env.SMTP_BREVO_USER,
    pass: process.env.SMTP_BREVO_PASS,
  },
});