import type { ViewState } from '../types';

interface BottomNavProps {
  activeView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export default function BottomNav({ activeView, onChangeView }: BottomNavProps) {
  const tabs: Array<{ id: ViewState; icon: string; label: string; filled: boolean }> = [
    { id: 'inbox', icon: 'inbox', label: 'Inbox', filled: false },
    { id: 'viewer', icon: 'mail', label: 'View', filled: true },
  ];

  return (
    <nav className="sticky bottom-0 border-t border-zinc-800 bg-zinc-950 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChangeView(tab.id)}
            className={`flex flex-col items-center p-2 transition-colors ${
              activeView === tab.id ? 'text-primary' : 'text-zinc-500 hover:text-zinc-400'
            }`}
          >
            <span
              className={`material-symbols-outlined ${activeView === tab.id && tab.filled ? 'filled' : ''}`}
            >
              {tab.icon}
            </span>
            <span className="text-[10px] mt-1 uppercase font-bold tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
