import { StyleSheet, View, Text } from 'react-native';
import { Wrench } from 'lucide-react-native';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';

export default function MaintenanceScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Wrench size={48} color={Colors.pulseRed} />
        </View>

        <Text style={styles.title}>Under Maintenance</Text>
        <Text style={styles.subtitle}>
          Pulse is currently undergoing maintenance. We&apos;ll be back soon!
        </Text>

        <Text style={styles.note}>
          Check back in a few minutes
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
  note: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
