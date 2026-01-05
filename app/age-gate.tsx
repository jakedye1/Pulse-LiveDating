import { StyleSheet, View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { CheckSquare, Square, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

import { useAuth } from '@/context/AuthContext';

export default function AgeGateScreen() {
  const router = useRouter();
  const { updateProfile } = useAuth();
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setConfirmed(!confirmed);
  };

  const handleContinue = async () => {
    if (confirmed) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      await updateProfile({ 
        age_confirmed: true, 
        age_confirmed_at: new Date().toISOString() 
      });
      
      router.push('/basic-info');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <Pressable 
                onPress={() => router.back()} 
                style={styles.backButton}
                hitSlop={20}
            >
                <ChevronLeft color={Colors.softWhite} size={28} />
            </Pressable>
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🔞</Text>
            </View>

            <Text style={styles.title}>Age Requirement</Text>
            <Text style={styles.subtitle}>
              Pulse is for adults only. You must be 18 years or older to use this app.
            </Text>

            <Pressable 
              style={styles.checkboxRow} 
              onPress={handleConfirm}
            >
              {confirmed ? (
                <CheckSquare size={24} color={Colors.pulseRed} />
              ) : (
                <Square size={24} color={Colors.textSecondary} />
              )}
              <Text style={styles.checkboxText}>
                I confirm that I am 18 years old or older
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[styles.continueBtn, !confirmed && styles.continueDisabled]}
            onPress={handleContinue}
            disabled={!confirmed}
          >
            <Text style={[styles.continueBtnText, !confirmed && styles.continueDisabledText]}>
              Continue
            </Text>
          </Pressable>

          <Text style={styles.disclaimer}>
            By continuing, you confirm that you are 18 years old or older and eligible to use Pulse.
          </Text>
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
    paddingHorizontal: Spacing.xl,
    height: 60,
    justifyContent: 'center',
  },
  backButton: {
    marginLeft: -Spacing.xs,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    fontSize: 40,
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
    lineHeight: 24,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.xl,
    gap: Spacing.md,
    marginBottom: Spacing.xxxl,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  checkboxText: {
    ...Typography.body,
    color: Colors.softWhite,
    flex: 1,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    backgroundColor: Colors.voidBlack,
  },
  continueBtn: {
    width: '100%',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.pulseRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  continueDisabled: {
    backgroundColor: Colors.darkSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 18,
  },
  continueDisabledText: {
    color: Colors.textTertiary,
  },
  disclaimer: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
