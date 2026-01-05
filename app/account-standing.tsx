import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

type StandingStatus = 'good' | 'warning' | 'risk';

const STANDING_DATA: Record<StandingStatus, {
  icon: any;
  color: string;
  title: string;
  description: string;
}> = {
  good: {
    icon: CheckCircle,
    color: Colors.success,
    title: 'Good Standing',
    description: 'Your account is in good standing. Keep following our Community Guidelines.',
  },
  warning: {
    icon: AlertTriangle,
    color: '#FFA500',
    title: 'Warning',
    description: 'Your account has received a warning. Please review our guidelines carefully.',
  },
  risk: {
    icon: XCircle,
    color: Colors.pulseRed,
    title: 'At Risk',
    description: 'Your account is at risk of suspension. Another violation may result in a ban.',
  },
};

export default function AccountStandingScreen() {
  const router = useRouter();
  const standing: StandingStatus = 'good';
  const strikes = 0;
  const data = STANDING_DATA[standing];
  const Icon = data.icon;

  const handleViewGuidelines = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/community-guidelines');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusCard}>
          <View style={[styles.iconContainer, { backgroundColor: `${data.color}20` }]}>
            <Icon size={48} color={data.color} />
          </View>
          <Text style={styles.statusTitle}>{data.title}</Text>
          <Text style={styles.statusDesc}>{data.description}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Strike System</Text>
          
          <View style={styles.strikesCard}>
            <View style={styles.strikesHeader}>
              <Text style={styles.strikesCount}>{strikes}/3</Text>
              <Text style={styles.strikesLabel}>Strikes</Text>
            </View>
            <View style={styles.strikesBar}>
              {Array.from({ length: 3 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.strikeSegment,
                    i < strikes && styles.strikeSegmentActive,
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How strikes work:</Text>
            <Text style={styles.infoText}>• 1st strike: Warning</Text>
            <Text style={styles.infoText}>• 2nd strike: Temporary restrictions</Text>
            <Text style={styles.infoText}>• 3rd strike: Account suspension</Text>
          </View>
        </View>

        {strikes > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Recent Violations</Text>
            <View style={styles.violationCard}>
              <Text style={styles.violationDate}>Dec 15, 2025</Text>
              <Text style={styles.violationReason}>Inappropriate content</Text>
              <Text style={styles.violationDesc}>
                Content removed for violating community guidelines
              </Text>
            </View>
          </View>
        )}

        <Pressable style={styles.guidelinesBtn} onPress={handleViewGuidelines}>
          <Text style={styles.guidelinesBtnText}>Read Community Guidelines</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: 40,
  },
  statusCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.xl,
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  statusTitle: {
    ...Typography.h1,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
  },
  statusDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.softWhite,
    marginBottom: Spacing.md,
  },
  strikesCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    marginBottom: Spacing.md,
  },
  strikesHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  strikesCount: {
    ...Typography.h1,
    fontSize: 48,
    color: Colors.softWhite,
  },
  strikesLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  strikesBar: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  strikeSegment: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.darkSecondary,
    borderRadius: 4,
  },
  strikeSegmentActive: {
    backgroundColor: Colors.pulseRed,
  },
  infoCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
  },
  infoTitle: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
  },
  infoText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  historySection: {
    marginBottom: Spacing.xl,
  },
  violationCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.pulseRed,
  },
  violationDate: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
  },
  violationReason: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: Spacing.xs,
  },
  violationDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  guidelinesBtn: {
    width: '100%',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
  },
  guidelinesBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
});
