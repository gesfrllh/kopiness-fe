import Pusher from 'pusher-js';
import api from '@/lib/api';
import { MessageResponseDto, TypingEventDto } from '@/types/chat';

let pusherClient: Pusher | null = null;

export const getPusherClient = (): Pusher | null => {
  if (!pusherClient) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!key || !cluster) return null;

    pusherClient = new Pusher(key, {
      cluster,
      forceTLS: true,
      channelAuthorization: {
        customHandler: async ({ socketId, channelName }, callback) => {
          const chatId = channelName.replace('private-chat-', '');

          try {
            const response = await api.post(`/chats/${chatId}/pusher-auth`, {
              socket_id: socketId,
            });
            callback(null, response.data);
          } catch (error) {
            callback(error as Error, null);
          }
        },
      },
    });
  }
  return pusherClient;
};

type NewMessageCallback = (data: MessageResponseDto) => void;
type MessageReadCallback = (data: { id: string; chatId: string; readAt: string }) => void;
type TypingCallback = (data: TypingEventDto) => void;

export const subscribeToChatChannel = (chatId: string, userId: string) => {
  const client = getPusherClient();
  const channelName = `private-chat-${chatId}`;
  if (!client) {
    return {
      onNewMessage: (_callback: NewMessageCallback) => undefined,
      onMessageRead: (_callback: MessageReadCallback) => undefined,
      onTyping: (_callback: TypingCallback) => undefined,
      unsubscribe: () => undefined,
    };
  }

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
