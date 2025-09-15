"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_HOST_USER || 'kessadavidkipre@gmail.com',
        pass: process.env.EMAIL_HOST_PASSWORD || 'xrfw ohnu ukok vukb',
    },
});
const sendOTPEmail = async (email, verificationLink) => {
    try {
        console.log('Email config:', {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            user: process.env.EMAIL_HOST_USER,
            pass: process.env.EMAIL_HOST_PASSWORD ? '***' : 'undefined',
        });
        const mailOptions = {
            from: `"Kanban" <${process.env.EMAIL_HOST_USER || 'kessadavidkipre@gmail.com'}>`,
            to: email,
            subject: 'Invitation à rejoindre une équipe Kanban',
            text: `Cliquez sur ce lien pour finaliser votre inscription : ${verificationLink}\nCe lien expirera dans 24 heures.\nSi vous n'avez pas demandé cette invitation, ignorez cet e-mail.`,
            html: `
        <h2 style="text-align: center; color: #333;">Invitation à rejoindre Kanban</h2>
        <p style="text-align: center; color: #666;">
          Vous avez été invité à rejoindre une équipe. Cliquez sur le lien ci-dessous pour finaliser votre inscription.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="font-size: 18px; font-weight: bold; color: #fff; background-color: #007bff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Finaliser l'inscription
          </a>
        </div>
        <p style="text-align: center; color: #666;">Ce lien expirera dans 24 heures. Si vous n'avez pas demandé cette invitation, ignorez cet e-mail.</p>
      `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Mail envoyé à : ${email}`);
    }
    catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
        throw new Error('Impossible d\'envoyer l\'email d\'invitation.');
    }
};
exports.sendOTPEmail = sendOTPEmail;
//# sourceMappingURL=invitMail.js.map