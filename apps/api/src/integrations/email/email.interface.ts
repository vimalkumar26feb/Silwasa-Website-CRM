export interface EmailPayload {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailProvider {
  name: string;
  sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }>;
}
