import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/index';

function Input({ className, type, inputSize = 'default', ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={inputSize}
      className={cn(
        'border-input data-[placeholder]:text-muted-foreground',
        'focus-visible:border-ring focus-visible:ring-ring/50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        'dark:bg-input/30 dark:hover:bg-input/50',
        'flex w-full items-center justify-between gap-2 rounded-sm border bg-transparent px-3 py-2 text-sm',
        'whitespace-nowrap outline-none transition-[color,box-shadow] focus-visible:ring-1',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[size=default]:h-10 data-[size=sm]:h-9',
        'tracking-wide dark:placeholder:text-slate-300',
        className,
      )}
      {...props}
    />
  );
}

export { Input };

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  inputSize?: 'sm' | 'default';
};
export type { InputProps };
