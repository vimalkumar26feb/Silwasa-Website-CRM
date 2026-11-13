import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'accent' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#663399]/20 text-[#975dd1] border-[#663399]/40',
    success: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40',
    warning: 'bg-amber-950/40 text-amber-400 border-amber-800/40',
    destructive: 'bg-red-950/40 text-red-400 border-red-800/40',
    accent: 'bg-[#D9F45F]/15 text-[#D9F45F] border-[#D9F45F]/30',
    outline: 'bg-transparent text-white/70 border-[#2A2B28]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide uppercase',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
