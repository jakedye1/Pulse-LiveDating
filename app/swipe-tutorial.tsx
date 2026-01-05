import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Heart, X, Star, RotateCcw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

const TUTORIAL_STEPS = [
  {
    icon: Heart,
    title: 'Swipe Right to Like',
    description: 'If you like someone, swipe right or tap the heart',
  },
  {
    icon: X,
    title: 'Swipe Left to Pass',
    description: 'Not interested? Swipe left or tap the X',
  },
  {
    icon: Star,
    title: 'Super Like',
    description: 'Really like someone? Tap the star to stand out',
  },
  {
    icon: RotateCcw,
    title: 'Undo Your Last Swipe',
    description: 'Made a mistake? Use rewind to go back',
  },
];

export default function SwipeTutorialScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < TUTORIAL_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      router.back();
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const currentStep = TUTORIAL_STEPS[step];
  const Icon = currentStep.icon;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&fit=crop' }}
        style={styles.bgImage}
        contentFit="cover"
        blurRadius={20}
      />
      
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}
      >
        <Pressable style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon size={48} color={Colors.pulseRed} />
          </View>

          <Text style={styles.title}>{currentStep.title}</Text>
          <Text style={styles.description}>{currentStep.description}</Text>

          <View style={styles.pagination}>
            {TUTORIAL_STEPS.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === step && styles.dotActive]}
              />
            ))}
          </View>

          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {step === TUTORIAL_STEPS.length - 1 ? 'Got it!' : 'Next'}
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  bgImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  skipBtn: {
    position: 'absolute',
    top: 60,
    right: Spacing.lg,
    padding: Spacing.sm,
  },
  skipText: {
    ...Typography.body,
    color: Colors.softWhite,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.signalGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxxl,
  },
  title: {
    ...Typography.h1,
    color: Colors.softWhite,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
  },
  pagination: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xxxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textTertiary,
  },
  dotActive: {
    backgroundColor: Colors.pulseRed,
    width: 24,
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
