import React, { createContext, useCallback, useContext, useState } from 'react';
import Icon from '../components/ui/Icon.jsx';

const ToastContext = createContext(() => {});
const VISIBLE_MS = 4000;

/** Short confirmation or error messages that appear after an action and fade away. */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((type, message) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, type, message }]);
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), VISIBLE_MS);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="fixed bottom-5 right-5 z-[60] space-y-2" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="flex max-w-sm animate-toast-in items-start gap-3 rounded-lg bg-navy px-4 py-3 text-sm text-white shadow-lg">
            <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${toast.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
              <Icon name={toast.type === 'error' ? 'x' : 'check'} className="h-3 w-3" />
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
