import { View, Text, StyleSheet, Pressable, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Check, Activity } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function VerificationSubmitScreen() {
  const router = useRouter();
  const { updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate API call
    setTimeout(async () => {
        await updateProfile({
            verification_status: 'pending',
            verification_submitted_at: new Date().toISOString()
        });
        setIsSubmitting(false);
        router.push('/verification-flow/pending');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color={Colors.softWhite} />
          </Pressable>
          <Text style={styles.headerTitle}>Confirmation</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Submit Verification</Text>
          <Text style={styles.subtitle}>
            You&apos;re all set! Ready to submit your profile for review?
          </Text>

          <View style={styles.summaryCard}>
             <View style={styles.summaryItem}>
                <View style={styles.iconBox}>
                    <Check size={20} color={Colors.accentGreen} />
                </View>
                <Text style={styles.itemText}>Selfie captured</Text>
             </View>
             
             <View style={styles.divider} />
             
             <View style={styles.summaryItem}>
                <View style={styles.iconBox}>
                    <Check size={20} color={Colors.accentGreen} />
                </View>
                <Text style={styles.itemText}>Liveness check passed</Text>
             </View>

             <View style={styles.divider} />

             <View style={styles.summaryItem}>
                <View style={styles.iconBox}>
                    <Activity size={20} color={Colors.textSecondary} />
                </View>
                <Text style={styles.itemText}>Review process (usually ~5 min)</Text>
             </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable 
            style={[styles.button, isSubmitting && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
                <ActivityIndicator color={Colors.softWhite} />
            ) : (
                <Text style={styles.buttonText}>Submit</Text>
            )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  headerTitle: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.darkSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    ...Typography.body,
    color: Colors.softWhite,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
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
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 18,
  },
});
