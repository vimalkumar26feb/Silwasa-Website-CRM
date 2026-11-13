import { EmailPayload, EmailProvider } from './email.interface.js';
import { BrevoEmailProvider } from './brevo.email.js';
import { SendGridEmailProvider } from './sendgrid.email.js';
import { GmailEmailProvider } from './gmail.email.js';
import { MockEmailProvider } from './mock.email.js';

export * from './email.interface.js';
export * from './brevo.email.js';
export * from './sendgrid.email.js';
export * from './gmail.email.js';
export * from './mock.email.js';

export function getEmailProvider(preferred?: string): EmailProvider {
  const provider = preferred || process.env.EMAIL_PROVIDER || 'mock';

  switch (provider.toLowerCase()) {
    case 'brevo':
      return new BrevoEmailProvider();
    case 'sendgrid':
      return new SendGridEmailProvider();
    case 'gmail':
    case 'smtp':
      return new GmailEmailProvider();
    default:
      return new MockEmailProvider();
  }
}

export interface EnquiryEmailData {
  enquiryId: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  country?: string | null;
  service?: string | null;
  budget?: string | null;
  message: string;
  sourcePage?: string | null;
  createdAt: string | Date;
}

export class NotificationEmailService {
  private provider: EmailProvider;
  private adminEmail: string;

  constructor(provider?: EmailProvider, adminEmail = 'contact@silwasa.com') {
    this.provider = provider || getEmailProvider();
    this.adminEmail = adminEmail || process.env.ADMIN_NOTIFICATION_EMAIL || 'contact@silwasa.com';
  }

  setProvider(provider: EmailProvider) {
    this.provider = provider;
  }

  getProviderName(): string {
    return this.provider.name;
  }

  async sendLeadNotificationToAdmin(enquiry: EnquiryEmailData) {
    const formattedDate = new Date(enquiry.createdAt).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const html = `
      <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #151414; color: #FFFFFF; border: 1px solid #2A2B28; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1C1B1B 0%, #2A1F3D 100%); padding: 24px; border-bottom: 2px solid #663399;">
          <h2 style="margin: 0 0 6px 0; color: #D9F45F; font-size: 20px; font-weight: 700;">New Project Enquiry Received</h2>
          <p style="margin: 0; color: #A1A1AA; font-size: 13px;">Reference ID: <strong style="color: #FFFFFF;">${enquiry.enquiryId}</strong> • Received: ${formattedDate}</p>
        </div>
        
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2B28; color: #A1A1AA; width: 35%;">Client Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2B28; color: #FFFFFF; font-weight: 600;">${enquiry.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2B28; color: #A1A1AA;">Email Address:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2B28;"><a href="mailto:${enquiry.email}" style="color: #D9F45F; text-decoration: none;">${enquiry.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2B28; color: #A1A1AA;">Phone / WhatsApp:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2B28; color: #FFFFFF;">${enquiry.phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2B28; color: #A1A1AA;">Company / Organization:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2B28; color: #FFFFFF;">${enquiry.company || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2B28; color: #A1A1AA;">Target Service:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2B28; color: #D9F45F; font-weight: 600;">${enquiry.service || 'General Consultation'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2B28; color: #A1A1AA;">Estimated Budget:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2B28; color: #FFFFFF;">${enquiry.budget || 'To be discussed'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2B28; color: #A1A1AA;">Source Page:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2B28; color: #A1A1AA;">${enquiry.sourcePage || '/contact'}</td>
            </tr>
          </table>

          <div style="background-color: #1C1B1B; border: 1px solid #2A2B28; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0; color: #A1A1AA; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Project Scope / Message</p>
            <p style="margin: 0; color: #E4E4E7; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${enquiry.message}</p>
          </div>

          <div style="text-align: center; margin-top: 12px;">
            <a href="mailto:${enquiry.email}?subject=Regarding%20your%20project%20enquiry%20${enquiry.enquiryId}%20-%20Silwasa%20IT%20Solutions" style="display: inline-block; background-color: #663399; color: #FFFFFF; font-weight: 600; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; margin-right: 12px;">Reply via Email</a>
            ${enquiry.phone ? `<a href="https://wa.me/${enquiry.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(enquiry.name)},%20thank%20you%20for%20contacting%20Silwasa%20IT%20Solutions." style="display: inline-block; background-color: #25D366; color: #FFFFFF; font-weight: 600; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px;">WhatsApp Client</a>` : ''}
          </div>
        </div>

        <div style="background-color: #101010; padding: 14px; text-align: center; border-top: 1px solid #2A2B28; color: #71717A; font-size: 11px;">
          Silwasa IT Solutions Custom CMS Notification • <a href="https://silwasa.com" style="color: #A1A1AA; text-decoration: none;">silwasa.com</a>
        </div>
      </div>
    `;

    return this.provider.sendEmail({
      to: this.adminEmail,
      subject: `[New Lead] ${enquiry.service || 'Project Enquiry'} from ${enquiry.name} (${enquiry.enquiryId})`,
      html
    });
  }

