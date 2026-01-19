import React from 'react';

// Minimal loading spinner
export const Spinner = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg 
    className={`animate-spin ${className}`} 
    viewBox="0 0 24 24" 
    fill="none"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="3"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Button with loading state
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  children?: React.ReactNode;
};

export const Button = ({ 
  loading = false, 
  variant = 'primary', 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) => {
  const baseStyles = 'relative flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-white text-zinc-900 hover:bg-zinc-200',
    secondary: 'border border-zinc-700 text-zinc-300 hover:bg-zinc-800',
    ghost: 'text-zinc-500 hover:text-white hover:bg-zinc-800',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <Spinner className="w-4 h-4 absolute" />
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};

// Success checkmark animation
export const SuccessCheck = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg 
    className={`text-emerald-400 ${className}`} 
    viewBox="0 0 24 24" 
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path 
      className="animate-[checkDraw_0.3s_ease-out_forwards]"
      d="M20 6L9 17l-5-5"
      style={{
        strokeDasharray: 24,
        strokeDashoffset: 24,
        animation: 'checkDraw 0.3s ease-out forwards'
      }}
    />
  </svg>
);

// Inline status indicator
export const StatusDot = ({ 
  status 
}: { 
  status: 'idle' | 'pending' | 'success' | 'error' 
}) => {
  const colors = {
    idle: 'bg-zinc-600',
    pending: 'bg-amber-400 animate-pulse',
    success: 'bg-emerald-400',
    error: 'bg-rose-400',
  };

  return (
    <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors[status]}`} />
  );
};

// Optimistic value display - shows pending state
export const OptimisticValue = ({ 
  value, 
  pendingValue, 
  isPending,
  className = ''
}: { 
  value: string | number;
  pendingValue?: string | number;
  isPending: boolean;
  className?: string;
}) => (
  <span className={`inline-flex items-center gap-1.5 ${className}`}>
    {isPending ? (
      <>
        <span className="opacity-50 line-through text-xs">{value}</span>
        <span className="text-cyan-400">{pendingValue}</span>
        <Spinner className="w-3 h-3 text-cyan-400" />
      </>
    ) : (
      <span>{value}</span>
    )}
  </span>
);