import type { Message, ViewState } from '../types';

interface HeaderProps {
  activeView: ViewState;
  selectedMessage: Message | null;
  onBack: () => void;
  onSearch?: (query: string) => void;
}

export default function Header({ activeView, selectedMessage, onBack }: HeaderProps) {

  // Show mail viewer header when a message is selected 
  if (activeView === 'viewer' && selectedMessage) {
    return (
      <header className="sticky top-0 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden flex items-center justify-center size-8 rounded-lg hover:bg-zinc-900 text-zinc-400 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-base font-semibold text-zinc-50 truncate flex-1 min-w-0">
            {selectedMessage.subject}
          </h1>
        </div>
        <div className="flex items-center">
          <button className="flex items-center justify-center size-9 rounded-lg hover:bg-zinc-900 text-zinc-400 transition-colors">
            <span className="material-symbols-outlined">delete</span>{/* TODO: Implement delete functionality */}
          </button>
        </div>
      </header>
    );
  }

  // Default inbox header with search
  return (
    <header className="relative h-14 border-b border-zinc-800 flex items-center px-4 shrink-0 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <img src="/web-app-manifest-512x512.png" alt="TMail Nest Logo" className="w-8 h-8" />
          <h1 className="text-zinc-100 font-bold text-2xl">
            TMail Nest
          </h1>
        </div>
      </div>
    </header>
  );
}
