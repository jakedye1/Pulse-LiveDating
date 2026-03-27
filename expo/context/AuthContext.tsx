import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { User } from '@/domain/types';
import { AuthService } from '@/services/auth';
import { UserService } from '@/services/user';

import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  onboardingComplete: boolean;
  consentComplete: boolean;
  login: (email: string) => Promise<void>;
  signup: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  completeConsent: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
};

export const [AuthProvider, useAuth] = createContextHook(
  () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const [consentComplete, setConsentComplete] = useState(false);

    // Keep trpc mutations for blocking/unblocking if we want to keep that logic, 
    // or we can move it to a service. 
    // The previous implementation used trpc, but we are moving to services.
    // Let's implement block/unblock via UserService or local update for now to satisfy the interface.
    // But since we removed trpc hooks from here, we'll simulate it.

    useEffect(() => {
      checkAuth();
    }, []);

    const checkAuth = async () => {
      console.log('[AuthContext] Checking auth state...');
      try {
        const { data: sessionUser } = await AuthService.getSession();
        const storedConsent = await AsyncStorage.getItem('consent_complete');
        
        if (sessionUser) {
          setUser(sessionUser);
          if (sessionUser.onboarding_complete) {
            setOnboardingComplete(true);
          }
          if (storedConsent === 'true') {
            setConsentComplete(true);
          }
        }
      } catch (e) {
        console.error('Failed to load auth state', e);
      } finally {
        setIsLoading(false);
      }
    };

    const updateProfile = async (updates: Partial<User>) => {
      if (!user) return;
      
      const { data: updatedUser } = await UserService.updateProfile(updates);
      if (updatedUser) {
        setUser(updatedUser);
      }
    };

    const login = async (email: string) => {
      setIsLoading(true);
      const { data: user } = await AuthService.signIn(email);
      
      if (user) {
        setUser(user);
        if (user.onboarding_complete) {
          setOnboardingComplete(true);
        } else {
          setOnboardingComplete(false);
        }
        // Assume consent is needed on new login unless stored
        const storedConsent = await AsyncStorage.getItem('consent_complete');
        setConsentComplete(storedConsent === 'true');
      }
      setIsLoading(false);
    };

    const signup = async (email: string, name: string) => {
      setIsLoading(true);
      const { data: user } = await AuthService.signUp(email, name);
      
      if (user) {
        setUser(user);
        setOnboardingComplete(false);
        setConsentComplete(false);
      }
      setIsLoading(false);
    };

    const logout = async () => {
      await AuthService.signOut();
      setUser(null);
      setOnboardingComplete(false);
      setConsentComplete(false);
      router.replace('/');
    };

    const completeOnboarding = async () => {
      if (user) {
        const { data: updatedUser } = await UserService.updateProfile({ onboarding_complete: true });
        if (updatedUser) {
           setUser(updatedUser);
        }
      }
      setOnboardingComplete(true);
    };

    const completeConsent = async () => {
      setConsentComplete(true);
      await AsyncStorage.setItem('consent_complete', 'true');
      
      if (user) {
         // Optionally update user profile with acceptance timestamp
         await updateProfile({ accepted_terms_version: '1.0.0', accepted_legal_at: new Date().toISOString() });
      }
    };

    const blockUser = async (userId: string) => {
      if (!user) return;
      const currentBlocked = user.blocked_users || [];
      if (!currentBlocked.includes(userId)) {
        const newBlocked = [...currentBlocked, userId];
        await updateProfile({ blocked_users: newBlocked });
      }
    };

    const unblockUser = async (userId: string) => {
      if (!user) return;
      const currentBlocked = user.blocked_users || [];
      const newBlocked = currentBlocked.filter(id => id !== userId);
      await updateProfile({ blocked_users: newBlocked });
    };

    return {
      user,
      isLoading,
      onboardingComplete,
      consentComplete,
      login,
      signup,
      logout,
      completeOnboarding,
      completeConsent,
      updateProfile,
      blockUser,
      unblockUser,
    };
  },
  {
    user: null,
    isLoading: true,
    onboardingComplete: false,
    consentComplete: false,
    login: async () => {},
    signup: async () => {},
    logout: async () => {},
    completeOnboarding: async () => {},
    completeConsent: async () => {},
    updateProfile: async () => {},
    blockUser: async () => {},
    unblockUser: async () => {},
  }
);
