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
  Globe,
  Eye,
  EyeOff,
  RefreshCw
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
  const [showPassword, setShowPassword] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('contact@silwasa.com');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>('/admin/settings/email');
      // Resilient extraction for { success: true, data: { ... } } or direct payload
      const data = res && typeof res === 'object' && 'data' in res && res.data ? res.data : res;
      if (data) {
        setSettings({
          provider: data.provider || 'mock',
          fromEmail: data.fromEmail || 'contact@silwasa.com',
          fromName: data.fromName || 'Silwasa IT Solutions',
          adminNotificationEmail: data.adminNotificationEmail || 'contact@silwasa.com',
          brevoApiKey: data.brevoApiKey || '',
          sendgridApiKey: data.sendgridApiKey || '',
          gmailUser: data.gmailUser || '',
          gmailAppPassword: data.gmailAppPassword || ''
        });
        if (data.adminNotificationEmail) {
          setTestEmailAddress(data.adminNotificationEmail);
        } else if (data.gmailUser) {
          setTestEmailAddress(data.gmailUser);
        }
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
      const payload: EmailSettingsData = {
        provider: settings.provider,
        fromEmail: (settings.fromEmail || 'contact@silwasa.com').trim(),
        fromName: (settings.fromName || 'Silwasa IT Solutions').trim(),
        adminNotificationEmail: (settings.adminNotificationEmail || 'contact@silwasa.com').trim(),
        brevoApiKey: (settings.brevoApiKey || '').trim(),
        sendgridApiKey: (settings.sendgridApiKey || '').trim(),
        gmailUser: (settings.gmailUser || '').trim(),
        gmailAppPassword: (settings.gmailAppPassword || '').trim()
      };

      const res = await apiClient.put<any>('/admin/settings/email', payload);
      const data = res && typeof res === 'object' && 'data' in res && res.data ? res.data : payload;

      setSettings((prev) => ({
        ...prev,
        ...data
      }));

      setNotification({
        type: 'success',
        message: `Email settings & ${settings.provider.toUpperCase()} credentials saved successfully! Your configuration will persist on reload.`
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
      const testPayload = {
        to: testEmailAddress.trim(),
        settings: {
          provider: settings.provider,
          fromEmail: (settings.fromEmail || 'contact@silwasa.com').trim(),
          fromName: (settings.fromName || 'Silwasa IT Solutions').trim(),
          adminNotificationEmail: (settings.adminNotificationEmail || 'contact@silwasa.com').trim(),
          brevoApiKey: (settings.brevoApiKey || '').trim(),
          sendgridApiKey: (settings.sendgridApiKey || '').trim(),
          gmailUser: (settings.gmailUser || '').trim(),
          gmailAppPassword: (settings.gmailAppPassword || '').trim()
        }
      };

      const res = await apiClient.post<any>('/admin/settings/email/test', testPayload);
      const message =
        res?.message ||
        `Test email dispatched to ${testEmailAddress} via ${settings.provider.toUpperCase()}! Please check your inbox and spam folder.`;

      setNotification({
        type: 'success',
        message
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        message:
          err.message ||
          `Failed to dispatch test email via ${settings.provider.toUpperCase()}. Please verify your credentials and network connection.`
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3">
        <RefreshCw className="w-8 h-8 text-[#D9F45F] animate-spin" />
        <p className="text-zinc-400 text-sm">Loading email provider configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Mail className="w-6 h-6 text-[#D9F45F]" />
          Email & SMTP Configuration
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure outgoing transactional email providers (Google Workspace / Gmail, Brevo, SendGrid) for client enquiry auto-replies and instant admin lead alerts.
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
                  id: 'gmail',
                  name: 'Google Workspace / Gmail',
                  desc: 'Direct SMTP via personal @gmail.com or business Google Workspace (using App Password)',
                  highlight: true
                },
                {
                  id: 'brevo',
                  name: 'Brevo (Sendinblue)',
                  desc: 'Recommended for transactional emails & high deliverability'
                },
                {
                  id: 'sendgrid',
                  name: 'Twilio SendGrid',
                  desc: 'Cloud SMTP & Mail API for enterprise volumes'
                },
                {
                  id: 'mock',
                  name: 'Local / Development',
                  desc: 'Logs email payloads safely to server console without external dispatch'
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
                    {p.highlight && (
                      <Badge className="bg-[#D9F45F] text-[#151414] text-[10px] font-bold">
                        ACTIVE
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
                  placeholder="vimaldigiello@gmail.com"
                  className="bg-[#151414] border-[#2A2B28] text-white text-sm"
                  required
                />
                <p className="text-[11px] text-zinc-500 mt-1">Instant project inquiries submitted on the website will be routed to this inbox.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Provider Credentials */}
        {settings.provider === 'gmail' && (
          <Card className="bg-[#1C1B1B] border-[#2A2B28]">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-rose-400" />
                Google Workspace & Gmail Credentials
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Works seamlessly with personal @gmail.com accounts (e.g. vimaldigiello@gmail.com) and Google Workspace business domains using a 16-character Google App Password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
                    Gmail Address / Workspace Email
                  </label>
                  <Input
                    value={settings.gmailUser || ''}
                    onChange={(e) => setSettings({ ...settings, gmailUser: e.target.value })}
                    placeholder="vimaldigiello@gmail.com"
                    className="bg-[#151414] border-[#2A2B28] text-white text-sm"
                    required
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">The Google Account email that generated the App Password.</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-zinc-400">
                      Google App Password (16 characters)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#D9F45F]" />}
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={settings.gmailAppPassword || ''}
                      onChange={(e) => setSettings({ ...settings, gmailAppPassword: e.target.value })}
                      placeholder="xxxx xxxx xxxx xxxx"
                      className="bg-[#151414] border-[#2A2B28] text-white text-sm font-mono pr-10"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">Generated from your Google Account with 2FA enabled. Spaces are stripped automatically.</p>
                </div>
              </div>

              {/* Helpful Guide Box */}
              <div className="bg-[#151414] border border-[#2A2B28] rounded-lg p-3 text-xs text-zinc-400 space-y-2">
                <div className="flex items-center gap-2 text-zinc-200 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#D9F45F]" />
                  <span>How to generate a Google App Password for your Gmail account:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-zinc-400 pl-1 leading-relaxed">
                  <li>Ensure <strong>2-Step Verification (2FA)</strong> is enabled on your Google Account.</li>
                  <li>
                    Go to{' '}
                    <a
                      href="https://myaccount.google.com/apppasswords"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D9F45F] hover:underline inline-flex items-center gap-0.5"
                    >
                      Google Account &gt; Security &gt; App passwords <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Type an app name (such as &quot;Silwasa CMS&quot;) and click <strong>Create</strong>.</li>
                  <li>Copy the 16-letter password shown on screen and paste it into the password box above.</li>
                </ol>
                {settings.gmailUser && settings.fromEmail !== settings.gmailUser && (
                  <div className="pt-1 border-t border-[#2A2B28]/60 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">
                      Recommendation: Set &quot;From Email&quot; to match your Gmail ({settings.gmailUser}) for 100% reliable inbox delivery.
                    </span>
                    <button
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, fromEmail: prev.gmailUser || '' }))}
                      className="text-[11px] text-[#D9F45F] hover:underline font-semibold"
                    >
                      Use Gmail as From Email
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {settings.provider === 'brevo' && (
          <Card className="bg-[#1C1B1B] border-[#2A2B28]">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-400" />
                Brevo API Credentials
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Obtain your transactional v3 API key from your Brevo Dashboard (SMTP &amp; API &gt; API Keys).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-400">
                    Brevo v3 API Key
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-blue-400" />}
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={settings.brevoApiKey || ''}
                  onChange={(e) => setSettings({ ...settings, brevoApiKey: e.target.value })}
                  placeholder="xkeysib-..."
                  className="bg-[#151414] border-[#2A2B28] text-white text-sm font-mono"
                  required
                />
              </div>
              <div className="text-xs text-zinc-500">
                <a
                  href="https://app.brevo.com/settings/keys/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  Open Brevo API Keys Page <ExternalLink className="w-3 h-3" />
                </a>
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
                Generate an API key with &quot;Mail Send&quot; permissions in Twilio SendGrid.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-400">
                    SendGrid API Key
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-purple-400" />}
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={settings.sendgridApiKey || ''}
                  onChange={(e) => setSettings({ ...settings, sendgridApiKey: e.target.value })}
                  placeholder="SG...."
                  className="bg-[#151414] border-[#2A2B28] text-white text-sm font-mono"
                  required
                />
              </div>
              <div className="text-xs text-zinc-500">
                <a
                  href="https://app.sendgrid.com/settings/api_keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline inline-flex items-center gap-1"
                >
                  Open SendGrid API Keys Dashboard <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-[#2A2B28]">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#663399] hover:bg-[#52297A] text-white font-semibold px-6 shadow-md"
          >
            {saving ? 'Saving Configuration...' : 'Save Email Configuration'}
          </Button>

          {/* Real Test Email Section */}
          <div className="flex items-center gap-2">
            <Input
              type="email"
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
              placeholder="Test email recipient address"
              className="bg-[#151414] border-[#2A2B28] text-white text-xs w-64"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSendTest}
              disabled={testing || !testEmailAddress}
              className="border-[#2A2B28] text-[#D9F45F] hover:bg-[#D9F45F]/10 text-xs shrink-0"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              {testing ? 'Sending...' : 'Send Test Email'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
