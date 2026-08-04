import Pusher from 'pusher-js';
import { MessageResponseDto, TypingEventDto } from '@/types/chat';

let pusherClient: Pusher | null = null;

export const getPusherClient = (): Pusher => {
  if (!pusherClient) {
    pusherClient = new Pusher('e347e9a9fc2a90ec3bf4', {
      cluster: 'ap1',
      forceTLS: true,
    });
  }
  return pusherClient;
};

type NewMessageCallback = (data: MessageResponseDto) => void;
type MessageReadCallback = (data: { id: string; chatId: string; readAt: string }) => void;
type TypingCallback = (data: TypingEventDto) => void;

export const subscribeToChatChannel = (chatId: string, userId: string) => {
  const client = getPusherClient();
  const channelName = `chat-${chatId}`;

  const channel = client.subscribe(channelName);

  return {
    channel,
    onNewMessage: (callback: NewMessageCallback) => {
      channel.bind('new-message', (data: MessageResponseDto) => {
        if (data.senderId !== userId) {
          callback(data);
        }
      });
    },
    onMessageRead: (callback: MessageReadCallback) => {
      channel.bind('message-read', callback);
    },
    onTyping: (callback: TypingCallback) => {
      channel.bind('typing', (data: TypingEventDto) => {
        if (data.senderId !== userId) {
          callback(data);
        }
      });
    },
    unsubscribe: () => {
      client.unsubscribe(channelName);
    },
  };
};

export const disconnectPusher = () => {
  if (pusherClient) {
    pusherClient.disconnect();
    pusherClient = null;
  }
};
