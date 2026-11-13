import { EmailPayload, EmailProvider } from './email.interface.js';

export class MockEmailProvider implements EmailProvider {
  name = 'mock';
  sentEmails: EmailPayload[] = [];

  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId: string }> {
    this.sentEmails.push(payload);
    console.log(`[MockEmailProvider] To: ${payload.to} | Subject: "${payload.subject}"`);
    return { success: true, messageId: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}` };
  }
}
