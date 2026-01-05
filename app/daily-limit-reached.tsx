import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, Zap, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

export default function DailyLimitReachedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleUpgrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/paywall');
  };

  const handleHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Use navigate to go back to the existing home tab and close the modal
    router.navigate('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80' }}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', Colors.voidBlack]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
      />

      <View style={[styles.closeBtnContainer, { top: insets.top + 10 }]}>
        <Pressable onPress={handleHome} style={styles.closeBtn}>
          <X size={24} color={Colors.softWhite} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.iconWrapper}>
           <BlurView intensity={30} tint="dark" style={styles.iconContainer}>
             <Clock size={56} color={Colors.pulseRed} />
           </BlurView>
           <View style={styles.iconRing} />
        </View>

        <Text style={styles.title}>You&apos;re all out of swipes</Text>
        <Text style={styles.subtitle}>
          You&apos;ve reached your 7 free matches for today. Your swipes will reset in:
        </Text>

        <View style={styles.timerContainer}>
          <BlurView intensity={20} tint="light" style={styles.timerCard}>
             <Text style={styles.timerText}>12:34:56</Text>
             <Text style={styles.timerLabel}>UNTIL RESET</Text>
          </BlurView>
        </View>

        <View style={styles.upgradeCard}>
            <LinearGradient
                colors={['rgba(255, 45, 45, 0.15)', 'rgba(255, 45, 45, 0.05)']}
                style={styles.upgradeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            />
          <View style={styles.upgradeIcon}>
            <Zap size={24} color={Colors.pulseRed} fill={Colors.pulseRed} />
          </View>
          <View style={styles.upgradeContent}>
            <Text style={styles.upgradeTitle}>Skip the wait</Text>
            <Text style={styles.upgradeText}>
              Upgrade to Pulse+ for unlimited matches and more.
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
            <Pressable style={styles.upgradeBtn} onPress={handleUpgrade}>
                <LinearGradient
                    colors={[Colors.pulseRed, Colors.accentRed]}
                    style={styles.btnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                <Text style={styles.upgradeBtnText}>Get Unlimited Matches</Text>
                </LinearGradient>
            </Pressable>

            <Pressable 
              style={({ pressed }) => [
                styles.homeBtn,
                pressed && styles.homeBtnPressed
              ]} 
              onPress={handleHome}
            >
                <Text style={styles.homeBtnText}>Not Now</Text>
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
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  closeBtnContainer: {
    position: 'absolute',
    right: Spacing.lg,
    zIndex: 10,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 60 : 40,
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 45, 0.5)',
    overflow: 'hidden',
    zIndex: 2,
  },
  iconRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 45, 0.2)',
    zIndex: 1,
  },
  title: {
    ...Typography.h1,
    fontSize: 32,
    color: Colors.softWhite,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    maxWidth: '85%',
    lineHeight: 24,
  },
  timerContainer: {
    marginBottom: Spacing.xxxl,
    width: '100%',
    alignItems: 'center',
  },
  timerCard: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
    borderRadius: Layout.borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  timerText: {
    ...Typography.h1,
    fontSize: 48,
    color: Colors.softWhite,
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
    marginBottom: 4,
    fontWeight: '800',
  },
  timerLabel: {
    ...Typography.captionBold,
    color: Colors.pulseRed,
    letterSpacing: 3,
    fontSize: 11,
  },
  upgradeCard: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 45, 0.3)',
  },
  upgradeGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  upgradeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 45, 45, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  upgradeContent: {
    flex: 1,
  },
  upgradeTitle: {
    ...Typography.bodyBold,
    fontSize: 17,
    color: Colors.softWhite,
    marginBottom: 2,
  },
  upgradeText: {
    ...Typography.caption,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  actions: {
    width: '100%',
    gap: Spacing.md,
  },
  upgradeBtn: {
    width: '100%',
    borderRadius: Layout.borderRadius.full,
    overflow: 'hidden',
    ...Layout.shadow.md,
  },
  btnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 17,
    letterSpacing: 0.5,
  },
  homeBtn: {
    width: '100%',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.borderRadius.full,
  },
  homeBtnPressed: {
    opacity: 0.7,
  },
  homeBtnText: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
