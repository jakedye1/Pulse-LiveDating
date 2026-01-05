import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Zap, TrendingUp } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

export default function BoostActiveScreen() {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Zap size={64} color={Colors.pulseRed} fill={Colors.pulseRed} />
        </View>

        <Text style={styles.title}>Boost Active!</Text>
        <Text style={styles.subtitle}>
          Your profile is now one of the top profiles in your area for 30 minutes
        </Text>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatTime(timeRemaining)}</Text>
            <Text style={styles.statLabel}>Time remaining</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statItem}>
            <View style={styles.statRow}>
              <TrendingUp size={24} color={Colors.success} />
              <Text style={styles.statNumber}>10x</Text>
            </View>
            <Text style={styles.statLabel}>Profile views</Text>
          </View>
        </View>

        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>What happens during a boost:</Text>
          <Text style={styles.benefitText}>• Your profile appears first</Text>
          <Text style={styles.benefitText}>• Get up to 10x more views</Text>
          <Text style={styles.benefitText}>• Increase your match rate</Text>
        </View>

        <Pressable style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueBtnText}>Continue Swiping</Text>
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
  statsCard: {
    width: '100%',
    flexDirection: 'row',
    padding: Spacing.xl,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.pulseRed,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },
  benefitsCard: {
    width: '100%',
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    marginBottom: Spacing.xxxl,
  },
  benefitsTitle: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
  },
  benefitText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  continueBtn: {
    width: '100%',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
  },
  continueBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
});
