import { io, Socket } from 'socket.io-client';
import { API_URL } from '../config/env';


class SocketService {
  private socket: Socket | null = null;
  private currentMailbox: string | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(API_URL);

      this.socket.on('connect', () => {
        // console.log('Socket connected:', this.socket?.id);
        // Rejoin if disconnected and we had an active mailbox
        if (this.currentMailbox) {
          this.join(this.currentMailbox);
        }
      });

      this.socket.on('disconnect', () => {
        // console.log('Socket disconnected');
      });
    }
    return this.socket;
  }

  join(mailboxId: string) {
    this.currentMailbox = mailboxId;
    if (this.socket) {
      // console.log('Emitting join for mailbox:', mailboxId);
      this.socket.emit('join', mailboxId);
    }
  }

  onNewEmail(callback: (emailData: any) => void) {
    if (this.socket) {
      this.socket.off('newEmail');
      this.socket.on('newEmail', (data) => {
        // console.log('Socket received newEmail event on frontend:', data);
        callback(data);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentMailbox = null;
    }
  }
}

export const socketService = new SocketService();
