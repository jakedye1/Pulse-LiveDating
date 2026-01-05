import { StyleSheet, View, Text, Dimensions, Animated, PanResponder, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useRef, useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { X, Heart, Star, BadgeCheck } from "lucide-react-native";
import { useRouter } from "expo-router";

import NotificationBell from "@/components/NotificationBell";
import Colors from "@/constants/colors";
import Typography from "@/constants/typography";
import Spacing from "@/constants/spacing";
import Layout from "@/constants/layout";
import { useAuth } from "@/context/AuthContext";
import { trpc } from "@/lib/trpc";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 120;

interface Profile {
  id: string;
  name: string;
  age: number;
  distance: number;
  bio: string;
  images: string[];
  interests: string[];
  isVerified: boolean;
  verification_status?: 'verified' | 'unverified' | null;
  gender: string;
}

const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Emma',
    age: 24,
    distance: 2,
    bio: 'Late night conversations and spontaneous adventures',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800'
    ],
    interests: ['Photography', 'Travel', 'Coffee'],
    isVerified: true,
    verification_status: 'verified',
    gender: 'Women',
  },
  {
    id: '2',
    name: 'Sofia',
    age: 26,
    distance: 5,
    bio: 'Artist by day, stargazer by night',
    images: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800'
    ],
    interests: ['Art', 'Music', 'Hiking'],
    isVerified: false,
    verification_status: null,
    gender: 'Women',
  },
  {
    id: '3',
    name: 'Olivia',
    age: 23,
    distance: 3,
    bio: 'Building things and breaking routines',
    images: ['https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800'],
    interests: ['Tech', 'Fitness', 'Design'],
    isVerified: true,
    verification_status: 'verified',
    gender: 'Women',
  },
  {
    id: '4',
    name: 'James',
    age: 28,
    distance: 12,
    bio: 'Always looking for the next best coffee spot',
    images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800'],
    interests: ['Coffee', 'Tech', 'Running'],
    isVerified: true,
    verification_status: 'verified',
    gender: 'Men',
  },
  {
    id: '5',
    name: 'Alex',
    age: 25,
    distance: 45,
    bio: 'Just here for the vibes',
    images: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800'],
    interests: ['Music', 'Festivals', 'Surfing'],
    isVerified: false,
    verification_status: null,
    gender: 'Men',
  },
];

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function DiscoverScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const position = useRef(new Animated.ValueXY()).current;
  
  // Fetch preferences
  const { data: preferences, isLoading } = trpc.preferences.get.useQuery();
  const checkLimitQuery = trpc.limits.checkMatchLimit.useQuery();
  const recordMatchMutation = trpc.limits.recordMatch.useMutation({
    onSuccess: () => {
      checkLimitQuery.refetch();
    }
  });

  useEffect(() => {
    if (isLoading) return;
    
    if (!preferences) {
      setProfiles(MOCK_PROFILES);
      return;
    }

    let filtered = MOCK_PROFILES;

    // Filter by blocked users
    if (user?.blocked_users) {
      filtered = filtered.filter(p => !user.blocked_users?.includes(p.id));
    }

    // Filter by age range
    filtered = filtered.filter(p => 
      p.age >= preferences.ageRange.min && p.age <= preferences.ageRange.max
    );

    // Filter by distance
    filtered = filtered.filter(p => p.distance <= preferences.distance);

    // Filter by gender (Interested In)
    if (!preferences.interestedIn.includes('Everyone')) {
      filtered = filtered.filter(p => preferences.interestedIn.includes(p.gender));
    }

    // Filter by Verified Only
    if (preferences.showVerifiedOnly) {
      filtered = filtered.filter(p => p.isVerified);
    }
    
    // Filter by Photos Only (All mock profiles have photos, but logic is here)
    if (preferences.showWithPhotosOnly) {
      filtered = filtered.filter(p => p.images.length > 0);
    }

    // If "Appear in Dating" is OFF, effectively show no one or show a message?
    // Requirement says: "users with appear_in_dating = false" should be excluded from OTHER people's feeds.
    // But it doesn't explicitly say the user CANNOT see others. 
    // However, usually if you hide yourself, you can't see others (Tinder style).
    // Let's assume user can still see others for now unless specified.
    
    setProfiles(filtered);
    setCurrentIndex(0); // Reset index when filters change to show new set from beginning (or handle smarter)
    setCurrentImageIndex(0);

  }, [user?.blocked_users, preferences, isLoading]);

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        const isTap = Math.abs(gesture.dx) < 10 && Math.abs(gesture.dy) < 10;

        if (isTap) {
          const currentProfile = profiles[currentIndex];
          if (currentProfile && currentProfile.images.length > 1) {
            setCurrentImageIndex(prev => (prev + 1) % currentProfile.images.length);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          // Reset spring to ensure card stays centered if it moved slightly
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        } else if (gesture.dx > SWIPE_THRESHOLD) {
          // Check limits on swipe right
          if (checkLimitQuery.data && !checkLimitQuery.data.allowed) {
             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
             Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }).start();
            router.push('/daily-limit-reached');
            return;
          }
          recordMatchMutation.mutate();
          handleSwipeComplete('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          handleSwipeComplete('left');
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setCurrentIndex(currentIndex + 1);
      setCurrentImageIndex(0);
      position.setValue({ x: 0, y: 0 });
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleAction = (action: 'pass' | 'like' | 'superlike') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (action === 'pass') {
      handleSwipeComplete('left');
    } else if (action === 'like' || action === 'superlike') {
      // Check limits before allowing like
      if (checkLimitQuery.data && !checkLimitQuery.data.allowed) {
        // Limit reached
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        router.push('/daily-limit-reached');
        return;
      }

      // Proceed with like
      handleSwipeComplete('right');
      
      // Record match/like (Mock: assuming 50% chance of match for demo, or just count it towards limit)
      // The prompt says "Max 7 new matches". 
      // For this demo, let's assume every like is a match to demonstrate the limit, 
      // or we just call recordMatch which increments the counter.
      recordMatchMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.pulseRed} />
      </View>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No more profiles</Text>
          <Text style={styles.emptySubtitle}>Check back later for new connections</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.logo}>pulse</Text>
        <View style={styles.headerRight}>
          <NotificationBell />
        </View>
      </View>

      <View style={styles.cardContainer}>
        {profiles.slice(currentIndex, currentIndex + 2).reverse().map((profile, index) => {
          const isTopCard = index === 1;
          const cardStyle = isTopCard
            ? {
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { rotate },
                ],
              }
            : {
                transform: [{ scale: 0.95 }],
              };

          return (
            <Animated.View
              key={profile.id}
              style={[styles.card, cardStyle]}
              {...(isTopCard ? panResponder.panHandlers : {})}
            >
              <View style={styles.imageContainer}>
                <AnimatedImage
                  source={{ uri: isTopCard ? profile.images[currentImageIndex] : profile.images[0] }}
                  style={styles.profileImage}
                  contentFit="cover"
                  transition={200}
                />
                {isTopCard && (
                  <>
                    <Animated.View style={[styles.overlay, styles.likeOverlay, { opacity: likeOpacity }]}>
                      <View style={styles.overlayBadge}>
                      <Text style={styles.overlayText}>LIKE</Text>
                      </View>
                    </Animated.View>
                    <Animated.View style={[styles.overlay, styles.nopeOverlay, { opacity: nopeOpacity }]}>
                      <View style={styles.overlayBadge}>
                        <Text style={styles.overlayText}>NOPE</Text>
                      </View>
                    </Animated.View>
                  </>
                )}
              </View>
              <View style={styles.cardContent}>
                <View style={styles.profileInfo}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.profileName}>{profile.name}, {profile.age}</Text>
                    {(profile.verification_status === 'verified' || profile.isVerified) && (
                      <View style={styles.badgeContainer}>
                         <BadgeCheck size={18} color={Colors.softWhite} fill={Colors.pulseRed} />
                         <Text style={styles.badgeText}>Verified</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.profileDistance}>{profile.distance} miles away</Text>
                </View>
                <Text style={styles.profileBio}>{profile.bio}</Text>
                <View style={styles.interests}>
                  {profile.interests.map((interest, idx) => (
                    <View key={idx} style={styles.interestTag}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Animated.View>
          );
        })}
      </View>

      <View style={styles.actions}>
        <View style={styles.actionButton} onTouchStart={() => handleAction('pass')}>
          <X color={Colors.pulseRed} size={32} />
        </View>
        <View style={styles.actionButtonLarge} onTouchStart={() => handleAction('like')}>
          <Heart color={Colors.softWhite} size={36} />
        </View>
        <View style={styles.actionButton} onTouchStart={() => handleAction('superlike')}>
          <Star color={Colors.accentRed} size={28} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    width: 40, // Balance the right side
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  logo: {
    ...Typography.h2,
    color: Colors.softWhite,
    letterSpacing: 2,
    fontWeight: '300' as const,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 32,
    height: SCREEN_HEIGHT * 0.65,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.xl,
    ...Layout.shadow.lg,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeOverlay: {
    backgroundColor: 'rgba(48, 209, 88, 0.1)',
  },
  nopeOverlay: {
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
  },
  overlayBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 3,
    borderRadius: Layout.borderRadius.md,
  },
  overlayText: {
    ...Typography.h2,
    fontWeight: '700' as const,
    color: Colors.softWhite,
  },
  cardContent: {
    padding: Spacing.lg,
  },
  profileInfo: {
    marginBottom: Spacing.sm,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  profileName: {
    ...Typography.h3,
    color: Colors.softWhite,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 45, 45, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.full,
    gap: 4,
  },
  badgeText: {
    ...Typography.captionBold,
    color: Colors.softWhite,
    fontSize: 12,
  },
  profileDistance: {
    ...Typography.callout,
    color: Colors.textSecondary,
  },
  profileBio: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  interestTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.darkTertiary,
    borderRadius: Layout.borderRadius.full,
  },
  interestText: {
    ...Typography.caption,
    color: Colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.xl,
    paddingBottom: 40,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.signalGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonLarge: {
    width: 72,
    height: 72,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.pulseRed,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadow.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
