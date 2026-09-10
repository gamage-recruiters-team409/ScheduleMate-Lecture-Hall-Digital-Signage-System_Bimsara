import type { ReactNode } from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string };
type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode; hint?: string };
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string };

const labelCls = 'block text-xs font-600 text-slate-600 mb-1.5 uppercase tracking-wide';
const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-colors';
const errCls = 'border-red-300 focus:border-red-500 focus:ring-red-500/15';

export function FormInput({ label, hint, error, className = '', ...props }: InputProps) {
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      <input {...props} className={`${inputCls} ${error ? errCls : ''}`} />
      {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function FormSelect({ label, children, hint, className = '', ...props }: SelectProps) {
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      <select {...props} className={`${inputCls} cursor-pointer`}>
        {children}
      </select>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function FormTextarea({ label, hint, className = '', ...props }: TextareaProps) {
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      <textarea {...props} className={`${inputCls} resize-none`} />
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-700 uppercase tracking-widest text-slate-400 mb-3">{title}</h3>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}
