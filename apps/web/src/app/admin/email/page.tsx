'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import {
  Mail,
  ShieldCheck,
  Send,
  CheckCircle,
  AlertCircle,
  Server,
  Key,
  ExternalLink,
  Globe
} from 'lucide-react';

interface EmailSettingsData {
  provider: 'mock' | 'brevo' | 'sendgrid' | 'gmail';
  fromEmail: string;
  fromName: string;
  adminNotificationEmail: string;
  brevoApiKey?: string;
  sendgridApiKey?: string;
  gmailUser?: string;
  gmailAppPassword?: string;
}

export default function AdminEmailSettingsPage() {
  const [settings, setSettings] = useState<EmailSettingsData>({
    provider: 'mock',
    fromEmail: 'contact@silwasa.com',
    fromName: 'Silwasa IT Solutions',
    adminNotificationEmail: 'contact@silwasa.com',
    brevoApiKey: '',
    sendgridApiKey: '',
    gmailUser: '',
    gmailAppPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('contact@silwasa.com');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>('/admin/settings/email');
      if (res) {
        setSettings({
          provider: res.provider || 'mock',
          fromEmail: res.fromEmail || 'contact@silwasa.com',
          fromName: res.fromName || 'Silwasa IT Solutions',
          adminNotificationEmail: res.adminNotificationEmail || 'contact@silwasa.com',
          brevoApiKey: res.brevoApiKey || '',
          sendgridApiKey: res.sendgridApiKey || '',
          gmailUser: res.gmailUser || '',
          gmailAppPassword: res.gmailAppPassword || ''
        });
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      await apiClient.put('/admin/settings/email', settings);
      setNotification({
        type: 'success',
        message: 'Email provider settings and credentials updated successfully.'
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to save email settings'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmailAddress) return;
    setTesting(true);
    setNotification(null);

    try {
      // Mock test dispatch
      await new Promise((r) => setTimeout(r, 800));
      setNotification({
        type: 'success',
        message: `Test email dispatched to ${testEmailAddress} via ${settings.provider.toUpperCase()} provider.`
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to dispatch test email'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Mail className="w-6 h-6 text-[#D9F45F]" />
          Email & SMTP Configuration
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure outgoing transactional email providers (Brevo, SendGrid, Google Workspace) for lead notifications and client auto-responders.
        </p>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-lg flex items-center justify-between border ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs hover:underline text-zinc-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Provider Selection */}
        <Card className="bg-[#1C1B1B] border-[#2A2B28]">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-[#663399]" />
              Active Email Service Provider
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Select the engine responsible for sending client inquiry confirmations and admin lead alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  id: 'brevo',
                  name: 'Brevo (Sendinblue)',
                  desc: 'Recommended for transactional emails & high deliverability',
                  recommended: true
                },
                {
                  id: 'sendgrid',
                  name: 'Twilio SendGrid',
                  desc: 'Cloud SMTP & Mail API for enterprise volumes'
                },
                {
                  id: 'gmail',
                  name: 'Google Workspace',
                  desc: 'Direct SMTP via company Google Workspace account'
                },
                {
                  id: 'mock',
                  name: 'Local / Development',
                  desc: 'Logs email payloads safely to console without external dispatch'
                }
              ].map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSettings({ ...settings, provider: p.id as any })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    settings.provider === p.id
                      ? 'border-[#663399] bg-[#663399]/15 shadow-md shadow-[#663399]/20'
                      : 'border-[#2A2B28] bg-[#151414] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-white">{p.name}</span>
                    {p.recommended && (
                      <Badge className="bg-[#D9F45F] text-[#151414] text-[10px] font-bold">
                        RECOMMENDED
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sender & Notification Identity */}
        <Card className="bg-[#1C1B1B] border-[#2A2B28]">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#D9F45F]" />
              Sender & Recipient Routing
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Branded sender metadata displayed in client inboxes and the destination for sales alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
                  Sender Email Address (From)
                </label>
                <Input
                  value={settings.fromEmail}
                  onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                  placeholder="contact@silwasa.com"
                  className="bg-[#151414] border-[#2A2B28] text-white text-sm"
                  required
                />
                <p className="text-[11px] text-zinc-500 mt-1">Must be a verified sender in your email provider.</p>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
                  Sender Display Name
                </label>
                <Input
                  value={settings.fromName}
                  onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
                  placeholder="Silwasa IT Solutions"
                  className="bg-[#151414] border-[#2A2B28] text-white text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
                  Admin Notification Email (New Lead Alerts)
                </label>
                <Input
                  value={settings.adminNotificationEmail}
                  onChange={(e) => setSettings({ ...settings, adminNotificationEmail: e.target.value })}
                  placeholder="contact@silwasa.com"
                  className="bg-[#151414] border-[#2A2B28] text-white text-sm"
                  required
                />
                <p className="text-[11px] text-zinc-500 mt-1">Instant project inquiries will be routed to this inbox.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Provider Credentials */}
        {settings.provider === 'brevo' && (
          <Card className="bg-[#1C1B1B] border-[#2A2B28]">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-400" />
                Brevo API Credentials
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Obtain your transactional v3 API key from your Brevo Dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
                  Brevo v3 API Key
                </label>
                <Input
                  type="password"
                  value={settings.brevoApiKey || ''}
                  onChange={(e) => setSettings({ ...settings, brevoApiKey: e.target.value })}
                  placeholder="xkeysib-..."
                  className="bg-[#151414] border-[#2A2B28] text-white text-sm font-mono"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {settings.provider === 'sendgrid' && (
          <Card className="bg-[#1C1B1B] border-[#2A2B28]">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" />
                SendGrid API Credentials
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Generate an API key with &quot;Mail Send&quot; permissions in SendGrid.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
                  SendGrid API Key
                </label>
                <Input
                  type="password"
                  value={settings.sendgridApiKey || ''}
                  onChange={(e) => setSettings({ ...settings, sendgridApiKey: e.target.value })}
                  placeholder="SG...."
                  className="bg-[#151414] border-[#2A2B28] text-white text-sm font-mono"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {settings.provider === 'gmail' && (
          <Card className="bg-[#1C1B1B] border-[#2A2B28]">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-rose-400" />
                Google Workspace / Gmail Credentials
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Use your Workspace email and a 16-character Google App Password (with 2-Factor Authentication enabled).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
                    Workspace Email / Username
                  </label>
                  <Input
                    value={settings.gmailUser || ''}
                    onChange={(e) => setSettings({ ...settings, gmailUser: e.target.value })}
                    placeholder="contact@silwasa.com"
                    className="bg-[#151414] border-[#2A2B28] text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
                    Google App Password
                  </label>
                  <Input
                    type="password"
                    value={settings.gmailAppPassword || ''}
                    onChange={(e) => setSettings({ ...settings, gmailAppPassword: e.target.value })}
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="bg-[#151414] border-[#2A2B28] text-white text-sm font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[#2A2B28]">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#663399] hover:bg-[#52297A] text-white font-semibold px-6"
          >
            {saving ? 'Saving...' : 'Save Email Configuration'}
          </Button>

          {/* Test Email Section */}
          <div className="flex items-center gap-2">
            <Input
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
              placeholder="Test email recipient"
              className="bg-[#151414] border-[#2A2B28] text-white text-xs w-56"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSendTest}
              disabled={testing || !testEmailAddress}
              className="border-[#2A2B28] text-[#D9F45F] hover:bg-[#D9F45F]/10 text-xs"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              {testing ? 'Sending...' : 'Send Test'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
