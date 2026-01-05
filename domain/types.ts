export type User = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  photos?: string[]; // Profile photo gallery
  bio?: string;
  birthdate?: string; // ISO date string
  gender?: 'man' | 'woman' | 'nonbinary';
  interests?: string[];
  
  // Preferences
  distance_preference?: number | 'any';
  interested_in?: ('men' | 'women' | 'nonbinary' | 'everyone')[];
  mode?: 'dating' | 'groups' | 'friends';
  
  // Settings
  privacy_settings?: PrivacySettings;
  notification_settings?: NotificationSettings;
  
  // Status
  verification_status?: 'verified' | 'unverified' | 'pending' | 'rejected' | null;
  verification_submitted_at?: string | null;
  verification_last_error?: string | null;
  onboarding_complete?: boolean;
  
  subscription_status?: 'free' | 'active' | null;
  subscription_plan?: 'weekly' | 'monthly' | 'annual' | null;
  
  // Legal
  accepted_terms_version?: string;
  accepted_privacy_version?: string;
  accepted_legal_at?: string;
  
  blocked_users?: string[];
  blocked_contacts?: string[];

  // Religion
  religion?: string | null;
  religion_preferences?: string[] | null;
  religion_filter_enabled?: boolean;

  // Social Links
  social_links?: {
    x?: string | null;
    instagram?: string | null;
    tiktok?: string | null;
    facebook?: string | null;
  };

  // Age Verification
  age_confirmed?: boolean;
  age_confirmed_at?: string;
};

export type PrivacySettings = {
  public_profile: boolean;
  appear_in_discover: boolean;
  allow_message_requests: boolean;
  show_online_status: boolean;
  allow_live_video_invites: boolean;
};

export type NotificationSettings = {
  matches: boolean;
  live_invites: boolean;
  messages: boolean;
};

export type Profile = User; // For now profile is same as user, but can be a subset

export type Match = {
  id: string;
  user_id: string;
  matched_user_id: string;
  created_at: string;
  matched_user?: Profile; // Expanded
};

export type Conversation = {
  id: string;
  created_at: string;
  updated_at: string;
  participants: Participant[];
  last_message?: Message;
  unread_count: number;
  is_group: boolean;
  group_name?: string;
  group_image?: string;
};

export type Participant = {
  user_id: string;
  conversation_id: string;
  last_read_at: string;
  user?: Profile; // Joined
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string | null;
  type: 'text' | 'image' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'; // For UI state
};

export type CallSession = {
  id: string;
  room_name: string;
  status: 'waiting' | 'in_progress' | 'ended';
  created_by: string;
  created_at: string;
  ended_at?: string;
  participants: CallParticipant[];
};

export type CallParticipant = {
  user_id: string;
  call_id: string;
  status: 'connected' | 'disconnected' | 'declined';
  joined_at: string;
  left_at?: string;
  identity: string; // Twilio identity
  user?: Profile;
};


export type Group = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  members_count: number;
  is_active: boolean;
  created_at: string;
  creator_id: string;
};

export type ServiceResponse<T> = {
  data: T | null;
  error: { message: string; code?: string } | null;
};
