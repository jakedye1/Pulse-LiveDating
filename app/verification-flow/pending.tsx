import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import { useAuth } from '@/context/AuthContext';
import * as Haptics from 'expo-haptics';

export default function VerificationPendingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await completeOnboarding();
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Clock size={48} color={Colors.softWhite} />
          </View>
          
          <Text style={styles.title}>Verification Submitted</Text>
          <Text style={styles.description}>
            Your verification is pending. We&apos;ll notify you when it&apos;s approved.
          </Text>

          <View style={styles.infoCard}>
             <Text style={styles.infoTitle}>What happens next?</Text>
             <Text style={styles.infoText}>
                You can continue using Pulse while we review your profile. Once approved, the verified badge will appear automatically.
             </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue to Pulse</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: Colors.signalGray,
    padding: Spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    width: '100%',
  },
  infoTitle: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: Spacing.xs,
  },
  infoText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
  },
  button: {
    backgroundColor: Colors.pulseRed,
    height: 56,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.pulseRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 18,
  },
});
