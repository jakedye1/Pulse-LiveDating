import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Sun, User, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import * as Haptics from 'expo-haptics';

export default function VerificationIntroScreen() {
  const router = useRouter();

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/verification-flow/selfie');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color={Colors.textSecondary} />
          </Pressable>
          <Text style={styles.headerTitle}>Verification</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.hero}>
            <View style={styles.iconCircle}>
              <User size={48} color={Colors.pulseRed} />
            </View>
            <Text style={styles.title}>Verify your profile</Text>
            <Text style={styles.subtitle}>
              We’ll confirm you’re a real person with a quick selfie + liveness check.
            </Text>
          </View>

          <View style={styles.requirements}>
            <View style={styles.reqItem}>
              <View style={styles.reqIcon}>
                <Sun size={24} color={Colors.softWhite} />
              </View>
              <Text style={styles.reqText}>Good lighting</Text>
            </View>
            
            <View style={styles.reqItem}>
              <View style={styles.reqIcon}>
                <User size={24} color={Colors.softWhite} />
              </View>
              <Text style={styles.reqText}>Remove hats/sunglasses</Text>
            </View>

            <View style={styles.reqItem}>
              <View style={styles.reqIcon}>
                <Camera size={24} color={Colors.softWhite} />
              </View>
              <Text style={styles.reqText}>Hold still for a moment</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Start</Text>
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
  closeButton: {
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
  hero: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 45, 0.2)',
  },
  title: {
    ...Typography.h1,
    color: Colors.softWhite,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  requirements: {
    gap: Spacing.lg,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.signalGray,
    padding: Spacing.lg,
    borderRadius: Layout.borderRadius.lg,
  },
  reqIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.darkSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqText: {
    ...Typography.body,
    color: Colors.softWhite,
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
