import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { Settings, Camera, Shield, Heart, Star, BadgeCheck } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { router, Link } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import Colors from "@/constants/colors";
import Typography from "@/constants/typography";
import Spacing from "@/constants/spacing";
import Layout from "@/constants/layout";

export default function ProfileScreen() {
  const { user } = useAuth();

  const handleOptionPress = (option: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log(`${option} pressed`);

    if (option === 'Settings' || option === 'Edit Profile' || option === 'Edit Photo') {
      router.push('/edit-profile');
    }
    
    if (option === 'Preferences') {
      router.push('/dating-preferences');
    }

    if (option === 'Verification') {
      router.push('/verification');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>pulse</Text>
        <Pressable 
          style={styles.settingsButton}
          onPress={() => handleOptionPress('Settings')}
        >
          <Settings color={Colors.textPrimary} size={24} />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={user?.avatar_url ? { uri: user.avatar_url } : require('@/assets/images/adaptive-icon.png')}
              style={styles.avatar}
              contentFit="cover"
            />
            <Pressable 
              style={styles.editAvatarButton}
              onPress={() => handleOptionPress('Edit Photo')}
            >
              <Camera color={Colors.softWhite} size={20} />
            </Pressable>
          </View>
          
          <View style={styles.nameContainer}>
            <Text style={styles.profileName}>{user?.name || 'Pulse User'}, 25</Text>
            {user?.verification_status === 'verified' && (
              <View style={styles.badgeContainer}>
                <BadgeCheck size={20} color={Colors.softWhite} fill={Colors.pulseRed} />
                <Text style={styles.badgeText}>Verified</Text>
              </View>
            )}
          </View>
          <Text style={styles.profileBio}>Adventure seeker | Coffee enthusiast</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>48</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Good</Text>
              <Text style={styles.statLabel}>Standing</Text>
            </View>
          </View>
          
          <View style={styles.planInfo}>
            <Text style={styles.planInfoText}>Free Plan: 5 live calls • 7 matches/day • 5mi radius</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>
          
          <Link href="/paywall" asChild>
            <Pressable 
              style={styles.premiumCard}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <View style={styles.premiumContent}>
                <View style={styles.premiumIcon}>
                  <Star color={Colors.pulseRed} size={24} fill={Colors.pulseRed} />
                </View>
                <View style={styles.premiumText}>
                  <Text style={styles.premiumTitle}>Upgrade to Pulse Premium</Text>
                  <Text style={styles.premiumSubtitle}>Unlimited swipes, boosts, and more</Text>
                </View>
              </View>
            </Pressable>
          </Link>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <Pressable 
            style={styles.menuItem}
            onPress={() => handleOptionPress('Edit Profile')}
          >
            <View style={styles.menuItemLeft}>
              <Camera color={Colors.textPrimary} size={22} />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
          </Pressable>

          <Pressable 
            style={styles.menuItem}
            onPress={() => handleOptionPress('Verification')}
          >
            <View style={styles.menuItemLeft}>
              <Shield color={Colors.textPrimary} size={22} />
              <Text style={styles.menuItemText}>Verification</Text>
            </View>
            <View style={[
              styles.verifiedBadge, 
              user?.verification_status === 'verified' && styles.verifiedBadgeActive,
              user?.verification_status === 'pending' && styles.verifiedBadgePending,
              user?.verification_status === 'rejected' && styles.verifiedBadgeRejected,
            ]}>
              <Text style={styles.verifiedText}>
                {user?.verification_status === 'verified' ? 'Verified' : 
                 user?.verification_status === 'pending' ? 'Pending' :
                 user?.verification_status === 'rejected' ? 'Try Again' : 'Get Verified'}
              </Text>
            </View>
          </Pressable>

          <Pressable 
            style={styles.menuItem}
            onPress={() => handleOptionPress('Preferences')}
          >
            <View style={styles.menuItemLeft}>
              <Heart color={Colors.textPrimary} size={22} />
              <Text style={styles.menuItemText}>Dating Preferences</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Pulse v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logo: {
    ...Typography.h2,
    color: Colors.softWhite,
    letterSpacing: 2,
    fontWeight: '300' as const,
  },
  settingsButton: {
    position: 'absolute',
    right: Spacing.lg,
    padding: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing.xxxl,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 3,
    borderColor: Colors.pulseRed,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.pulseRed,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.voidBlack,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  profileName: {
    ...Typography.h2,
    color: Colors.softWhite,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 45, 45, 0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.full,
    gap: 4,
  },
  badgeIcon: {
    // Icon styles if needed
    color: Colors.softWhite, 
  },
  badgeText: {
    ...Typography.captionBold,
    color: Colors.softWhite,
    fontSize: 12,
  },
  profileBio: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  statValue: {
    ...Typography.h3,
    color: Colors.softWhite,
    marginBottom: 4,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  planInfo: {
    marginTop: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Layout.borderRadius.md,
  },
  planInfoText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  premiumCard: {
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.pulseRed,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumIcon: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: 4,
  },
  premiumSubtitle: {
    ...Typography.callout,
    color: Colors.textSecondary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuItemText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  verifiedBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.sm,
  },
  verifiedBadgeActive: {
    backgroundColor: Colors.pulseRed,
  },
  verifiedBadgePending: {
    backgroundColor: 'rgba(255, 214, 10, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.3)',
  },
  verifiedBadgeRejected: {
    backgroundColor: 'rgba(255, 69, 58, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.3)',
  },
  verifiedText: {
    ...Typography.captionBold,
    color: Colors.softWhite,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  footerText: {
    ...Typography.footnote,
    color: Colors.textTertiary,
  },
});
