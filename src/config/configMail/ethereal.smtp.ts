import nodemailer from 'nodemailer';


export const transporterEtheral = nodemailer.createTransport({
    host: process.env.SMTP_ETHEREAL_HOST,
    port: Number(process.env.SMTP_ETHEREAL_PORT),
    auth: {
      user: process.env.SMTP_ETHEREAL_USER,
      pass: process.env.SMTP_ETHEREAL_PASS,
    },
});