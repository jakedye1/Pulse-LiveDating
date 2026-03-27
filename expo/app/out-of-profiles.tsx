import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { RefreshCw, Settings } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

export default function OutOfProfilesScreen() {
  const router = useRouter();

  const handleExpandFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/dating-preferences');
  };

  const handleTryAgain = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <RefreshCw size={48} color={Colors.pulseRed} />
        </View>

        <Text style={styles.title}>No More Profiles</Text>
        <Text style={styles.subtitle}>
          You&apos;ve seen everyone nearby. Check back later for new people!
        </Text>

        <View style={styles.suggestions}>
          <View style={styles.suggestionCard}>
            <Text style={styles.suggestionTitle}>Try expanding your filters</Text>
            <Text style={styles.suggestionText}>
              Increase your distance or adjust your preferences
            </Text>
          </View>

          <View style={styles.suggestionCard}>
            <Text style={styles.suggestionTitle}>Come back tomorrow</Text>
            <Text style={styles.suggestionText}>
              New people join Pulse every day
            </Text>
          </View>
        </View>

        <Pressable style={styles.primaryBtn} onPress={handleExpandFilters}>
          <Settings size={20} color={Colors.softWhite} />
          <Text style={styles.primaryBtnText}>Adjust Preferences</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={handleTryAgain}>
          <Text style={styles.secondaryBtnText}>Try Again Later</Text>
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
    width: 100,
    height: 100,
    borderRadius: 50,
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
  suggestions: {
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing.xxxl,
  },
  suggestionCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
  },
  suggestionTitle: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: Spacing.xs,
  },
  suggestionText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  primaryBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.full,
    marginBottom: Spacing.md,
  },
  primaryBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  secondaryBtn: {
    paddingVertical: Spacing.md,
  },
  secondaryBtnText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
