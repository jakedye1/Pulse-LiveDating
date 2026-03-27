import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { XCircle } from 'lucide-react-native';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

export default function Strike3BanScreen() {
  const router = useRouter();

  const handleAppeal = () => {
    router.push('/appeal-form' as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <XCircle size={64} color={Colors.pulseRed} />
        </View>

        <Text style={styles.title}>Account Suspended</Text>
        <Text style={styles.subtitle}>
          Your account has been permanently suspended due to repeated violations of our Community Guidelines.
        </Text>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Why this happened:</Text>
          <Text style={styles.detailsText}>
            You received three strikes for violating our community standards. After multiple warnings, we have no choice but to suspend your account.
          </Text>
        </View>

        <View style={styles.banCard}>
          <Text style={styles.banTitle}>What this means:</Text>
          <Text style={styles.banText}>• Your profile is no longer visible</Text>
          <Text style={styles.banText}>• You cannot access Pulse features</Text>
          <Text style={styles.banText}>• All matches and messages are removed</Text>
          <Text style={styles.banText}>• This decision is typically permanent</Text>
        </View>

        <Pressable style={styles.appealBtn} onPress={handleAppeal}>
          <Text style={styles.appealBtnText}>Submit an Appeal</Text>
        </Pressable>

        <Text style={styles.appealNote}>
          If you believe this was a mistake, you can submit an appeal for review.
        </Text>
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
    backgroundColor: 'rgba(255,45,45,0.1)',
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
  detailsCard: {
    width: '100%',
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    marginBottom: Spacing.md,
  },
  detailsTitle: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
  },
  detailsText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  banCard: {
    width: '100%',
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.pulseRed,
    marginBottom: Spacing.xxxl,
  },
  banTitle: {
    ...Typography.bodyBold,
    color: Colors.pulseRed,
    marginBottom: Spacing.sm,
  },
  banText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  appealBtn: {
    width: '100%',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  appealBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  appealNote: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
