import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { router, Stack } from 'expo-router';
import { X, Star, Zap, Eye, RotateCcw, MessageCircle, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

export default function PaywallScreen() {
  const [selectedTier, setSelectedTier] = useState<'weekly' | 'monthly' | 'annual'>('annual');

  const handleClose = () => {
    router.back();
  };

  const handleSubscribe = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // In a real app, trigger purchase flow here
    console.log(`Subscribing to ${selectedTier}`);
    router.back();
  };

  const selectTier = (tier: 'weekly' | 'monthly' | 'annual') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTier(tier);
  };

  const FeatureRow = ({ icon: Icon, text }: { icon: any, text: string }) => (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <Icon size={20} color={Colors.pulseRed} />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );

  const TierOption = ({ 
    id, 
    title, 
    price, 
    period, 
    saveLabel,
    description 
  }: { 
    id: 'weekly' | 'monthly' | 'annual', 
    title: string, 
    price: string, 
    period: string, 
    saveLabel?: string,
    description?: string 
  }) => {
    const isSelected = selectedTier === id;
    
    return (
      <Pressable 
        style={[styles.tierOption, isSelected && styles.tierOptionSelected]}
        onPress={() => selectTier(id)}
      >
        {saveLabel && (
          <View style={styles.saveLabelContainer}>
            <Text style={styles.saveLabelText}>{saveLabel}</Text>
          </View>
        )}
        <View style={styles.tierContent}>
          <Text style={[styles.tierTitle, isSelected && styles.tierTitleSelected]}>{title}</Text>
          <View style={styles.tierPriceContainer}>
            <Text style={[styles.tierPrice, isSelected && styles.tierPriceSelected]}>{price}</Text>
            <Text style={[styles.tierPeriod, isSelected && styles.tierPeriodSelected]}>{period}</Text>
          </View>
          {description && (
            <Text style={styles.tierDescription}>{description}</Text>
          )}
        </View>
        <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
          {isSelected && <View style={styles.radioButtonInner} />}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={[Colors.darkSecondary, Colors.voidBlack]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={styles.header}>
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <X color={Colors.softWhite} size={28} />
        </Pressable>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>pulse</Text>
            <View style={styles.plusBadge}>
              <Text style={styles.plusText}>+</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Unlock Full Access</Text>
          <Text style={styles.heroSubtitle}>
            Get unlimited swipes, see who likes you, and boost your profile.
          </Text>
        </View>

        <View style={styles.featuresList}>
          <FeatureRow icon={Heart} text="Unlimited Swipes" />
          <FeatureRow icon={Eye} text="See Who Likes You" />
          <FeatureRow icon={Zap} text="1 Free Boost per Month" />
          <FeatureRow icon={Star} text="5 Super Likes per Week" />
          <FeatureRow icon={RotateCcw} text="Rewind Last Swipe" />
          <FeatureRow icon={MessageCircle} text="Priority Messages" />
        </View>

        <View style={styles.tiersContainer}>
          <TierOption 
            id="weekly" 
            title="Weekly" 
            price="$4.99" 
            period="/week" 
            description="Flexible, cancel anytime"
          />
          <TierOption 
            id="monthly" 
            title="Monthly" 
            price="$12.99" 
            period="/month" 
            description="Best for active users"
          />
          <TierOption 
            id="annual" 
            title="Yearly ⭐ BEST VALUE" 
            price="$99.99" 
            period="/year" 
            saveLabel="SAVE 35%" 
            description="Save 35%+ vs monthly"
          />
        </View>

        <Text style={styles.disclaimer}>
          Recurring billing, cancel anytime. By continuing you agree to our Terms of Service.
        </Text>

        <View style={{ height: 100 }} /> 
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={styles.subscribeButton}
          onPress={handleSubscribe}
        >
          <LinearGradient
            colors={[Colors.pulseRed, Colors.accentRed]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.subscribeButtonText}>Continue</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 120,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  logoText: {
    ...Typography.h1,
    color: Colors.softWhite,
    letterSpacing: 2,
    fontWeight: '800' as const,
  },
  plusBadge: {
    backgroundColor: Colors.pulseRed,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 4,
    marginTop: 4,
  },
  plusText: {
    ...Typography.captionBold,
    color: Colors.softWhite,
    fontSize: 10,
  },
  heroTitle: {
    ...Typography.h2,
    color: Colors.softWhite,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  featuresList: {
    marginBottom: Spacing.xl,
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderRadius: Layout.borderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 45, 45, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  featureText: {
    ...Typography.body,
    color: Colors.softWhite,
    fontWeight: '500' as const,
  },
  tiersContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tierOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.lg,
    padding: Spacing.lg,
    position: 'relative',
  },
  tierOptionSelected: {
    borderColor: Colors.pulseRed,
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
  },
  saveLabelContainer: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: Colors.pulseRed,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  saveLabelText: {
    ...Typography.captionBold,
    color: Colors.softWhite,
    fontSize: 10,
  },
  tierContent: {
    flex: 1,
  },
  tierTitle: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
    marginBottom: 4,
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
    marginRight: 4,
  },
  tierPriceSelected: {
    color: Colors.pulseRed,
  },
  tierPeriod: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  tierPeriodSelected: {
    color: Colors.pulseRed,
  },
  tierDescription: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.pulseRed,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.pulseRed,
  },
  disclaimer: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.lg,
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  subscribeButton: {
    borderRadius: Layout.borderRadius.full,
    overflow: 'hidden',
    shadowColor: Colors.pulseRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButtonText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 18,
  },
});
