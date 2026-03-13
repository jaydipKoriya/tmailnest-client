import { useEffect, useState } from 'react';
import type { Mailbox } from '../types';

interface MailboxCardProps {
  mailbox: Mailbox;
  isActive: boolean;
  onClick: (id: string) => void;
}

function MailboxCard({ mailbox, isActive, onClick }: MailboxCardProps) {
  const [timeLeft, setTimeLeft] = useState(mailbox.expiresIn);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev: number) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft > 0]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const formatted = [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');

  const isWarning = timeLeft < 3600;
  const isExpired = timeLeft <= 0;
  const username = mailbox.address.split('@')[0];

  const dotColor = isActive
    ? 'bg-green-500'
    : isExpired
      ? 'bg-red-500'
      : isWarning
        ? 'bg-orange-500'
        : 'bg-zinc-600';

  return (
    <div
      onClick={() => onClick(mailbox.id)}
      className={`flex-shrink-0 w-32 h-12 rounded-md p-2 flex flex-col justify-center relative cursor-pointer transition-colors ${
        isActive
          ? 'bg-zinc-800/40 border border-zinc-700'
          : 'bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700'
      }`}
    >
      <span className={`text-[10px] font-medium truncate ${isActive ? 'text-zinc-200' : 'text-zinc-500'}`}>
        {username}
      </span>
      <div className="flex items-center gap-1">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor} ${isWarning && !isExpired ? 'animate-pulse-subtle' : ''}`}></div>
        <span className={`text-[9px] font-mono ${isActive ? 'text-zinc-500' : 'text-zinc-600'}`}>
          {formatted}
        </span>
      </div>
      {isActive && (
        <div className="absolute -top-1.5 -right-1.5 px-1 bg-zinc-100 rounded text-[8px] font-bold text-zinc-950 border border-zinc-950">
          Active
        </div>
      )}
    </div>
  );
}

interface MailboxSwitcherProps {
  mailboxes: Mailbox[];
  activeMailboxId: string | null;
  onSwitchMailbox: (id: string) => void;
  onAddMailbox: () => void;
}

export default function MailboxSwitcher({ mailboxes, activeMailboxId, onSwitchMailbox, onAddMailbox }: MailboxSwitcherProps) {
  return (
    <nav
      className="h-20 bg-zinc-950 border-t border-zinc-800 px-4 flex items-center gap-3 overflow-x-auto hide-scrollbar shrink-0"
      data-purpose="mailbox-switcher"
    >
      {mailboxes.map((mb) => (
        <MailboxCard
          key={mb.id}
          mailbox={mb}
          isActive={mb.id === activeMailboxId}
          onClick={onSwitchMailbox}
        />
      ))}
      <button
        onClick={onAddMailbox}
        className="flex-shrink-0 w-12 h-12 border border-dashed border-zinc-800 rounded-md flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:border-zinc-600 transition-all"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </nav>
  );
}
