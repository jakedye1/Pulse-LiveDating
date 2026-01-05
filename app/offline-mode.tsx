import { StyleSheet, View, Text, Pressable } from 'react-native';
import { WifiOff } from 'lucide-react-native';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

export default function OfflineModeScreen() {
  const handleRetry = () => {
    // Implement retry logic
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <WifiOff size={48} color={Colors.pulseRed} />
        </View>

        <Text style={styles.title}>No Connection</Text>
        <Text style={styles.subtitle}>
          You&apos;re offline. Check your internet connection and try again.
        </Text>

        <Pressable style={styles.retryBtn} onPress={handleRetry}>
          <Text style={styles.retryBtnText}>Retry</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
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
  retryBtn: {
    width: '100%',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
  },
  retryBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
});
