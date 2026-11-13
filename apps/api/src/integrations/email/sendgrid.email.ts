import { EmailPayload, EmailProvider } from './email.interface.js';

export class SendGridEmailProvider implements EmailProvider {
  name = 'sendgrid';
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor(apiKey?: string, fromEmail = 'contact@silwasa.com', fromName = 'Silwasa IT Solutions') {
    this.apiKey = apiKey || process.env.SENDGRID_API_KEY || '';
    this.fromEmail = fromEmail || process.env.EMAIL_FROM || 'contact@silwasa.com';
    this.fromName = fromName || process.env.EMAIL_FROM_NAME || 'Silwasa IT Solutions';
  }

  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.apiKey) {
      console.warn('[SendGridEmailProvider] SENDGRID_API_KEY is not configured. Email suppressed.');
      return { success: false, error: 'SENDGRID_API_KEY is not configured' };
    }

    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: payload.to, name: payload.toName || payload.to }]
            }
          ],
          from: { email: this.fromEmail, name: this.fromName },
          subject: payload.subject,
          content: [
            {
              type: 'text/html',
              value: payload.html
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `SendGrid API HTTP ${response.status}: ${errorText}` };
      }

      const messageId = response.headers.get('x-message-id') || undefined;
      return { success: true, messageId };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }
}
