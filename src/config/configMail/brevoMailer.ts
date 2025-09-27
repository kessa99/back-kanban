import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BrevoMailer {
  private readonly apiKey = process.env.SMTP_BREVO_PASS;
  private readonly senderEmail = 'kessadavidkipre@gmail.com';
  private readonly senderName = 'Kanban';

  async sendBrevoEmail(email: string, otp: string) {
    try {
      const htmlContent = `
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
      `;

      const textContent = `Votre code OTP est : ${otp}\nCe code expirera dans 5 minutes.\nSi vous n'avez pas demandé ce code, ignorez cet e-mail.`;

      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: { name: this.senderName, email: this.senderEmail },
          to: [{ email }],
          subject: 'Vérification OTP - Kanban',
          htmlContent,
          textContent,
        },
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(`✅ Email envoyé via Brevo API à ${email}, id: ${response.data.messageId}`);
    } catch (error: any) {
      console.error('❌ Erreur lors de l’envoi de l’email OTP via API:', error.response?.data || error.message);
      throw new InternalServerErrorException('Impossible d’envoyer l’email OTP.');
    }
  }
}
