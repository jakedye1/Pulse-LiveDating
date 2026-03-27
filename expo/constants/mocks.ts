export const MOCK_USERS: Record<string, any> = {
  '1': { 
    id: '1', 
    name: 'Emma', 
    age: 24, 
    bio: 'Late night conversations and spontaneous adventures', 
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    ],
    verification_status: 'verified',
    social_links: {
      instagram: 'emma.adventures',
      x: '@emma_tweets'
    }
  },
  '2': { 
    id: '2', 
    name: 'Sofia', 
    age: 26, 
    bio: 'Artist by day, stargazer by night', 
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
    images: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',
    ],
    verification_status: null,
    social_links: {
        tiktok: '@sofia_art',
        facebook: 'sofia.artist'
    }
  },
  '3': { 
    id: '3', 
    name: 'David', 
    age: 27, 
    bio: 'Adventure seeker', 
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800',
    ],
    verification_status: 'verified',
  },
};
