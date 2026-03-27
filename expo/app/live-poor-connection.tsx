import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

export default function LivePoorConnectionScreen() {
  const router = useRouter();

  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  };

  const handleSwitchAudio = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/live-audio-only');
  };

  const handleEndCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)/live');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <WifiOff size={48} color={Colors.pulseRed} />
        </View>

        <Text style={styles.title}>Poor Connection</Text>
        <Text style={styles.subtitle}>
          Your connection is unstable. Try switching to audio-only or reconnecting.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Tips for better connection:</Text>
          <Text style={styles.infoText}>• Move closer to your WiFi router</Text>
          <Text style={styles.infoText}>• Switch to WiFi if on cellular</Text>
          <Text style={styles.infoText}>• Close other apps</Text>
        </View>

        <Pressable style={styles.retryBtn} onPress={handleRetry}>
          <RefreshCw size={20} color={Colors.softWhite} />
          <Text style={styles.retryBtnText}>Retry Connection</Text>
        </Pressable>

        <Pressable style={styles.audioBtn} onPress={handleSwitchAudio}>
          <Text style={styles.audioBtnText}>Switch to Audio Only</Text>
        </Pressable>

        <Pressable style={styles.endBtn} onPress={handleEndCall}>
          <Text style={styles.endBtnText}>End Call</Text>
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
  infoCard: {
    width: '100%',
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    marginBottom: Spacing.xxxl,
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
  retryBtn: {
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
  retryBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  audioBtn: {
    width: '100%',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
  },
  audioBtnText: {
    ...Typography.body,
    color: Colors.pulseRed,
    textAlign: 'center',
  },
  endBtn: {
    paddingVertical: Spacing.md,
  },
  endBtnText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