  async sendConfirmationToClient(enquiry: EnquiryEmailData) {
    const html = `
      <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #151414; color: #FFFFFF; border: 1px solid #2A2B28; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1C1B1B 0%, #2A1F3D 100%); padding: 28px; border-bottom: 2px solid #663399; text-align: center;">
          <h1 style="margin: 0 0 8px 0; color: #FFFFFF; font-size: 22px; font-weight: 700;">Silwasa IT Solutions</h1>
          <p style="margin: 0; color: #D9F45F; font-size: 14px; font-weight: 500;">We have received your project enquiry</p>
        </div>

        <div style="padding: 28px; line-height: 1.6; font-size: 14px; color: #E4E4E7;">
          <p style="margin-top: 0;">Hi <strong>${enquiry.name}</strong>,</p>
          <p>Thank you for reaching out to <strong>Silwasa IT Solutions</strong>. Our senior software architects and consulting engineers have received your inquiry regarding <strong>${enquiry.service || 'your digital project'}</strong>.</p>
          
          <div style="background-color: #1C1B1B; border: 1px solid #2A2B28; border-radius: 8px; padding: 18px; margin: 24px 0;">
            <p style="margin: 0 0 8px 0; color: #A1A1AA; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Your Enquiry Summary</p>
            <p style="margin: 0 0 6px 0;"><strong>Reference Number:</strong> <span style="color: #D9F45F;">${enquiry.enquiryId}</span></p>
            <p style="margin: 0 0 6px 0;"><strong>Selected Service:</strong> ${enquiry.service || 'Custom Solution'}</p>
            ${enquiry.budget ? `<p style="margin: 0 0 6px 0;"><strong>Budget Scope:</strong> ${enquiry.budget}</p>` : ''}
            <p style="margin: 0;"><strong>Estimated Response Time:</strong> Within 24 business hours</p>
          </div>

          <p>If you have urgent requirements or want to speak with our technical team immediately, feel free to reach out via WhatsApp or direct phone call:</p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="https://wa.me/917070717794?text=Hi%20Silwasa%20Team,%20my%20enquiry%20reference%20is%20${enquiry.enquiryId}" style="display: inline-block; background-color: #25D366; color: #FFFFFF; font-weight: 600; padding: 12px 26px; border-radius: 6px; text-decoration: none; font-size: 14px; margin-right: 12px;">Chat on WhatsApp (+91 7070717794)</a>
            <a href="tel:+917070717794" style="display: inline-block; background-color: #2A2B28; color: #FFFFFF; font-weight: 600; padding: 12px 26px; border-radius: 6px; text-decoration: none; font-size: 14px;">Call Us Direct</a>
          </div>

          <p style="margin-bottom: 0; color: #A1A1AA; font-size: 13px;">Warm regards,<br><strong style="color: #FFFFFF;">Silwasa IT Solutions Technical Architecture Team</strong><br><a href="https://silwasa.com" style="color: #D9F45F; text-decoration: none;">silwasa.com</a></p>
        </div>

        <div style="background-color: #101010; padding: 16px; text-align: center; border-top: 1px solid #2A2B28; color: #71717A; font-size: 11px;">
          © ${new Date().getFullYear()} Silwasa IT Solutions. All rights reserved. • Silvassa, Dadra & Nagar Haveli, India
        </div>
      </div>
    `;

    return this.provider.sendEmail({
      to: enquiry.email,
      toName: enquiry.name,
      subject: `Thank you for contacting Silwasa IT Solutions [${enquiry.enquiryId}]`,
      html
    });
  }

  async sendEnquiryEmails(enquiry: EnquiryEmailData) {
    try {
      const results = await Promise.allSettled([
        this.sendLeadNotificationToAdmin(enquiry),
        this.sendConfirmationToClient(enquiry)
      ]);
      return results;
    } catch (err) {
      console.error('[NotificationEmailService] Error dispatching enquiry emails:', err);
      return [];
    }
  }
}

export const notificationEmailService = new NotificationEmailService();
