import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  icon?: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, icon = 'check_circle', show, onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show && !visible) return null;

  return (
    <div className={`fixed bottom-24 right-4 z-50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="bg-zinc-800/90 backdrop-blur text-zinc-100 px-4 py-2.5 rounded-lg border border-zinc-700 shadow-xl flex items-center gap-2">
        <span className="material-symbols-outlined text-emerald-400 text-lg">{icon}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
