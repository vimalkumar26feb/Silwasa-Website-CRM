import { EmailPayload, EmailProvider } from './email.interface.js';

export class BrevoEmailProvider implements EmailProvider {
  name = 'brevo';
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor(apiKey?: string, fromEmail = 'contact@silwasa.com', fromName = 'Silwasa IT Solutions') {
    this.apiKey = apiKey || process.env.BREVO_API_KEY || '';
    this.fromEmail = fromEmail || process.env.EMAIL_FROM || 'contact@silwasa.com';
    this.fromName = fromName || process.env.EMAIL_FROM_NAME || 'Silwasa IT Solutions';
  }

  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.apiKey) {
      console.warn('[BrevoEmailProvider] BREVO_API_KEY is not configured. Email suppressed.');
      return { success: false, error: 'BREVO_API_KEY is not configured' };
    }

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: this.fromName, email: this.fromEmail },
          to: [{ email: payload.to, name: payload.toName || payload.to }],
          subject: payload.subject,
          htmlContent: payload.html,
          textContent: payload.text
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        return { success: false, error: `Brevo API HTTP ${response.status}: ${errorData}` };
      }

      const data = await response.json() as { messageId?: string };
      return { success: true, messageId: data.messageId };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }
}
