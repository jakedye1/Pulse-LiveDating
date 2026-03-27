export const FeatureFlags = {
  // Phase toggles
  ENABLE_GROUPS: true,
  ENABLE_FRIENDS: true,
  ENABLE_LIVE_VIDEO: true,
  ENABLE_DATING: true,

  // Monetization
  ENABLE_SUBSCRIPTIONS: true,
  ENABLE_BOOSTS: true,
  ENABLE_SUPER_LIKES: true,
  ENABLE_REWIND: true,

  // Safety & Moderation
  ENABLE_VERIFICATION: true,
  ENABLE_REPORTS: true,
  ENABLE_BLOCKS: true,

  // Social features
  ENABLE_PULSE_SCORE: false, // Feature-flagged
  ENABLE_REFERRALS: false, // Feature-flagged
  ENABLE_WEEKLY_RECAP: false, // Feature-flagged

  // Limits
  DAILY_SWIPE_LIMIT: 100,
  DAILY_SUPER_LIKES: 5,
};

export const AppConfig = {
  APP_NAME: 'Pulse',
  APP_VERSION: '1.0.0',
  MIN_AGE: 18,
  MAX_PHOTOS: 6,
  MAX_BIO_LENGTH: 500,
  MAX_INTERESTS: 5,

  // Distance preferences (miles)
  DISTANCE_OPTIONS: [5, 10, 25, 50, 100, 'any'] as const,
  DEFAULT_DISTANCE: 25,

  // Subscription prices (example)
  SUBSCRIPTION_PRICES: {
    WEEKLY: 4.99,
    MONTHLY: 12.99,
    YEARLY: 99.99,
  },

  // API endpoints
  API_TIMEOUT: 30000, // 30 seconds
};

export type DistanceOption = typeof AppConfig.DISTANCE_OPTIONS[number];
