import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Smile, MoveLeft, MoveRight, Eye } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

type Step = 'start' | 'left' | 'right' | 'blink' | 'complete';

export default function VerificationLivenessScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('start');
  const [progress, setProgress] = useState(0);

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep('left');
    simulateLiveness();
  };

  const simulateLiveness = () => {
    // Simulate detecting movements
    setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setStep('right');
        setProgress(0.33);
        
        setTimeout(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setStep('blink');
            setProgress(0.66);
            
            setTimeout(() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setStep('complete');
                setProgress(1);
            }, 1500);
        }, 1500);
    }, 1500);
  };

  const handleContinue = () => {
    router.push('/verification-flow/submit');
  };

  const renderInstruction = () => {
    switch (step) {
        case 'start': return "Ready for liveness check?";
        case 'left': return "Turn your head left";
        case 'right': return "Turn your head right";
        case 'blink': return "Blink twice";
        case 'complete': return "Check complete!";
        default: return "";
    }
  };

  const renderIcon = () => {
    switch (step) {
        case 'start': return <Smile size={64} color={Colors.softWhite} />;
        case 'left': return <MoveLeft size={64} color={Colors.pulseRed} />;
        case 'right': return <MoveRight size={64} color={Colors.pulseRed} />;
        case 'blink': return <Eye size={64} color={Colors.pulseRed} />;
        case 'complete': return <Smile size={64} color={Colors.accentGreen} />;
        default: return null;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color={Colors.softWhite} />
          </Pressable>
          <Text style={styles.headerTitle}>Step 2 of 2</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Liveness Check</Text>
          <Text style={styles.subtitle}>
            Follow the instructions to confirm you&apos;re real.
          </Text>

          <View style={styles.livenessContainer}>
             <View style={styles.preview}>
                {renderIcon()}
             </View>
             
             <View style={styles.instructionContainer}>
                <Text style={styles.instructionText}>{renderInstruction()}</Text>
             </View>

             <View style={styles.progressTrack}>
                <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
             </View>
          </View>
        </View>

        <View style={styles.footer}>
          {step === 'start' && (
             <Pressable style={styles.button} onPress={handleStart}>
                <Text style={styles.buttonText}>Begin</Text>
             </Pressable>
          )}

          {step === 'complete' && (
             <Pressable style={styles.button} onPress={handleContinue}>
                <Text style={styles.buttonText}>Continue</Text>
             </Pressable>
          )}
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
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  headerTitle: {
    ...Typography.captionBold,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...Typography.h2,
    color: Colors.softWhite,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  livenessContainer: {
    width: '100%',
    aspectRatio: 3/4,
    borderRadius: Layout.borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.darkSecondary,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.signalGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  instructionContainer: {
    marginBottom: Spacing.xl,
  },
  instructionText: {
    ...Typography.h3,
    color: Colors.softWhite,
    textAlign: 'center',
  },
  progressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: Colors.signalGray,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.pulseRed,
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
