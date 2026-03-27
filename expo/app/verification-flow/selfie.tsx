import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, RefreshCcw, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

export default function VerificationSelfieScreen() {
  const router = useRouter();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Mock capture
    setCapturedImage('mock-selfie-uri');
  };

  const handleRetake = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCapturedImage(null);
  };

  const handleContinue = () => {
    if (!capturedImage) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/verification-flow/liveness');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color={Colors.softWhite} />
          </Pressable>
          <Text style={styles.headerTitle}>Step 1 of 2</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Take a selfie</Text>
          <Text style={styles.subtitle}>
            Make sure your face is clearly visible.
          </Text>

          <View style={styles.cameraContainer}>
            {capturedImage ? (
              <View style={styles.capturedPreview}>
                 <View style={styles.placeholderFace} />
                 <View style={styles.checkBadge}>
                    <Check size={32} color={Colors.softWhite} strokeWidth={3} />
                 </View>
              </View>
            ) : (
              <View style={styles.cameraPreview}>
                 <View style={styles.cameraOverlay}>
                    <View style={styles.faceGuide} />
                 </View>
                 <Text style={styles.cameraText}>Camera Preview</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          {capturedImage ? (
            <View style={styles.actionButtons}>
               <Pressable style={styles.retakeButton} onPress={handleRetake}>
                 <RefreshCcw size={20} color={Colors.softWhite} />
                 <Text style={styles.retakeText}>Retake</Text>
               </Pressable>
               <Pressable style={styles.primaryButton} onPress={handleContinue}>
                 <Text style={styles.buttonText}>Continue</Text>
               </Pressable>
            </View>
          ) : (
            <Pressable style={styles.captureButton} onPress={handleCapture}>
               <View style={styles.captureInner} />
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
  cameraContainer: {
    width: '100%',
    aspectRatio: 3/4,
    borderRadius: Layout.borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.darkSecondary,
    position: 'relative',
  },
  cameraPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  cameraText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceGuide: {
    width: 200,
    height: 280,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
  },
  capturedPreview: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderFace: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.signalGray,
  },
  checkBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.pulseRed,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.voidBlack,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: Colors.softWhite,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.softWhite,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    width: '100%',
  },
  retakeButton: {
    flex: 1,
    height: 56,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.signalGray,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  retakeText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  primaryButton: {
    flex: 2,
    height: 56,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.pulseRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 18,
  },
});
