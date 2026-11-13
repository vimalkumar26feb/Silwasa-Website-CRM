'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotPasswordSchema } from '@silwasa/validation';
import { z } from 'zod';
import { apiClient } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      await apiClient('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      // Always show success message to prevent user enumeration
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#151414] text-white flex flex-col justify-center items-center p-4 sm:p-6">
      <Card className="w-full max-w-md bg-[#1C1B1B] border-[#2A2B28] shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-xl font-bold text-white">Reset Admin Password</CardTitle>
          <CardDescription className="text-xs text-white/50">
            Enter your registered admin email address to receive password reset instructions
          </CardDescription>
        </CardHeader>

        <CardContent>
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#D9F45F] mx-auto animate-bounce" />
              <p className="text-sm text-white font-medium">Instructions Dispatched</p>
              <p className="text-xs text-white/60">
                If an administrator account is associated with this email, a reset link has been queued.
              </p>
              <Link href="/admin/login">
                <Button variant="outline" size="sm" className="mt-4">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Admin Email"
                type="email"
                placeholder="admin@silwasa.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
              >
                Send Reset Link
              </Button>

              <div className="text-center pt-3">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
