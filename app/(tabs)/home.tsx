import React, { useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Users, Video, MessageCircle, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import NotificationBell from '@/components/NotificationBell';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import { useAuth } from "@/context/AuthContext";
import { useAppMode, AppMode } from '@/context/AppModeContext';

const MOCK_NEARBY = [
  { id: '1', name: 'Sarah', age: 23, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
  { id: '2', name: 'Jessica', age: 25, image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop' },
  { id: '3', name: 'David', age: 27, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
];

const MOCK_GROUPS = [
  { id: '1', name: 'Late Night Talks', members: 124, active: true, image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=400&fit=crop' },
  { id: '2', name: 'Music Lovers', members: 89, active: true, image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
  { id: '3', name: 'Gaming Squad', members: 56, active: false, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop' },
];

const MOCK_FRIENDS = [
  { id: '1', name: 'Alex', status: 'online', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop' },
  { id: '2', name: 'Jordan', status: 'live', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop' },
  { id: '3', name: 'Taylor', status: 'offline', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { mode, setMode } = useAppMode();
  const { user } = useAuth();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Filter content based on blocked users
  const filteredNearby = MOCK_NEARBY.filter(u => !user?.blocked_users?.includes(u.id));
  const filteredFriends = MOCK_FRIENDS.filter(f => !user?.blocked_users?.includes(f.id));
  // Assuming groups might also need filtering if we had creator ID or member checking, 
  // but for now we just filter user lists.

  const switchMode = (newMode: AppMode) => {
    if (mode === newMode) return;
    
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();

    // Slight delay to switch content while invisible
    setTimeout(() => {
      setMode(newMode);
    }, 150);
  };

  const handleGoLive = () => {
    // Navigate to Live tab with autoStart
    router.push({ pathname: '/(tabs)/live', params: { autoStart: 'true' } });
  };

  const handleStartMatching = () => {
    // Navigate to Discover tab (Swipe UI)
    router.push('/(tabs)/discover');
  };

  const renderContent = () => {
    switch (mode) {
      case 'dating':
        return (
          <View style={styles.sectionContainer}>
            {/* Featured Card */}
            <Pressable style={styles.featuredCard} onPress={handleStartMatching}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1621784563330-caee0b138a00?w=800&fit=crop' }} 
                style={styles.featuredImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.featuredOverlay}
              >
                <View>
                  <Text style={styles.featuredTitle}>Find your vibe</Text>
                  <Text style={styles.featuredSubtitle}>Meet people near you who match your energy.</Text>
                  <View style={styles.featuredButtons}>
                    <Pressable style={styles.primaryBtn} onPress={handleStartMatching}>
                      <Text style={styles.primaryBtnText}>Start Matching</Text>
                    </Pressable>
                    <Pressable style={styles.secondaryBtn} onPress={handleGoLive}>
                      <Video size={20} color={Colors.softWhite} />
                      <Text style={styles.secondaryBtnText}>Go Live</Text>
                    </Pressable>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>

            {/* Preview Cards */}
            <Text style={styles.sectionTitle}>People near you</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {filteredNearby.map((user) => (
                <Pressable key={user.id} style={styles.smallCard} onPress={() => router.push(`/users/${user.id}`)}>
                  <Image source={{ uri: user.image }} style={styles.smallCardImage} contentFit="cover" />
                  <View style={styles.onlineBadge} />
                  <Text style={styles.smallCardName}>{user.name}, {user.age}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        );
      case 'groups':
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Trending Groups</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {MOCK_GROUPS.map((group) => (
                <Pressable key={group.id} style={styles.groupCard}>
                  <Image source={{ uri: group.image }} style={styles.groupCardImage} contentFit="cover" />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.groupOverlay}>
                    <Text style={styles.groupTitle}>{group.name}</Text>
                    <View style={styles.groupMeta}>
                      <View style={[styles.statusDot, group.active ? styles.statusOnline : styles.statusOffline]} />
                      <Text style={styles.groupMembers}>{group.members} members</Text>
                    </View>
                  </LinearGradient>
                </Pressable>
              ))}
            </ScrollView>
            
            <Pressable style={styles.primaryBtn} onPress={handleGoLive}>
              <Video size={20} color={Colors.softWhite} />
              <Text style={styles.primaryBtnText}>Go Live in Groups</Text>
            </Pressable>

            <Pressable style={styles.createGroupBtn}>
              <View style={styles.createGroupIcon}>
                <Users color={Colors.voidBlack} size={24} />
              </View>
              <Text style={styles.createGroupText}>Create a new group</Text>
            </Pressable>
          </View>
        );
      case 'friends':
        return (
          <View style={styles.sectionContainer}>
            <View style={styles.friendsHeader}>
              <Text style={styles.sectionTitle}>Friends Activity</Text>
              <Pressable>
                <Text style={styles.seeAllText}>See all</Text>
              </Pressable>
            </View>
            
            {filteredFriends.map((friend) => (
              <View key={friend.id} style={styles.friendRow}>
                <View style={styles.friendAvatarContainer}>
                  <Image source={{ uri: friend.image }} style={styles.friendAvatar} contentFit="cover" />
                  {friend.status === 'live' && <View style={styles.liveBadge}><Text style={styles.liveText}>LIVE</Text></View>}
                  {friend.status === 'online' && <View style={styles.onlineStatusBadge} />}
                </View>
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <Text style={styles.friendStatus}>
                    {friend.status === 'live' ? 'Streaming now' : friend.status === 'online' ? 'Online' : 'Offline'}
                  </Text>
                </View>
                <Pressable style={styles.friendActionBtn}>
                  <MessageCircle size={20} color={Colors.softWhite} />
                </Pressable>
              </View>
            ))}

            <Pressable style={styles.inviteBtn}>
              <Text style={styles.inviteBtnText}>Invite Friends</Text>
            </Pressable>

            <Pressable style={styles.primaryBtn} onPress={handleGoLive}>
              <Video size={20} color={Colors.softWhite} />
              <Text style={styles.primaryBtnText}>Start Live Friend Match</Text>
            </Pressable>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>pulse</Text>
          <View style={styles.headerRight}>
            <NotificationBell />
            <Pressable style={styles.profileBtn} onPress={() => router.push('/(tabs)/profile')}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' }} 
                style={styles.profileImage}
                contentFit="cover"
              />
            </Pressable>
          </View>
        </View>

        {/* Mode Selector */}
        <View style={styles.modeSelectorContainer}>
          <Text style={styles.greeting}>How do you want to connect?</Text>
          <View style={styles.modeSelector}>
            <Pressable 
              style={[styles.modeBtn, mode === 'dating' && styles.modeBtnActive]} 
              onPress={() => switchMode('dating')}
            >
              <Heart size={18} color={mode === 'dating' ? Colors.softWhite : Colors.textSecondary} fill={mode === 'dating' ? Colors.pulseRed : 'transparent'} />
              <Text style={[styles.modeText, mode === 'dating' && styles.modeTextActive]}>Dating</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.modeBtn, mode === 'groups' && styles.modeBtnActive]} 
              onPress={() => switchMode('groups')}
            >
              <Users size={18} color={mode === 'groups' ? Colors.softWhite : Colors.textSecondary} />
              <Text style={[styles.modeText, mode === 'groups' && styles.modeTextActive]}>Groups</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.modeBtn, mode === 'friends' && styles.modeBtnActive]} 
              onPress={() => switchMode('friends')}
            >
              <Sparkles size={18} color={mode === 'friends' ? Colors.softWhite : Colors.textSecondary} />
              <Text style={[styles.modeText, mode === 'friends' && styles.modeTextActive]}>Friends</Text>
            </Pressable>
          </View>
        </View>

        {/* Dynamic Content */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {renderContent()}
        </Animated.View>

      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    ...Typography.h2,
    color: Colors.softWhite,
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  modeSelectorContainer: {
    marginBottom: Spacing.xl,
  },
  greeting: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.full,
    padding: 4,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Layout.borderRadius.full,
    gap: 6,
  },
  modeBtnActive: {
    backgroundColor: Colors.darkSecondary,
    ...Layout.shadow.sm,
  },
  modeText: {
    ...Typography.callout,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  modeTextActive: {
    color: Colors.softWhite,
    fontWeight: '600',
  },
  sectionContainer: {
    gap: Spacing.lg,
  },
  featuredCard: {
    height: 400,
    borderRadius: Layout.borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.signalGray,
    ...Layout.shadow.md,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: Spacing.lg,
  },
  featuredTitle: {
    ...Typography.h1,
    color: Colors.softWhite,
    marginBottom: Spacing.xs,
  },
  featuredSubtitle: {
    ...Typography.body,
    color: Colors.textPrimary,
    opacity: 0.9,
    marginBottom: Spacing.lg,
  },
  featuredButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: Colors.pulseRed,
    paddingVertical: 14,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  secondaryBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
  },
  horizontalScroll: {
    gap: Spacing.md,
    paddingRight: Spacing.lg,
  },
  smallCard: {
    width: 120,
    gap: Spacing.xs,
  },
  smallCardImage: {
    width: 120,
    height: 160,
    borderRadius: Layout.borderRadius.lg,
    backgroundColor: Colors.signalGray,
  },
  onlineBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
    borderWidth: 1.5,
    borderColor: Colors.voidBlack,
  },
  smallCardName: {
    ...Typography.subhead,
    color: Colors.softWhite,
    fontWeight: '600',
  },
  groupCard: {
    width: 280,
    height: 180,
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.signalGray,
  },
  groupCardImage: {
    width: '100%',
    height: '100%',
  },
  groupOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    justifyContent: 'flex-end',
    height: '60%',
  },
  groupTitle: {
    ...Typography.h3,
    fontSize: 20,
    color: Colors.softWhite,
    marginBottom: 4,
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusOnline: {
    backgroundColor: Colors.success,
  },
  statusOffline: {
    backgroundColor: Colors.textTertiary,
  },
  groupMembers: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  createGroupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.softWhite,
    paddingVertical: Spacing.md,
    borderRadius: Layout.borderRadius.full,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  createGroupIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createGroupText: {
    ...Typography.bodyBold,
    color: Colors.voidBlack,
  },
  friendsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  seeAllText: {
    ...Typography.subhead,
    color: Colors.pulseRed,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  friendAvatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.signalGray,
  },
  liveBadge: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    backgroundColor: Colors.pulseRed,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  liveText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: Colors.softWhite,
  },
  onlineStatusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.voidBlack,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  friendStatus: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  friendActionBtn: {
    padding: Spacing.sm,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.full,
  },
  inviteBtn: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  inviteBtnText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },

});
