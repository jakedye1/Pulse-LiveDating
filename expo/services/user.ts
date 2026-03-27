import { ServiceResponse, User } from '@/domain/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserServiceInterface {
  getMe(): Promise<ServiceResponse<User>>;
  updateProfile(updates: Partial<User>): Promise<ServiceResponse<User>>;
  getUser(userId: string): Promise<ServiceResponse<User>>;
}

export const UserService: UserServiceInterface = {
  async getMe(): Promise<ServiceResponse<User>> {
    try {
      const json = await AsyncStorage.getItem('auth_user');
      if (!json) {
        return { data: null, error: { message: 'Not authenticated' } };
      }
      try {
        const user = JSON.parse(json);
        return { data: user, error: null };
      } catch (parseError) {
        console.error('Failed to parse user data, clearing corrupted data:', parseError);
        await AsyncStorage.removeItem('auth_user');
        return { data: null, error: { message: 'Session corrupted, please log in again' } };
      }
    } catch {
      return { data: null, error: { message: 'Failed to load profile' } };
    }
  },

  async updateProfile(updates: Partial<User>): Promise<ServiceResponse<User>> {
    try {
      const json = await AsyncStorage.getItem('auth_user');
      if (!json) {
        return { data: null, error: { message: 'Not authenticated' } };
      }
      try {
        const currentUser = JSON.parse(json);
        const updatedUser = { ...currentUser, ...updates };
        
        await AsyncStorage.setItem('auth_user', JSON.stringify(updatedUser));
        return { data: updatedUser, error: null };
      } catch (parseError) {
        console.error('Failed to parse user data during update:', parseError);
        await AsyncStorage.removeItem('auth_user');
        return { data: null, error: { message: 'Session corrupted, please log in again' } };
      }
    } catch {
      return { data: null, error: { message: 'Failed to update profile' } };
    }
  },

  async getUser(userId: string): Promise<ServiceResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data for other users
    return {
      data: {
        id: userId,
        name: 'Mock User',
        email: 'mock@example.com',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        bio: 'This is a mock user profile fetched from the service layer.',
        interests: ['Hiking', 'Coding'],
        verification_status: 'verified',
        distance_preference: 10,
        privacy_settings: {
          public_profile: true,
          appear_in_discover: true,
          allow_message_requests: true,
          show_online_status: true,
          allow_live_video_invites: true,
        },
        notification_settings: {
          matches: true,
          live_invites: true,
          messages: true,
        }
      },
      error: null
    };
  }
};
