import { StyleSheet, View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Heart, Users, Sparkles, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import { useAuth } from '@/context/AuthContext';
import { useAppMode, AppMode } from '@/context/AppModeContext';

export default function ModeSelectionScreen() {
  const router = useRouter();
  const { setMode } = useAppMode();
  const { updateProfile } = useAuth();
  const [selectedMode, setSelectedMode] = useState<AppMode>('dating');

  const handleSelect = (mode: AppMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMode(mode);
  };

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMode(selectedMode);
    
    // Save mode to user profile
    await updateProfile({ mode: selectedMode });
    
    router.push('/interested-in');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable 
            onPress={() => router.back()} 
            style={styles.backButton}
            hitSlop={20}
          >
            <ChevronLeft color={Colors.softWhite} size={28} />
          </Pressable>
          <Text style={styles.stepIndicator}>Step 2 of 8</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>What brings you here?</Text>
          <Text style={styles.subtitle}>
            Choose your vibe. You can change this later.
          </Text>

          <View style={styles.optionsContainer}>
            <Pressable
              style={[styles.optionCard, selectedMode === 'dating' && styles.optionActive]}
              onPress={() => handleSelect('dating')}
            >
              <View style={[styles.optionContent, selectedMode === 'dating' && styles.optionContentActive]}>
                <View style={[styles.iconCircle, selectedMode === 'dating' && styles.iconCircleActive]}>
                  <Heart 
                    size={28} 
                    color={selectedMode === 'dating' ? Colors.softWhite : Colors.pulseRed} 
                    fill={selectedMode === 'dating' ? Colors.pulseRed : 'transparent'}
                  />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.optionTitle}>Dating</Text>
                    <Text style={styles.optionDesc}>
                        Find meaningful connections
                    </Text>
                </View>
              </View>
            </Pressable>

            <Pressable
              style={[styles.optionCard, selectedMode === 'groups' && styles.optionActive]}
              onPress={() => handleSelect('groups')}
            >
              <View style={[styles.optionContent, selectedMode === 'groups' && styles.optionContentActive]}>
                <View style={[styles.iconCircle, selectedMode === 'groups' && styles.iconCircleActive]}>
                  <Users 
                    size={28} 
                    color={selectedMode === 'groups' ? Colors.softWhite : Colors.textSecondary}
                  />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.optionTitle}>Groups</Text>
                    <Text style={styles.optionDesc}>
                        Join communities & talk
                    </Text>
                </View>
              </View>
            </Pressable>

            <Pressable
              style={[styles.optionCard, selectedMode === 'friends' && styles.optionActive]}
              onPress={() => handleSelect('friends')}
            >
              <View style={[styles.optionContent, selectedMode === 'friends' && styles.optionContentActive]}>
                <View style={[styles.iconCircle, selectedMode === 'friends' && styles.iconCircleActive]}>
                  <Sparkles 
                    size={28} 
                    color={selectedMode === 'friends' ? Colors.softWhite : Colors.textSecondary}
                  />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.optionTitle}>Friends</Text>
                    <Text style={styles.optionDesc}>
                        Expand your social circle
                    </Text>
                </View>
              </View>
            </Pressable>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueBtnText}>Continue</Text>
          </Pressable>
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
    paddingHorizontal: Spacing.xl,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  stepIndicator: {
    ...Typography.captionBold,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: 40,
  },
  title: {
    ...Typography.h1,
    color: Colors.softWhite,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
  },
  optionsContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  optionCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionActive: {
    borderColor: Colors.pulseRed,
    backgroundColor: 'rgba(255, 45, 45, 0.05)',
  },
  optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
  },
  optionContentActive: {
      
  },
  textContainer: {
      flex: 1,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.darkSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    backgroundColor: Colors.pulseRed,
  },
  optionTitle: {
    ...Typography.h3,
    color: Colors.softWhite,
    marginBottom: 4,
    fontSize: 18,
  },
  optionDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    backgroundColor: Colors.voidBlack,
  },
  continueBtn: {
    width: '100%',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    shadowColor: Colors.pulseRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  continueBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 18,
  },
});
