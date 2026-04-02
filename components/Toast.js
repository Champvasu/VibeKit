import { useState, useCallback, createContext, useContext, useRef } from 'react';
import styles from './Toast.module.css';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

const ICONS = {
  success: '✓',
  error:   '✕',
  warning: '!',
  info:    'i',
};

let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id]);
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3800) => {
    const id = ++nextId;
    setToasts(prev => [...prev.slice(-4), { id, message, type }]); // cap at 5
    timers.current[id] = setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className={styles.container} aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
            <span className={styles.icon}>{ICONS[t.type] || 'i'}</span>
            <span className={styles.message}>{t.message}</span>
            <button className={styles.close} onClick={() => dismiss(t.id)} aria-label="Dismiss">✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
