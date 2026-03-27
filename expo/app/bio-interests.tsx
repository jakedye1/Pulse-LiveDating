import { StyleSheet, View, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { X, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

const SUGGESTED_INTERESTS = [
  'Music', 'Travel', 'Fitness', 'Food', 'Art', 'Movies', 
  'Gaming', 'Reading', 'Sports', 'Photography', 'Dancing', 'Cooking'
];

export default function BioInterestsScreen() {
  const router = useRouter();
  const { updateProfile } = useAuth();
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Save profile data
    await updateProfile({ 
      bio: bio,
      interests: selectedInterests
    });
    
    // Navigate to subscription selection
    router.replace('/subscription-selection');
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
            <Text style={styles.stepIndicator}>Step 6 of 8</Text>
            <View style={{ width: 28 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>About You</Text>
            <Text style={styles.subtitle}>
              Share a bit about yourself and your interests
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bio</Text>
              <TextInput
                style={styles.bioInput}
                placeholder="Tell us about yourself..."
                placeholderTextColor={Colors.textTertiary}
                multiline
                maxLength={500}
                value={bio}
                onChangeText={setBio}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{bio.length}/500</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interests (Select up to 5)</Text>
              <View style={styles.interestsGrid}>
                {SUGGESTED_INTERESTS.map(interest => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <Pressable
                      key={interest}
                      style={[styles.interestChip, isSelected && styles.interestChipActive]}
                      onPress={() => toggleInterest(interest)}
                    >
                      <Text style={[styles.interestText, isSelected && styles.interestTextActive]}>
                        {interest}
                      </Text>
                      {isSelected && <X size={14} color={Colors.softWhite} />}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.continueBtn} onPress={handleContinue}>
              <Text style={styles.continueBtnText}>Continue</Text>
            </Pressable>

            <Pressable onPress={handleContinue} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip for now</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
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
  content: {
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
  section: {
    marginBottom: Spacing.xxxl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.softWhite,
    marginBottom: Spacing.md,
  },
  bioInput: {
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.xl,
    padding: Spacing.lg,
    ...Typography.body,
    color: Colors.softWhite,
    minHeight: 140,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  charCount: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'right',
    marginTop: Spacing.sm,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  interestChipActive: {
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
    borderColor: Colors.pulseRed,
  },
  interestText: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  interestTextActive: {
    color: Colors.pulseRed,
    fontWeight: '600',
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
    marginBottom: Spacing.md,
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
  skipBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  skipText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: 15,
  },
});
