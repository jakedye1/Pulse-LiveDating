export const Env = {
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  
  // Feature flags
  ENABLE_MOCK_DATA: true,
};
