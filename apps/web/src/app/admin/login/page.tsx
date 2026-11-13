'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@silwasa/validation';
import { z } from 'zod';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    const result = await login(data.email, data.password);
    if (result.success) {
      router.push('/admin');
    } else {
      setServerError(result.error || 'Failed to authenticate. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#151414] text-white flex flex-col justify-center items-center p-4 sm:p-6 relative">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#663399]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Return to website link */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center text-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-white/50 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Silwasa Website
        </Link>
        <span className="text-[10px] uppercase font-mono tracking-wider text-[#D9F45F]">
          Secure Gateway
        </span>
      </div>

      <Card className="w-full max-w-md bg-[#1C1B1B]/90 backdrop-blur-md border-[#2A2B28] shadow-2xl relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#663399] to-[#975dd1] mx-auto flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-[#663399]/40 mb-3">
            S
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-white">
            Silwasa CMS Portal
          </CardTitle>
          <CardDescription className="text-xs text-white/50">
            Enter your administrative credentials to access the console
          </CardDescription>
        </CardHeader>

        <CardContent>
          {serverError && (
            <div className="mb-5 p-3 rounded-lg bg-red-950/40 border border-red-800/50 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                label="Admin Email"
                type="email"
                placeholder="admin@silwasa.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
                  Password
                </label>
                <Link
                  href="/admin/forgot-password"
                  className="text-xs text-[#D9F45F] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Sign In to Console
            </Button>
          </form>

          {/* Quick Help Box */}
          <div className="mt-6 pt-5 border-t border-[#2A2B28] text-center">
            <p className="text-[11px] text-white/40">
              Default bootstrap credentials: <br />
              <code className="text-[#D9F45F] font-mono">admin@silwasa.com</code> / <code className="text-[#D9F45F] font-mono">SilwasaAdmin2026!</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
