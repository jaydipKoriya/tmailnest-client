import { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_MAILBOXES, INITIAL_MESSAGES, generateAddress, generateMailboxId } from './data/dummyData';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MailList from './components/MailList';
import MailViewer from './components/MailViewer';
import MailboxSwitcher from './components/MailboxSwitcher';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import Notification from './components/Notification';
import type { Mailbox, Message, MessagesMap, ViewState } from './types';

export default function App() {
  // Persisted state
  const [mailboxes, setMailboxes] = useLocalStorage<Mailbox[]>('tempmail_mailboxes', INITIAL_MAILBOXES);
  const [messages, setMessages] = useLocalStorage<MessagesMap>('tempmail_messages', INITIAL_MESSAGES);

  // UI state
  const [activeMailboxId, setActiveMailboxId] = useState<string | null>(mailboxes[0]?.id || null);
  const [activeView, setActiveView] = useState<ViewState>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', icon: 'check_circle' });
  const [notification, setNotification] = useState<string | null>(null);

  // Derived state
  const activeMailbox = mailboxes.find((mb) => mb.id === activeMailboxId) || null;
  const currentMessages = activeMailboxId ? messages[activeMailboxId] || [] : [];

  // Toast helper
  const showToast = useCallback((message: string, icon: string = 'check_circle') => {
    setToast({ show: true, message, icon });
  }, []);

  const hideToast = useCallback(() => {
    setToast({ show: false, message: '', icon: 'check_circle' });
  }, []);

  // Copy email address
  const handleCopyAddress = useCallback((address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      showToast('Address Copied');
    }).catch(() => {
      showToast('Failed to copy', 'error');
    });
  }, [showToast]);

  // Copy OTP
  const handleCopyOtp = useCallback((otp: string) => {
    const cleanOtp = otp.replace(/-/g, '');
    navigator.clipboard.writeText(cleanOtp).then(() => {
      showToast('OTP Copied');
      setNotification(`Your OTP is <span class="font-mono text-emerald-400">${otp}</span>. Copied to clipboard.`);
    }).catch(() => {
      showToast('Failed to copy', 'error');
    });
  }, [showToast]);

  // Generate new mailbox
  const handleGenerateNew = useCallback(() => {
    const newMailbox = {
      id: generateMailboxId(),
      address: generateAddress(),
      createdAt: Date.now(),
      expiresIn: 86400,
    };
    setMailboxes((prev: Mailbox[]) => [newMailbox, ...prev]);
    setMessages((prev: MessagesMap) => ({ ...prev, [newMailbox.id]: [] }));
    setActiveMailboxId(newMailbox.id);
    setSelectedMessage(null);
    setActiveView('inbox');
    showToast('New mailbox created');
  }, [setMailboxes, setMessages, showToast]);

  // Delete mailbox
  const handleDeleteMailbox = useCallback((id: string) => {
    if (mailboxes.length <= 1) {
      showToast('Cannot delete last mailbox', 'warning');
      return;
    }
    setMailboxes((prev: Mailbox[]) => prev.filter((mb) => mb.id !== id));
    setMessages((prev: MessagesMap) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (activeMailboxId === id) {
      const remaining = mailboxes.filter((mb) => mb.id !== id);
      setActiveMailboxId(remaining[0]?.id || null);
      setSelectedMessage(null);
      setActiveView('inbox');
    }
    showToast('Mailbox deleted');
  }, [mailboxes, activeMailboxId, setMailboxes, setMessages, showToast]);

  // Switch mailbox
  const handleSwitchMailbox = useCallback((id: string) => {
    setActiveMailboxId(id);
    setSelectedMessage(null);
    setActiveView('inbox');
  }, []);

  // Select message
  const handleSelectMessage = useCallback((msg: Message) => {
    // Mark as read
    if (msg.isUnread && activeMailboxId) {
      setMessages((prev: MessagesMap) => ({
        ...prev,
        [activeMailboxId]: prev[activeMailboxId].map((m: Message) =>
          m.id === msg.id ? { ...m, isUnread: false } : m
        ),
      }));
    }
    setSelectedMessage({ ...msg, isUnread: false });
    setActiveView('viewer');

    // Auto-copy OTP if present
    if (msg.otp) {
      handleCopyOtp(msg.otp);
    }
  }, [activeMailboxId, setMessages, handleCopyOtp]);

  // Back to inbox
  const handleBack = useCallback(() => {
    setSelectedMessage(null);
    setActiveView('inbox');
  }, []);

  // Refresh (simulate)
  const handleRefresh = useCallback(() => {
    showToast('Inbox refreshed');
  }, [showToast]);

  // Change view
  const handleChangeView = useCallback((view: ViewState) => {
    if (view === 'inbox') {
      setSelectedMessage(null);
    }
    setActiveView(view);
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-zinc-950">
      {/* System Notification */}
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <Header
        activeView={activeView}
        selectedMessage={selectedMessage}
        onBack={handleBack}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeView === 'inbox' && (
          <>
            <Sidebar
              activeMailbox={activeMailbox}
              onCopyAddress={handleCopyAddress}
              onGenerateNew={handleGenerateNew}
              onRefresh={handleRefresh}
              onDelete={handleDeleteMailbox}
            />
            <MailList
              messages={currentMessages}
              onSelectMessage={handleSelectMessage}
            />
          </>
        )}

        {activeView === 'viewer' && (
          <MailViewer
            message={selectedMessage}
          />
        )}

        {activeView === 'history' && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-zinc-600" style={{ fontSize: '32px' }}>history</span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-400">History</h3>
              <p className="text-xs text-zinc-600 max-w-[200px]">
                Your expired mailboxes and past emails will appear here.
              </p>
            </div>
          </div>
        )}

        {activeView === 'settings' && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-zinc-600" style={{ fontSize: '32px' }}>settings</span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-400">Settings</h3>
              <p className="text-xs text-zinc-600 max-w-[200px]">
                Customize your TempMail experience. Coming soon.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Mailbox Switcher (only in inbox view) */}
      {activeView === 'inbox' && (
        <MailboxSwitcher
          mailboxes={mailboxes}
          activeMailboxId={activeMailboxId}
          onSwitchMailbox={handleSwitchMailbox}
          onAddMailbox={handleGenerateNew}
        />
      )}

      {/* Bottom Navigation (in viewer / history / settings views) */}
      {activeView !== 'inbox' && (
        <BottomNav
          activeView={activeView}
          onChangeView={handleChangeView}
        />
      )}

      {/* Toast */}
      <Toast
        show={toast.show}
        message={toast.message}
        icon={toast.icon}
        onClose={hideToast}
      />
    </div>
  );
}
