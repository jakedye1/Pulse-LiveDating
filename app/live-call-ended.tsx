import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, MessageCircle, X, Flag } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

export default function LiveCallEndedScreen() {
  const router = useRouter();

  const handleKeep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(tabs)/messages');
  };

  const handleMessage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(tabs)/messages');
  };

  const handlePass = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)/live');
  };

  const handleReport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/report-problem');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' }}
          style={styles.avatar}
          contentFit="cover"
        />

        <Text style={styles.name}>Sarah, 23</Text>
        <Text style={styles.subtitle}>What do you want to do?</Text>

        <View style={styles.actions}>
          <Pressable style={styles.actionCard} onPress={handleKeep}>
            <View style={[styles.actionIcon, styles.actionIconKeep]}>
              <Heart size={32} color={Colors.pulseRed} fill={Colors.pulseRed} />
            </View>
            <Text style={styles.actionLabel}>Keep</Text>
            <Text style={styles.actionDesc}>Save to matches</Text>
          </Pressable>

          <Pressable style={styles.actionCard} onPress={handleMessage}>
            <View style={[styles.actionIcon, styles.actionIconMessage]}>
              <MessageCircle size={32} color={Colors.softWhite} />
            </View>
            <Text style={styles.actionLabel}>Message</Text>
            <Text style={styles.actionDesc}>Start chatting</Text>
          </Pressable>
        </View>

        <View style={styles.secondaryActions}>
          <Pressable style={styles.secondaryBtn} onPress={handlePass}>
            <X size={20} color={Colors.textSecondary} />
            <Text style={styles.secondaryText}>Pass</Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={handleReport}>
            <Flag size={20} color={Colors.textSecondary} />
            <Text style={styles.secondaryText}>Report</Text>
          </Pressable>
        </View>

        <Pressable style={styles.nextBtn} onPress={handlePass}>
          <Text style={styles.nextBtnText}>Next Match</Text>
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
    paddingTop: 80,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: Spacing.lg,
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
  actions: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
    width: '100%',
  },
  actionCard: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    alignItems: 'center',
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  actionIconKeep: {
    backgroundColor: 'rgba(255,45,45,0.1)',
  },
  actionIconMessage: {
    backgroundColor: Colors.darkSecondary,
  },
  actionLabel: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: Spacing.xs,
  },
  actionDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: Spacing.xl,
    marginBottom: Spacing.xxxl,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  secondaryText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  nextBtn: {
    width: '100%',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
  },
  nextBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
});
