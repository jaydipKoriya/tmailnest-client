export interface Mailbox {
  id: string;
  address: string;
  createdAt: number;
  expiresIn: number;
}

export interface Message {
  id: string;
  from: string;
  fromEmail: string;
  to: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: number;
  isUnread: boolean;
  otp?: string;
}

export interface MessagesMap {
  [mailboxId: string]: Message[];
}

export type ViewState = 'inbox' | 'viewer';
