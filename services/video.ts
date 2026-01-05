import { ServiceResponse, CallSession } from '@/domain/types';

export interface VideoServiceInterface {
  fetchAccessToken(roomName: string, identity: string): Promise<ServiceResponse<string>>;
  joinRoom(roomName: string, token: string): Promise<ServiceResponse<CallSession>>;
  leaveRoom(callId: string): Promise<ServiceResponse<void>>;
  
  // Device controls
  toggleMute(muted: boolean): Promise<void>;
  toggleCamera(enabled: boolean): Promise<void>;
  switchCamera(): Promise<void>;
}

export const VideoService: VideoServiceInterface = {
  async fetchAccessToken(roomName: string, identity: string): Promise<ServiceResponse<string>> {
      // Simulate backend call to get Twilio token
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { data: 'mock_twilio_access_token_' + Date.now(), error: null };
  },

  async joinRoom(roomName: string, token: string): Promise<ServiceResponse<CallSession>> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate connection
    
    return {
      data: {
        id: `call_${Date.now()}`,
        room_name: roomName,
        status: 'in_progress',
        created_by: 'me',
        created_at: new Date().toISOString(),
        participants: [
            {
                user_id: 'me',
                call_id: `call_${Date.now()}`,
                status: 'connected',
                joined_at: new Date().toISOString(),
                identity: 'me'
            },
             {
                user_id: 'other_user',
                call_id: `call_${Date.now()}`,
                status: 'connected',
                joined_at: new Date().toISOString(),
                identity: 'other_user',
                user: {
                    id: 'other_user',
                    name: 'Emma',
                    email: 'emma@example.com',
                    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
                }
            }
        ]
      },
      error: null,
    };
  },

  async leaveRoom(callId: string): Promise<ServiceResponse<void>> {
    return { data: null, error: null };
  },
  
  async toggleMute(muted: boolean): Promise<void> {
      // Mock interaction with Twilio SDK
      console.log('Mute toggled:', muted);
  },
  
  async toggleCamera(enabled: boolean): Promise<void> {
      console.log('Camera toggled:', enabled);
  },
  
  async switchCamera(): Promise<void> {
      console.log('Camera switched');
  }
};
