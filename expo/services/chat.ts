import { ServiceResponse, Conversation, Message } from '@/domain/types';

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    participants: [
      {
        user_id: 'me',
        conversation_id: 'conv_1',
        last_read_at: new Date().toISOString(),
      },
      {
        user_id: 'user_1',
        conversation_id: 'conv_1',
        last_read_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        user: {
            id: 'user_1',
            name: 'Emma',
            email: 'emma@example.com',
            avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            verification_status: 'verified',
            birthdate: '2000-01-01',
        }
      }
    ],
    unread_count: 1,
    is_group: false,
    last_message: {
      id: 'msg_1',
      conversation_id: 'conv_1',
      sender_id: 'user_1',
      content: 'That sounds amazing! When are you free?',
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      type: 'text',
      status: 'read'
    },
  },
];

export interface ChatServiceInterface {
  getConversations(): Promise<ServiceResponse<Conversation[]>>;
  getMessages(conversationId: string, page?: number): Promise<ServiceResponse<Message[]>>;
  sendMessage(conversationId: string, content: string): Promise<ServiceResponse<Message>>;
  markAsRead(conversationId: string): Promise<ServiceResponse<void>>;
  subscribeToMessages(conversationId: string, callback: (message: Message) => void): () => void;
}

export const ChatService: ChatServiceInterface = {
  async getConversations(): Promise<ServiceResponse<Conversation[]>> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { data: MOCK_CONVERSATIONS, error: null };
  },

  async getMessages(conversationId: string, page = 1): Promise<ServiceResponse<Message[]>> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (conversationId === 'conv_1') {
      return {
        data: [
          {
            id: 'msg_0',
            conversation_id: 'conv_1',
            sender_id: 'me',
            content: 'Hey! I saw you like hiking too.',
            created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            type: 'text' as const,
            status: 'read' as const
          },
          {
            id: 'msg_1',
            conversation_id: 'conv_1',
            sender_id: 'user_1',
            content: 'That sounds amazing! When are you free?',
            created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            type: 'text' as const,
            status: 'read' as const
          },
        ].reverse(), // Newest last usually, but depends on UI implementation. Usually APIs return newest first or last depending on cursor. 
        // For GiftedChat or flatlist inverted, we often want newest first (index 0). 
        // Let's assume standard API returning chronological order for now, and UI reverses if needed.
        error: null,
      };
    }
    
    return { data: [], error: null };
  },

  async sendMessage(conversationId: string, content: string): Promise<ServiceResponse<Message>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversation_id: conversationId,
      sender_id: 'me',
      content,
      created_at: new Date().toISOString(),
      type: 'text',
      status: 'sent'
    };
    
    return { data: newMessage, error: null };
  },

  async markAsRead(conversationId: string): Promise<ServiceResponse<void>> {
    // In a real app, call API
    return { data: null, error: null };
  },

  subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    // Mock realtime subscription
    const interval = setInterval(() => {
        // Randomly simulate incoming message
        if (Math.random() > 0.95) {
             const mockMsg: Message = {
                id: `msg_incoming_${Date.now()}`,
                conversation_id: conversationId,
                sender_id: 'user_1',
                content: 'This is a realtime message!',
                created_at: new Date().toISOString(),
                type: 'text',
                status: 'delivered'
            };
            callback(mockMsg);
        }
    }, 5000);

    return () => clearInterval(interval);
  }
};
