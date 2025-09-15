"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = void 0;
const nodemailer_1 = require("nodemailer");
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_HOST_USER || "kessadavidkipre@gmail.com",
        pass: process.env.EMAIL_HOST_PASSWORD || "xrfw ohnu ukok vukb",
    },
});
const sendOTPEmail = async (email, otp) => {
    try {
        console.log('Email config:', {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            user: process.env.EMAIL_HOST_USER,
            pass: process.env.EMAIL_HOST_PASSWORD ? '***' : 'undefined'
        });
        const mailOptions = {
            from: `"Kanban" <${process.env.EMAIL_HOST_USER || "kessadavidkipre@gmail.com"}>`,
            to: email,
            subject: "Vérification OTP - Kanban",
            text: `Votre code OTP est : ${otp}\nCe code expirera dans 5 minutes.\nSi vous n'avez pas demandé ce code, ignorez cet e-mail.`,
            html: `
        <h2 style="text-align: center; color: #333;">Vérification de votre compte Kanban</h2>
        <p style="text-align: center; color: #666;">
          Voici votre code de vérification. Ce code expirera dans 5 minutes.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #0a74f0; padding: 10px 20px; border: 2px solid #007bff; border-radius: 5px;">
            ${otp}
          </span>
        </div>
        <p style="text-align: center; color: #666;">Si vous n'avez pas demandé ce code, ignorez cet e-mail.</p>
      `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Mail envoyé à : ${email}`);
    }
    catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error);
        throw new Error("Impossible d'envoyer l'email OTP.");
    }
};
exports.sendOTPEmail = sendOTPEmail;
//# sourceMappingURL=otpMailer.js.map