import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertTriangle } from 'lucide-react-native';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

export default function Strike1Screen() {
  const router = useRouter();

  const handleUnderstood = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <AlertTriangle size={64} color="#FFA500" />
        </View>

        <Text style={styles.title}>First Warning</Text>
        <Text style={styles.subtitle}>
          Your recent activity violated our Community Guidelines. This is your first warning.
        </Text>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>What happened:</Text>
          <Text style={styles.detailsText}>
            You posted content that was reported and found to violate our guidelines on respectful behavior.
          </Text>
        </View>

        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>What this means:</Text>
          <Text style={styles.warningText}>• This is a warning - no restrictions yet</Text>
          <Text style={styles.warningText}>• Content has been removed</Text>
          <Text style={styles.warningText}>• Future violations will result in account restrictions</Text>
        </View>

        <Pressable style={styles.understoodBtn} onPress={handleUnderstood}>
          <Text style={styles.understoodBtnText}>I Understand</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/community-guidelines')}>
          <Text style={styles.guidelinesLink}>Read Community Guidelines</Text>
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
    backgroundColor: 'rgba(255,165,0,0.1)',
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
  warningCard: {
    width: '100%',
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    marginBottom: Spacing.xxxl,
  },
  warningTitle: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
  },
  warningText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  understoodBtn: {
    width: '100%',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  understoodBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  guidelinesLink: {
    ...Typography.body,
    color: Colors.pulseRed,
  },
});
