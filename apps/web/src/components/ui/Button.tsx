import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#151414] disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-[#663399] hover:bg-[#522580] text-white focus:ring-[#975dd1]',
      secondary:
        'bg-[#1C1B1B] hover:bg-[#252424] text-white border border-[#2A2B28] focus:ring-[#663399]',
      accent:
        'bg-[#D9F45F] hover:bg-[#cbf033] text-black font-semibold focus:ring-[#D9F45F]',
      outline:
        'border border-[#2A2B28] hover:border-[#663399] bg-transparent text-white hover:bg-[#663399]/10 focus:ring-[#663399]',
      ghost:
        'bg-transparent hover:bg-white/5 text-white/80 hover:text-white focus:ring-white/20',
      destructive:
        'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-6 py-2.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
