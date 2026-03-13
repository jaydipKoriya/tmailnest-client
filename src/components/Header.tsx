import { useState } from 'react';
import type { Message, ViewState } from '../types';

interface HeaderProps {
  activeView: ViewState;
  selectedMessage: Message | null;
  onBack: () => void;
  onSearch?: (query: string) => void;
}

export default function Header({ activeView, selectedMessage, onBack, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Show mail viewer header when a message is selected
  if (activeView === 'viewer' && selectedMessage) {
    return (
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center size-8 rounded-lg hover:bg-zinc-900 text-zinc-400 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-base font-semibold text-zinc-50 truncate max-w-[180px]">
            {selectedMessage.subject}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center size-9 rounded-lg hover:bg-zinc-900 text-zinc-400 transition-colors">
            <span className="material-symbols-outlined">mark_email_unread</span>
          </button>
          <button className="flex items-center justify-center size-9 rounded-lg hover:bg-zinc-900 text-zinc-400 transition-colors">
            <span className="material-symbols-outlined">delete</span>
          </button>
          {selectedMessage.otp && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedMessage.otp?.replace('-', '') || '');
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-600/20"
            >
              Copy OTP
            </button>
          )}
        </div>
      </header>
    );
  }

  // Default inbox header with search
  return (
    <header className="h-14 border-b border-zinc-800 flex items-center px-4 shrink-0 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex-1 flex items-center">
        <div className="w-6 h-6 bg-zinc-700 rounded mr-3 flex items-center justify-center shrink-0">
          <div className="w-3 h-3 border-2 border-zinc-300 rounded-sm"></div>
        </div>
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <input
            className="w-full bg-zinc-900 border-none rounded-md py-1.5 pl-10 pr-3 text-sm text-zinc-300 focus:ring-1 focus:ring-zinc-700 placeholder-zinc-600 outline-none"
            placeholder="Search or jump to... (⌘K)"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
          />
        </div>
      </div>
    </header>
  );
}
