import { ServiceResponse, User } from '@/domain/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_VERSION = '2.0';
const AUTH_VERSION_KEY = 'auth_version';

const MOCK_USER: User = {
  id: 'user_123',
  email: 'user@example.com',
  name: 'Pulse User',
  avatar_url: '',
  verification_status: 'unverified',
  onboarding_complete: false,
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
  },
  interests: [],
  mode: undefined,
};

export interface AuthServiceInterface {
  signIn(email: string, password?: string): Promise<ServiceResponse<User>>;
  signUp(identifier: string, name: string, password?: string): Promise<ServiceResponse<User>>;
  signOut(): Promise<ServiceResponse<void>>;
  resetPassword(email: string): Promise<ServiceResponse<void>>;
  getSession(): Promise<ServiceResponse<User>>;
  clearSession(): Promise<void>;
}

export const AuthService: AuthServiceInterface = {
  async signIn(email: string, password?: string): Promise<ServiceResponse<User>> {
    // MOCK: Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success
    const user = { ...MOCK_USER, email };
    await AsyncStorage.setItem('auth_user', JSON.stringify(user));
    return { data: user, error: null };
  },

  async signUp(identifier: string, name: string, password?: string): Promise<ServiceResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if identifier is email or phone
    const isEmail = identifier.includes('@');
    
    const newUser: User = {
      ...MOCK_USER,
      id: `user_${Date.now()}`,
      email: isEmail ? identifier : '', // If phone, email is empty initially
      name,
      onboarding_complete: false,
      verification_status: 'unverified',
    };
    
    // If phone, we could store it in a phone field if User type had it, 
    // but for now we just mock the creation.
    
    await AsyncStorage.setItem('auth_user', JSON.stringify(newUser));
    return { data: newUser, error: null };
  },

  async signOut(): Promise<ServiceResponse<void>> {
    await AsyncStorage.removeItem('auth_user');
    // Also clear other session data if needed
    return { data: null, error: null };
  },

  async resetPassword(email: string): Promise<ServiceResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: null, error: null };
  },

  async getSession(): Promise<ServiceResponse<User>> {
    try {
      const savedVersion = await AsyncStorage.getItem(AUTH_VERSION_KEY);
      if (savedVersion !== AUTH_VERSION) {
        console.log('[AuthService] Version mismatch, clearing old session data');
        await this.clearSession();
        await AsyncStorage.setItem(AUTH_VERSION_KEY, AUTH_VERSION);
        return { data: null, error: null };
      }

      const json = await AsyncStorage.getItem('auth_user');
      if (!json) {
        console.log('[AuthService] No cached user found');
        return { data: null, error: null };
      }
      try {
        const user = JSON.parse(json);
        console.log('[AuthService] Loaded cached user:', { id: user.id, onboarding_complete: user.onboarding_complete });
        return { data: user, error: null };
      } catch (parseError) {
        console.error('Failed to parse user data, clearing corrupted session:', parseError);
        await AsyncStorage.removeItem('auth_user');
        return { data: null, error: null };
      }
    } catch {
      return { data: null, error: { message: 'Failed to retrieve session' } };
    }
  },

  async clearSession(): Promise<void> {
    console.log('[AuthService] Clearing all session data');
    await AsyncStorage.removeItem('auth_user');
    await AsyncStorage.removeItem('consent_complete');
  }
};
