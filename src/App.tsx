import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_MAILBOXES, INITIAL_MESSAGES } from './data/dummyData';
import { createMailbox } from './services/api';
import { socketService } from './services/socket';
import Sidebar from './components/Sidebar';
import MailList from './components/MailList';
import MailViewer from './components/MailViewer';
import MailboxSwitcher from './components/MailboxSwitcher';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import type { Mailbox, Message, MessagesMap, ViewState } from './types';
import Header from './components/Header';

export default function App() {
  // Persisted state
  const [mailboxes, setMailboxes] = useLocalStorage<Mailbox[]>('tempmail_mailboxes', INITIAL_MAILBOXES);
  const [messages, setMessages] = useLocalStorage<MessagesMap>('tempmail_messages', INITIAL_MESSAGES);

  // UI state
  const [activeMailboxId, setActiveMailboxId] = useState<string | null>(mailboxes[0]?.id || null);
  const [activeView, setActiveView] = useState<ViewState>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', icon: 'check_circle' });
  // const [notification, setNotification] = useState<string | null>(null);

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
      // setNotification(`Your OTP is <span class="font-mono text-emerald-400">${otp}</span>. Copied to clipboard.`);
    }).catch(() => {
      showToast('Failed to copy', 'error');
    });
  }, [showToast]);

  // Generate new mailbox
  const handleGenerateNew = useCallback(async () => {
    try {
      showToast('Creating new mailbox...', 'sync');
      const data = await createMailbox();

      const newMailbox = {
        id: data.name,
        address: data.email,
        createdAt: Date.now(),
        expiresIn: 86400,
      };
      setMailboxes((prev: Mailbox[]) => [newMailbox, ...prev]);
      setMessages((prev: MessagesMap) => ({ ...prev, [newMailbox.id]: [] }));
      setActiveMailboxId(newMailbox.id);
      setSelectedMessage(null);
      setActiveView('inbox');
      showToast('New mailbox created');
    } catch (error) {
      console.error('Failed to create mailbox:', error);
      showToast('Failed to create mailbox', 'error');
    }
  }, [setMailboxes, setMessages, showToast]);

  const isInitializing = useRef(false);

  // Initialize first mailbox if none exist
  useEffect(() => {
    if (mailboxes.length === 0 && !isInitializing.current) {
      isInitializing.current = true;
      handleGenerateNew().finally(() => {
        isInitializing.current = false;
      });
    }
  }, [mailboxes.length, handleGenerateNew]);

  // Manage socket connection and subscriptions
  useEffect(() => {
    if (!activeMailboxId) return;

    socketService.connect();
    socketService.join(activeMailboxId);

    const handleNewEmail = (emailData: any) => {
      // console.log('New email received:', emailData);

      const emailFrom = emailData.from || '';
      const emailMatch = emailFrom.match(/<([^>]+)>/);

      const newMessage: Message = {
        id: emailData._id || Date.now().toString(),
        from: emailFrom.replace(/<.*>/, '').replace(/"/g, '').trim() || emailFrom,
        fromEmail: emailMatch ? emailMatch[1] : emailFrom,
        to: emailData.to || '',
        subject: emailData.subject || 'No Subject',
        preview: emailData.text ? emailData.text.substring(0, 50) + '...' : '',
        body: emailData.html || emailData.text || '',
        timestamp: new Date().getTime(),
        isUnread: true,
      };

      setMessages((prev: MessagesMap) => {
        const mailboxMessages = prev[activeMailboxId] || [];
        if (mailboxMessages.some((m: Message) => m.id === newMessage.id)) return prev;

        return {
          ...prev,
          [activeMailboxId]: [newMessage, ...mailboxMessages],
        };
      });

      showToast('New email received!', 'mail');
    };

    socketService.onNewEmail(handleNewEmail);

    return () => {
      // Cleanup logic if needed
    };
  }, [activeMailboxId, setMessages, showToast]);

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
      {/* {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )} */}

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
