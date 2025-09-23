// brevo.stmp.ts

import * as nodemailer from 'nodemailer';

export const transporterBrevo = nodemailer.createTransport({
  host: process.env.SMTP_BREVO_HOST,          // smtp-relay.brevo.com
  port: parseInt(process.env.SMTP_BREVO_PORT, 10), // 587
  secure: false, // false pour 587, true pour 465
  auth: {
    user: process.env.SMTP_BREVO_USER,        // ex: 979736001@smtp-brevo.com
    pass: process.env.SMTP_BREVO_PASS,        // clé SMTP
  },
});