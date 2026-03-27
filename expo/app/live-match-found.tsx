import { StyleSheet, View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Video } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';


export default function LiveMatchFoundScreen() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          router.replace('/(tabs)/live');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.topText}>Pulse detected</Text>

        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View style={styles.pulseRing1} />
          <View style={styles.pulseRing2} />
        </View>

        <Text style={styles.name}>Sarah, 23</Text>
        <Text style={styles.subtitle}>Connecting in {countdown}...</Text>

        <View style={styles.iconContainer}>
          <Video size={32} color={Colors.pulseRed} />
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  topText: {
    ...Typography.h3,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxxl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: Colors.pulseRed,
  },
  pulseRing1: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: Colors.pulseRed,
    top: -10,
    left: -10,
    opacity: 0.5,
  },
  pulseRing2: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 2,
    borderColor: Colors.pulseRed,
    top: -20,
    left: -20,
    opacity: 0.3,
  },
  name: {
    ...Typography.h1,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxxl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.signalGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
