import nodemailer, { type Transporter, type SendMailOptions } from 'nodemailer';
import { EmailPayload, EmailProvider } from './email.interface.js';

export class GmailEmailProvider implements EmailProvider {
  name = 'gmail';
  private transporter: Transporter | null = null;
  private fromEmail: string;
  private fromName: string;
  private smtpUser: string = '';

  constructor(user?: string, pass?: string, fromEmail = 'contact@silwasa.com', fromName = 'Silwasa IT Solutions') {
    this.smtpUser = (user || process.env.GMAIL_USER || process.env.SMTP_USER || '').trim();
    const rawPass = pass || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '';
    // Google App Passwords are 16 characters often presented in groups of 4 separated by spaces (e.g. abcd efgh ijkl mnop).
    // Stripping all whitespace ensures the password is clean and accepted by Google SMTP.
    const cleanPass = rawPass.replace(/\s+/g, '');

    this.fromEmail = (fromEmail || process.env.EMAIL_FROM || this.smtpUser || 'contact@silwasa.com').trim();
    this.fromName = (fromName || process.env.EMAIL_FROM_NAME || 'Silwasa IT Solutions').trim();

    if (this.smtpUser && cleanPass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.smtpUser,
          pass: cleanPass
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000
      });
    }
  }

  async verifyConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.transporter) {
      return { success: false, error: 'Gmail credentials (user and app password) are not configured' };
    }
    try {
      await this.transporter.verify();
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }

  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.transporter) {
      console.warn('[GmailEmailProvider] GMAIL_USER/GMAIL_APP_PASSWORD not configured. Email suppressed.');
      return { success: false, error: 'Gmail credentials not configured' };
    }

    try {
      const fromHeader = `"${this.fromName}" <${this.fromEmail || this.smtpUser}>`;
      const mailOptions: SendMailOptions = {
        from: fromHeader,
        to: payload.toName ? `"${payload.toName}" <${payload.to}>` : payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text
      };

      if (this.fromEmail && this.fromEmail.toLowerCase() !== this.smtpUser.toLowerCase()) {
        mailOptions.replyTo = this.fromEmail;
      }

      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }
}
