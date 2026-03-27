import { View, Text, StyleSheet, Pressable, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import { useAuth } from '@/context/AuthContext';

export default function SubscriptionSelectionScreen() {
  const router = useRouter();
  const { updateProfile } = useAuth();
  const [selectedTier, setSelectedTier] = useState<'weekly' | 'monthly' | 'annual' | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleContinueFree = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await updateProfile({ subscription_status: 'free' });
    router.push('/verification-onboarding');
  };

  const handleSubscribe = async () => {
    if (!selectedTier) return;
    
    setIsSubscribing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Simulate purchase
    setTimeout(async () => {
      await updateProfile({ 
        subscription_status: 'active',
        subscription_plan: selectedTier
      });
      setIsSubscribing(false);
      router.push('/verification-onboarding');
    }, 1500);
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
    features
  }: {
    id: 'weekly' | 'monthly' | 'annual';
    title: string;
    price: string;
    period: string;
    badgeLabel?: string;
    isBestValue?: boolean;
    features: string[];
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
          <View style={styles.tierHeader}>
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
          
          <View style={styles.tierFeatures}>
            {features.map((feature, index) => (
              <Text key={index} style={styles.tierFeatureText}>• {feature}</Text>
            ))}
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
        <View style={styles.header}>
            <Pressable 
                onPress={() => router.back()} 
                style={styles.backButton}
                hitSlop={20}
            >
                <ChevronLeft color={Colors.softWhite} size={28} />
            </Pressable>
            <Text style={styles.stepIndicator}>Step 7 of 8</Text>
            <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <Heart size={40} color={Colors.pulseRed} fill={Colors.pulseRed} />
            </View>
            <Text style={styles.heroTitle}>Upgrade Your Experience</Text>
            <Text style={styles.heroSubtitle}>
              Choose a plan or continue free — you can upgrade anytime.
            </Text>
          </View>

          <View style={styles.tiersContainer}>
            <TierOption
              id="weekly"
              title="Weekly"
              price="$4.99"
              period="/week"
              features={['Unlimited Likes', '5 Super Likes']}
            />
            <TierOption
              id="monthly"
              title="Monthly"
              price="$12.99"
              period="/mo"
              badgeLabel="MOST POPULAR"
              features={['Unlimited Likes', 'Unlimited Video Chat', 'See Who Likes You']}
            />
            <TierOption
              id="annual"
              title="Yearly"
              price="$99.99"
              period="/yr"
              badgeLabel="BEST VALUE"
              isBestValue
              features={['All Features Included', 'Priority Visibility', 'Verified Badge']}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable 
            style={[styles.upgradeButton, !selectedTier && styles.upgradeButtonDisabled]} 
            onPress={handleSubscribe}
            disabled={!selectedTier || isSubscribing}
          >
            <LinearGradient
              colors={selectedTier ? [Colors.pulseRed, Colors.accentRed] : [Colors.darkSecondary, Colors.darkSecondary]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.upgradeButtonText, !selectedTier && styles.upgradeButtonTextDisabled]}>
                {isSubscribing ? 'Processing...' : 'Subscribe'}
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={handleContinueFree} style={styles.continueFreeCTA} disabled={isSubscribing}>
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
  header: {
    paddingHorizontal: Spacing.xl,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  stepIndicator: {
    ...Typography.captionBold,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: 40,
  },
  heroSection: {
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
    lineHeight: 22,
  },
  tiersContainer: {
    gap: 12,
  },
  tierOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.xl,
    padding: 16,
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
    paddingRight: 12,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tierTitle: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
    fontSize: 16,
  },
  tierTitleSelected: {
    color: Colors.softWhite,
  },
  tierPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  tierPrice: {
    ...Typography.h3,
    color: Colors.softWhite,
    fontSize: 18,
    marginRight: 4,
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
  tierFeatures: {
    marginTop: 4,
  },
  tierFeatureText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontSize: 13,
    lineHeight: 18,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingTop: Spacing.md,
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
  upgradeButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
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
  upgradeButtonTextDisabled: {
    color: Colors.textTertiary,
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
