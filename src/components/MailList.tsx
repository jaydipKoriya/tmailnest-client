import type { Message } from '../types';
import { formatEmailDate } from '../util';

interface MailListProps {
  messages: Message[];
  onSelectMessage: (msg: Message) => void;
}

export default function MailList({ messages, onSelectMessage }: MailListProps) {
  if (!messages || messages.length === 0) {
    return (
      <section className="flex-1 flex flex-col items-center justify-center px-4 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-zinc-600" style={{ fontSize: '32px' }}>inbox</span>
          </div>
          <h3 className="text-sm font-semibold text-zinc-400">No emails yet</h3>
          <p className="text-xs text-zinc-600 max-w-[200px]">
            Emails sent to this address will appear here automatically.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 overflow-y-auto hide-scrollbar" data-purpose="inbox-list">
      <div className="px-4">
        <div className="border-t border-zinc-800">
          <table className="w-full text-left">
            <thead className="hidden">
              <tr>
                <th>From</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {messages.map((msg) => (
                <tr
                  key={msg.id}
                  onClick={() => onSelectMessage(msg)}
                  className="group cursor-pointer hover:bg-zinc-900/40 transition-colors"
                >
                  <td className="py-4 pr-3 flex items-start gap-3">
                    {msg.isUnread ? (
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                    ) : (
                      <div className="w-1.5 h-1.5 shrink-0 mt-2"></div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className={`text-sm truncate ${msg.isUnread ? 'font-semibold text-zinc-100' : 'font-medium text-zinc-400'}`}>
                        {msg.from}
                      </span>
                      <span className={`text-xs truncate ${msg.isUnread ? 'text-zinc-400 font-medium' : 'text-zinc-600'}`}>
                        {msg.subject}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-right whitespace-nowrap align-top">
                    <span className={`text-[10px] font-mono ${msg.isUnread ? 'text-blue-500' : 'text-zinc-600'}`}>
                      {formatEmailDate(msg.timestamp)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
