import type { Message } from '../types';

interface MailViewerProps {
  message: Message | null;
}

export default function MailViewer({ message }: MailViewerProps) {
  if (!message) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-zinc-600" style={{ fontSize: '32px' }}>mail</span>
          </div>
          <h3 className="text-sm font-semibold text-zinc-400">Select an email</h3>
          <p className="text-xs text-zinc-600 max-w-[200px]">
            Click on an email from your inbox to view its content here.
          </p>
        </div>
      </main>
    );
  }

  const dateFormat = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const formattedDate = dateFormat.format(new Date(message.timestampMs));

  return (
    <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 animate-slide-up">
      {/* Metadata Block */}
      <div className="space-y-3 px-2">
        <div className="flex items-start gap-4">
          <span className="text-sm font-medium text-zinc-500 w-12 pt-0.5 shrink-0">From:</span>
          <span className="text-sm font-mono text-zinc-300 break-all">{message.fromEmail}</span>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-sm font-medium text-zinc-500 w-12 pt-0.5 shrink-0">To:</span>
          <span className="text-sm font-mono text-zinc-300 break-all">you@tempmail.dev</span>
        </div>
        <div className="flex items-start gap-4 border-b border-zinc-900 pb-4">
          <span className="text-sm font-medium text-zinc-500 w-12 pt-0.5 shrink-0">Date:</span>
          <span className="text-sm font-mono text-zinc-300">{formattedDate}</span>
        </div>
      </div>

      {/* Email Body */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/50">
            <div className="size-10 bg-zinc-800 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-zinc-400">domain</span>
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-100">{message.from}</p>
              <p className="text-xs text-zinc-500">{message.fromEmail}</p>
            </div>
          </div>

          <div
            className="space-y-4 text-sm leading-relaxed text-zinc-200 [&_a]:text-indigo-400 [&_a]:underline [&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_ul]:space-y-1 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: message.body }}
          />
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-16"></div>
    </main>
  );
}
