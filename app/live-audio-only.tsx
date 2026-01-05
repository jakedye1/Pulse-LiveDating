import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Mic, MicOff, PhoneOff, VideoOff } from 'lucide-react-native';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';

export default function LiveAudioOnlyScreen() {
  const router = useRouter();
  const [micOn, setMicOn] = useState(true);

  const handleToggleMic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMicOn(!micOn);
  };

  const handleEndCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/live-call-ended');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.modeIndicator}>
          <VideoOff size={16} color={Colors.softWhite} />
          <Text style={styles.modeText}>Audio Only</Text>
        </View>

        <View style={styles.avatarsContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' }}
              style={styles.avatar}
              contentFit="cover"
            />
            <Text style={styles.avatarName}>Sarah</Text>
          </View>

          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' }}
              style={styles.avatar}
              contentFit="cover"
            />
            <Text style={styles.avatarName}>You</Text>
          </View>
        </View>

        <View style={styles.timer}>
          <View style={styles.recordingDot} />
          <Text style={styles.timerText}>02:45</Text>
        </View>

        <View style={styles.controls}>
          <Pressable
            style={styles.controlBtn}
            onPress={handleToggleMic}
          >
            {micOn ? (
              <Mic size={28} color={Colors.softWhite} />
            ) : (
              <MicOff size={28} color={Colors.pulseRed} />
            )}
          </Pressable>

          <Pressable
            style={[styles.controlBtn, styles.endCallBtn]}
            onPress={handleEndCall}
          >
            <PhoneOff size={32} color={Colors.softWhite} fill={Colors.softWhite} />
          </Pressable>
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
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.signalGray,
    borderRadius: 20,
    marginBottom: Spacing.xxxl,
  },
  modeText: {
    ...Typography.caption,
    color: Colors.softWhite,
    fontWeight: '600',
  },
  avatarsContainer: {
    flexDirection: 'row',
    gap: Spacing.xxxl,
    marginBottom: Spacing.xxxl,
  },
  avatarWrapper: {
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.pulseRed,
    marginBottom: Spacing.md,
  },
  avatarName: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxxl,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.pulseRed,
  },
  timerText: {
    ...Typography.h3,
    color: Colors.softWhite,
  },
  controls: {
    flexDirection: 'row',
    gap: Spacing.xxxl,
    alignItems: 'center',
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.signalGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCallBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.pulseRed,
  },
});
