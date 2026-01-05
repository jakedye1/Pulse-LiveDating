import { StyleSheet, View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, CheckCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

export default function AccountReviewPendingScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Clock size={48} color={Colors.pulseRed} />
            </View>

            <Text style={styles.title}>Account Under Review</Text>
            <Text style={styles.subtitle}>
              We&apos;re reviewing your account to ensure everyone&apos;s safety. This usually takes a few minutes.
            </Text>

            <View style={styles.statusContainer}>
              <View style={styles.statusRow}>
                <CheckCircle size={20} color={Colors.success} />
                <Text style={styles.statusText}>Profile created</Text>
              </View>
              <View style={styles.statusRow}>
                <CheckCircle size={20} color={Colors.success} />
                <Text style={styles.statusText}>Photos uploaded</Text>
              </View>
              <View style={styles.statusRow}>
                <Clock size={20} color={Colors.pulseRed} />
                <Text style={styles.statusText}>Verification pending</Text>
              </View>
            </View>

            <Text style={styles.note}>
              You can start exploring while we review your account. Some features may be limited until verification is complete.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueBtnText}>Continue to Pulse</Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    alignItems: 'center',
    // Remove justifyContent: 'center' to allow top alignment with scroll
    paddingBottom: 40,
  },
  content: {
    width: '100%',
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
  statusContainer: {
    width: '100%',
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    padding: Spacing.xl,
    gap: Spacing.lg,
    marginBottom: Spacing.xxxl,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  statusText: {
    ...Typography.body,
    color: Colors.softWhite,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.voidBlack,
  },
  continueBtn: {
    width: '100%',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  continueBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  note: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
