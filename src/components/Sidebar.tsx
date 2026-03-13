import type { Mailbox } from '../types';

interface SidebarProps {
  activeMailbox: Mailbox | null;
  onCopyAddress: (address: string) => void;
  onGenerateNew: () => void;
  onRefresh: () => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({ activeMailbox, onCopyAddress, onGenerateNew, onRefresh, onDelete }: SidebarProps) {
  if (!activeMailbox) return null;

  return (
    <section className="p-4 pt-6 flex flex-col items-center space-y-4 animate-fade-in" data-purpose="mailbox-display">
      <div className="w-full space-y-2">
        <h1 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em] text-center">
          Active Mailbox
        </h1>
        <div className="flex items-center gap-2">
          <div className="w-full px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-900/50 flex items-center justify-between group">
            <span className="font-mono text-zinc-200 text-base tracking-tight select-all">
              {activeMailbox.address}
            </span>
            <button
              onClick={() => onCopyAddress(activeMailbox.address)}
              className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
              title="Copy Address"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>content_copy</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
        <button
          onClick={onGenerateNew}
          className="w-full py-3 bg-zinc-100 text-zinc-950 text-sm font-semibold rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-100/5 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
          Generate New Mailbox
        </button>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="flex-1 py-2 px-3 border border-zinc-800 text-zinc-400 text-xs font-medium rounded-md hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2 active:scale-[0.97]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>refresh</span>
            Refresh
          </button>
          <button
            onClick={() => onDelete(activeMailbox.id)}
            className="flex-1 py-2 px-3 border border-zinc-800 text-zinc-400 text-xs font-medium rounded-md hover:bg-zinc-900 hover:text-red-400 hover:border-red-900/50 transition-colors flex items-center justify-center gap-2 active:scale-[0.97]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
            Delete
          </button>
        </div>
      </div>
    </section>
  );
}
