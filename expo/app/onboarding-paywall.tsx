import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Heart, Video, Flame, BadgeCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

export default function OnboardingPaywallScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [selectedTier, setSelectedTier] = useState<'weekly' | 'monthly' | 'annual'>('monthly');

  const handleSkip = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await completeOnboarding();
    router.replace('/(tabs)/home');
  };

  const handleUpgrade = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log(`Subscribing to ${selectedTier}`);
    await completeOnboarding();
    router.replace('/(tabs)/home');
  };

  const selectTier = (tier: 'weekly' | 'monthly' | 'annual') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTier(tier);
  };

  const TierOption = ({
    id,
    title,
    price,
    period,
    badgeLabel,
    isBestValue,
  }: {
    id: 'weekly' | 'monthly' | 'annual';
    title: string;
    price: string;
    period: string;
    badgeLabel?: string;
    isBestValue?: boolean;
  }) => {
    const isSelected = selectedTier === id;

    return (
      <Pressable
        style={[
          styles.tierOption, 
          isSelected && styles.tierOptionSelected,
          isBestValue && !isSelected && styles.tierOptionBestValue
        ]}
        onPress={() => selectTier(id)}
      >
        {badgeLabel && (
          <View style={[styles.badgeContainer, isSelected ? styles.badgeSelected : styles.badgeDefault]}>
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        )}
        <View style={styles.tierContent}>
          <Text style={[styles.tierTitle, isSelected && styles.tierTitleSelected]}>
            {title}
          </Text>
          <View style={styles.tierPriceContainer}>
            <Text style={[styles.tierPrice, isSelected && styles.tierPriceSelected]}>
              {price}
            </Text>
            <Text style={[styles.tierPeriod, isSelected && styles.tierPeriodSelected]}>
              {period}
            </Text>
          </View>
        </View>
        <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
          {isSelected && <View style={styles.radioButtonInner} />}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.voidBlack, '#1a0505']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Heart size={40} color={Colors.pulseRed} fill={Colors.pulseRed} />
            </View>
            <Text style={styles.heroTitle}>Unlock Full Pulse</Text>
            <Text style={styles.heroSubtitle}>
              Meet more people, connect faster.
            </Text>
          </View>

          {/* Features - Compact Grid */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <Heart size={20} color={Colors.pulseRed} style={styles.featureIcon} />
              <Text style={styles.featureText}>Unlimited Likes</Text>
            </View>
            <View style={styles.featureRow}>
              <Video size={20} color={Colors.pulseRed} style={styles.featureIcon} />
              <Text style={styles.featureText}>More Video Chats</Text>
            </View>
            <View style={styles.featureRow}>
              <Flame size={20} color={Colors.pulseRed} style={styles.featureIcon} />
              <Text style={styles.featureText}>Priority Visibility</Text>
            </View>
            <View style={styles.featureRow}>
              <BadgeCheck size={20} color={Colors.pulseRed} style={styles.featureIcon} />
              <Text style={styles.featureText}>Verified Badge</Text>
            </View>
          </View>

          {/* Spacer to push pricing down */}
          <View style={{ flex: 1 }} />

          {/* Pricing Options */}
          <View style={styles.tiersContainer}>
            <TierOption
              id="weekly"
              title="Weekly"
              price="$4.99"
              period="/week"
            />
            <TierOption
              id="monthly"
              title="Monthly"
              price="$12.99"
              period="/mo"
              badgeLabel="MOST POPULAR"
            />
            <TierOption
              id="annual"
              title="Yearly"
              price="$99.99"
              period="/yr"
              badgeLabel="BEST VALUE"
              isBestValue
            />
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Pressable style={styles.upgradeButton} onPress={handleUpgrade}>
            <LinearGradient
              colors={[Colors.pulseRed, Colors.accentRed]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.upgradeButtonText}>Start Premium</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={handleSkip} style={styles.continueFreeCTA}>
            <Text style={styles.continueFreeText}>Continue with Free Version</Text>
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
  mainContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 45, 0.2)',
  },
  heroTitle: {
    ...Typography.h1,
    color: Colors.softWhite,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    fontSize: 28,
  },
  heroSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    opacity: 0.8,
  },
  featuresContainer: {
    gap: 16,
    paddingHorizontal: Spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    marginRight: 16,
  },
  featureText: {
    ...Typography.body,
    color: Colors.softWhite,
    fontWeight: '500',
    fontSize: 16,
  },
  tiersContainer: {
    gap: 10,
    marginBottom: Spacing.lg,
  },
  tierOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.xl,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    position: 'relative',
  },
  tierOptionSelected: {
    borderColor: Colors.pulseRed,
    backgroundColor: 'rgba(255, 45, 45, 0.08)',
  },
  tierOptionBestValue: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeContainer: {
    position: 'absolute',
    top: -10,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  badgeSelected: {
    backgroundColor: Colors.pulseRed,
  },
  badgeDefault: {
    backgroundColor: Colors.darkSecondary,
  },
  badgeText: {
    ...Typography.captionBold,
    color: Colors.softWhite,
    fontSize: 10,
  },
  tierContent: {
    flex: 1,
  },
  tierTitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 2,
    fontWeight: '500',
  },
  tierTitleSelected: {
    color: Colors.softWhite,
    fontWeight: '700',
  },
  tierPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  tierPrice: {
    ...Typography.h3,
    color: Colors.softWhite,
    marginRight: 4,
    fontSize: 18,
  },
  tierPriceSelected: {
    color: Colors.pulseRed,
  },
  tierPeriod: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontSize: 14,
  },
  tierPeriodSelected: {
    color: Colors.pulseRed,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  radioButtonSelected: {
    borderColor: Colors.pulseRed,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.pulseRed,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    paddingTop: Spacing.sm,
  },
  upgradeButton: {
    borderRadius: Layout.borderRadius.full,
    overflow: 'hidden',
    shadowColor: Colors.pulseRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: Spacing.md,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeButtonText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 18,
  },
  continueFreeCTA: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  continueFreeText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
});
