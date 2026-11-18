import React from 'react';
import Icon from '../../components/ui/Icon.jsx';

/** Flight arc between two airport codes: the one illustration of the product. */
function FlightArc() {
  return (
    <svg viewBox="0 0 420 220" fill="none" className="w-full max-w-md" aria-hidden="true">
      <path d="M44 168C120 24 300 24 376 148" stroke="#f5a524" strokeWidth="2.5" strokeDasharray="1 9" strokeLinecap="round" />
      <circle cx="44" cy="168" r="7" fill="#fff" />
      <circle cx="376" cy="148" r="7" fill="#f5a524" />
      <path d="M204 52l24 9-24 9 5-9z" fill="#fff" />
      <text x="26" y="198" fill="#fff" fontSize="17" fontWeight="800" fontFamily="Manrope, sans-serif">DEL</text>
      <text x="350" y="178" fill="#fff" fontSize="17" fontWeight="800" fontFamily="Manrope, sans-serif">BOM</text>
    </svg>
  );
}

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-horizon text-navy"><Icon name="plane" /></span>
          <span className="text-lg font-extrabold">Flight CMS</span>
        </div>
        <div className="space-y-8">
          <FlightArc />
          <div className="max-w-md space-y-3">
            <h2 className="text-3xl font-extrabold leading-tight">Keep every route, fare and offer up to date.</h2>
            <p className="text-slate-300">Edit pages, publish offers and answer enquiries from one place.</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">Need access? Ask your administrator to add you as a user.</p>
      </div>

      <div className="grid place-items-center px-6 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
