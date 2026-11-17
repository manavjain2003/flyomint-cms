import React from 'react';

export default function AuthLayout({ title, children }) {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="card w-full max-w-sm space-y-4">
        <h1 className="text-lg font-semibold">{title}</h1>
        {children}
      </div>
    </div>
  );
}
