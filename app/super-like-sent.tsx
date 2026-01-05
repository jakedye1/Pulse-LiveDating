import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';


import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

export default function SuperLikeSentScreen() {
  const router = useRouter();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleBuyMore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/paywall');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Star size={64} color={Colors.pulseRed} fill={Colors.pulseRed} />
        </View>

        <Text style={styles.title}>Super Like Sent!</Text>
        <Text style={styles.subtitle}>
          You&apos;ll stand out to them. They&apos;ll see you liked them when they come across your profile.
        </Text>

        <View style={styles.remainingCard}>
          <Text style={styles.remainingNumber}>2</Text>
          <Text style={styles.remainingText}>Super Likes remaining today</Text>
        </View>

        <Pressable style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueBtnText}>Keep Swiping</Text>
        </Pressable>

        <Pressable style={styles.buyMoreBtn} onPress={handleBuyMore}>
          <Text style={styles.buyMoreText}>Get More Super Likes</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 100,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.signalGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.softWhite,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
  },
  remainingCard: {
    width: '100%',
    padding: Spacing.xl,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  remainingNumber: {
    ...Typography.h1,
    fontSize: 48,
    color: Colors.pulseRed,
    marginBottom: Spacing.xs,
  },
  remainingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  continueBtn: {
    width: '100%',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  continueBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  buyMoreBtn: {
    paddingVertical: Spacing.md,
  },
  buyMoreText: {
    ...Typography.body,
    color: Colors.pulseRed,
  },
});
