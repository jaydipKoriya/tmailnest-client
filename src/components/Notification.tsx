import { useState } from 'react';

interface NotificationProps {
  message: string | null;
  onClose?: () => void;
}

export default function Notification({ message, onClose }: NotificationProps) {
  const [visible, setVisible] = useState(true);

  if (!visible || !message) return null;

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-slide-down">
      <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-xl p-3 shadow-2xl flex items-center gap-3 ring-1 ring-white/10">
        <div className="bg-primary/20 p-2 rounded-lg">
          <span className="material-symbols-outlined text-primary text-xl">shield_person</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">TempMail</p>
          <p className="text-sm text-zinc-100 truncate" dangerouslySetInnerHTML={{ __html: message }} />
        </div>
        <button
          onClick={handleClose}
          className="text-zinc-500 hover:text-zinc-300 shrink-0"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
}
