import { View, Text, StyleSheet, ScrollView, Pressable, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { BadgeCheck, Shield, Camera, Lock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import { useAuth } from '@/context/AuthContext';

export default function VerificationOnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [isVerifying] = useState(false);

  const handleVerifyNow = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/verification-flow/intro');
  };

  const handleSkip = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await completeOnboarding();
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.stepIndicator}>Step 8 of 8</Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <View style={styles.cameraIcon}>
                <Camera size={40} color={Colors.pulseRed} />
              </View>
            </View>

            <Text style={styles.title}>Get Verified</Text>

            <Text style={styles.description}>
              Stand out with a verified badge. Show others you&apos;re real and build trust from day one.
            </Text>
          </View>

          <View style={styles.benefitsContainer}>
            <Text style={styles.sectionHeader}>Why Verify?</Text>

            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <BadgeCheck size={24} color={Colors.pulseRed} />
              </View>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>Official Badge</Text>
                <Text style={styles.benefitDesc}>
                  Get the red checkmark on your profile
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Shield size={24} color={Colors.pulseRed} />
              </View>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>3x More Matches</Text>
                <Text style={styles.benefitDesc}>
                  Verified profiles get significantly more matches
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Lock size={24} color={Colors.pulseRed} />
              </View>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>Safe Community</Text>
                <Text style={styles.benefitDesc}>
                  Help keep Pulse authentic and secure
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.noteCard}>
            <Text style={styles.noteText}>
              Verification is optional but highly recommended. You can verify anytime from your profile.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable 
            style={[styles.verifyButton, isVerifying && styles.verifyButtonDisabled]} 
            onPress={handleVerifyNow}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <ActivityIndicator color={Colors.softWhite} />
            ) : (
              <Text style={styles.verifyButtonText}>Verify Now</Text>
            )}
          </Pressable>

          <Pressable onPress={handleSkip} style={styles.skipBtn} disabled={isVerifying}>
            <Text style={[styles.skipText, isVerifying && { opacity: 0.5 }]}>Skip for Now</Text>
          </Pressable>
        </View>
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
    paddingHorizontal: Spacing.xl,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    ...Typography.captionBold,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    padding: Spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
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
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
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
  noteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Layout.borderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  noteText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    backgroundColor: Colors.voidBlack,
  },
  verifyButton: {
    backgroundColor: Colors.pulseRed,
    paddingVertical: Spacing.lg,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.pulseRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    minHeight: 56,
    justifyContent: 'center',
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 18,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  skipText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '500' as const,
  },
});
