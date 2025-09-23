import nodemailer from 'nodemailer';


export const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_HOST_USER || "kessadavidkipre@gmail.com",
      pass: process.env.EMAIL_HOST_PASSWORD || "xrfw ohnu ukok vukb",
    },
});