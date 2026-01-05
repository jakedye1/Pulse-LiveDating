import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { BadgeCheck, Shield, ChevronLeft, Lock, Camera } from 'lucide-react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import { useAuth } from '@/context/AuthContext';

export default function VerificationScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const isVerified = user?.verification_status === 'verified';
  const isPending = user?.verification_status === 'pending';
  const isRejected = user?.verification_status === 'rejected';

  const handleApply = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/verification-flow/intro');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable 
            onPress={() => router.back()} 
            style={styles.backButton}
            hitSlop={20}
          >
            <ChevronLeft color={Colors.softWhite} size={28} />
          </Pressable>
          <Text style={styles.headerTitle}>Verification</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <View style={[
              styles.iconContainer, 
              isVerified ? styles.iconContainerVerified : styles.iconContainerUnverified
            ]}>
              {isVerified ? (
                <BadgeCheck size={64} color={Colors.softWhite} fill={Colors.pulseRed} />
              ) : (
                <View style={styles.cameraIcon}>
                     <Camera size={40} color={Colors.pulseRed} />
                </View>
              )}
            </View>
            
            <Text style={styles.title}>
              {isVerified ? "You're Verified" : 
               isPending ? "Verification Pending" :
               isRejected ? "Verification Failed" : "Selfie Verification"}
            </Text>
            
            <Text style={styles.description}>
              {isVerified ? "Your profile is verified. You have a verified badge visible to other users." : 
               isPending ? "We are reviewing your submission. This usually takes a few minutes." :
               isRejected ? "We couldn't verify your profile. Please try again with clearer photos." :
               "Take a selfie to verify your identity. This helps us keep Pulse safe for everyone."}
            </Text>
          </View>

          {!isVerified && (
            <View style={styles.benefitsContainer}>
              <Text style={styles.sectionHeader}>Why Verify?</Text>
              
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <BadgeCheck size={24} color={Colors.pulseRed} />
                </View>
                <View style={styles.benefitTextContainer}>
                  <Text style={styles.benefitTitle}>Official Badge</Text>
                  <Text style={styles.benefitDesc}>Get the red checkmark on your profile and chats.</Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Shield size={24} color={Colors.pulseRed} />
                </View>
                <View style={styles.benefitTextContainer}>
                  <Text style={styles.benefitTitle}>Increased Trust</Text>
                  <Text style={styles.benefitDesc}>Users are 3x more likely to match with verified profiles.</Text>
                </View>
              </View>
              
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Lock size={24} color={Colors.pulseRed} />
                </View>
                <View style={styles.benefitTextContainer}>
                  <Text style={styles.benefitTitle}>Enhanced Security</Text>
                  <Text style={styles.benefitDesc}>Help us keep the community safe and authentic.</Text>
                </View>
              </View>
            </View>
          )}

          {isVerified && (
             <View style={styles.verifiedCard}>
                <Image 
                  source={user?.avatar_url ? { uri: user.avatar_url } : require('@/assets/images/adaptive-icon.png')}
                  style={styles.avatar}
                />
                <View style={styles.verifiedBadgeRow}>
                  <Text style={styles.userName}>{user?.name || 'User'}</Text>
                  <BadgeCheck size={20} color={Colors.softWhite} fill={Colors.pulseRed} />
                </View>
                <Text style={styles.verifiedSince}>Verified since {new Date().toLocaleDateString()}</Text>
             </View>
          )}
        </ScrollView>

        {!isVerified && !isPending && (
          <View style={styles.footer}>
            <Pressable 
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>
                {isRejected ? "Try Again" : "Start Verification"}
              </Text>
            </Pressable>
            <Text style={styles.disclaimer}>
              Verification does not guarantee safety. Always follow safety tips.
            </Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.softWhite,
  },
  content: {
    padding: Spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  iconContainerVerified: {
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
    borderColor: Colors.pulseRed,
  },
  iconContainerUnverified: {
    backgroundColor: Colors.signalGray,
    borderColor: Colors.border,
  },
  cameraIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: Colors.darkSecondary,
      alignItems: 'center',
      justifyContent: 'center',
  },
  title: {
    ...Typography.h1,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    lineHeight: 24,
  },
  benefitsContainer: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    ...Typography.h3,
    color: Colors.softWhite,
    marginBottom: Spacing.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  benefitIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  benefitTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  benefitTitle: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: 4,
    fontSize: 16,
  },
  benefitDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontSize: 13,
  },
  verifiedCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 45, 0.3)',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.pulseRed,
  },
  verifiedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  userName: {
    ...Typography.h3,
    color: Colors.softWhite,
  },
  verifiedSince: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    backgroundColor: Colors.voidBlack,
  },
  applyButton: {
    backgroundColor: Colors.pulseRed,
    paddingVertical: Spacing.lg,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  applyButtonDisabled: {
    opacity: 0.7,
  },
  applyButtonText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  disclaimer: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    fontSize: 11,
  },
});
