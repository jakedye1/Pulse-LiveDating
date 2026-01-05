import { ServiceResponse, User, Match } from '@/domain/types';

const MOCK_NEARBY_USERS: User[] = [
  {
    id: 'deck_1',
    name: 'Sarah',
    email: 'sarah@example.com',
    birthdate: '1998-05-12', // approx 25
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Love adventure and coffee.',
    interests: ['Travel', 'Coffee', 'Music'],
    verification_status: 'verified',
  },
  {
    id: 'deck_2',
    name: 'Jessica',
    email: 'jess@example.com',
    birthdate: '1996-03-10', // approx 27
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    bio: 'Looking for someone to hike with.',
    interests: ['Hiking', 'Dogs'],
    verification_status: 'unverified',
  },
  {
    id: 'deck_3',
    name: 'David',
    email: 'dave@example.com',
    birthdate: '1995-11-20', // approx 28
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Tech enthusiast and gamer.',
    interests: ['Gaming', 'Tech', 'Sci-Fi'],
    verification_status: 'verified',
  },
];

export interface MatchServiceInterface {
  getDeck(filters?: any): Promise<ServiceResponse<User[]>>;
  like(userId: string): Promise<ServiceResponse<boolean>>; // Returns true if it's a match
  pass(userId: string): Promise<ServiceResponse<void>>;
  getMatches(): Promise<ServiceResponse<Match[]>>;
}

export const MatchService: MatchServiceInterface = {
  async getDeck(filters?: any): Promise<ServiceResponse<User[]>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: MOCK_NEARBY_USERS, error: null };
  },

  async like(userId: string): Promise<ServiceResponse<boolean>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Randomly match for demo purposes
    const isMatch = Math.random() > 0.7;
    return { data: isMatch, error: null };
  },

  async pass(userId: string): Promise<ServiceResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { data: null, error: null };
  },

  async getMatches(): Promise<ServiceResponse<Match[]>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { 
      data: [
        {
          id: 'match_1',
          user_id: 'me',
          matched_user_id: 'deck_1',
          created_at: new Date().toISOString(),
          matched_user: MOCK_NEARBY_USERS[0],
        }
      ], 
      error: null 
    };
  }
};
