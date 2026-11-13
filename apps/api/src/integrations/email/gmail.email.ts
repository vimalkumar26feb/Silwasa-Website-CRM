import nodemailer, { type Transporter } from 'nodemailer';
import { EmailPayload, EmailProvider } from './email.interface.js';

export class GmailEmailProvider implements EmailProvider {
  name = 'gmail';
  private transporter: Transporter | null = null;
  private fromEmail: string;
  private fromName: string;

  constructor(user?: string, pass?: string, fromEmail = 'contact@silwasa.com', fromName = 'Silwasa IT Solutions') {
    const smtpUser = user || process.env.GMAIL_USER || process.env.SMTP_USER;
    const smtpPass = pass || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
    this.fromEmail = fromEmail || process.env.EMAIL_FROM || 'contact@silwasa.com';
    this.fromName = fromName || process.env.EMAIL_FROM_NAME || 'Silwasa IT Solutions';

    if (smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
    }
  }

  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.transporter) {
      console.warn('[GmailEmailProvider] GMAIL_USER/GMAIL_APP_PASSWORD not configured. Email suppressed.');
      return { success: false, error: 'Gmail credentials not configured' };
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: payload.toName ? `"${payload.toName}" <${payload.to}>` : payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text
      });

      return { success: true, messageId: info.messageId };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }
}
