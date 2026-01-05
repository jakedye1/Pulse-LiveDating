import { StyleSheet, View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { CheckCircle, Circle, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import { useAuth } from '@/context/AuthContext';

type Gender = 'men' | 'women' | 'nonbinary' | 'everyone';

export default function InterestedInScreen() {
  const router = useRouter();
  const { updateProfile } = useAuth();
  const [selected, setSelected] = useState<Gender[]>([]);

  const handleToggle = (gender: Gender) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (gender === 'everyone') {
      setSelected(['everyone']);
    } else {
      const filtered = selected.filter(g => g !== 'everyone');
      if (filtered.includes(gender)) {
        setSelected(filtered.filter(g => g !== gender));
      } else {
        setSelected([...filtered, gender]);
      }
    }
  };

  const handleContinue = async () => {
    if (selected.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    await updateProfile({ interested_in: selected });
    
    router.push('/location-permission');
  };

  const options: { value: Gender; label: string; emoji: string }[] = [
    { value: 'men', label: 'Men', emoji: '👨' },
    { value: 'women', label: 'Women', emoji: '👩' },
    { value: 'nonbinary', label: 'Non-binary', emoji: '🧑' },
    { value: 'everyone', label: 'Everyone', emoji: '✨' },
  ];

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
            <Text style={styles.stepIndicator}>Step 3 of 8</Text>
            <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>Who do you want to see?</Text>
          <Text style={styles.subtitle}>
            Select everyone you&apos;re interested in meeting.
          </Text>

          <View style={styles.optionsContainer}>
            {options.map(option => {
              const isSelected = selected.includes(option.value);
              
              return (
                <Pressable
                  key={option.value}
                  style={[styles.optionCard, isSelected && styles.optionActive]}
                  onPress={() => handleToggle(option.value)}
                >
                  <Text style={styles.emoji}>{option.emoji}</Text>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  {isSelected ? (
                    <CheckCircle size={24} color={Colors.pulseRed} fill={Colors.pulseRed} />
                  ) : (
                    <Circle size={24} color={Colors.textTertiary} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[styles.continueBtn, selected.length === 0 && styles.continueDisabled]}
            onPress={handleContinue}
            disabled={selected.length === 0}
          >
            <Text style={[styles.continueBtnText, selected.length === 0 && styles.continueDisabledText]}>
              Continue
            </Text>
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
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  optionActive: {
    borderColor: Colors.pulseRed,
    backgroundColor: 'rgba(255, 45, 45, 0.05)',
  },
  emoji: {
    fontSize: 28,
  },
  optionLabel: {
    ...Typography.h3,
    color: Colors.softWhite,
    flex: 1,
    fontSize: 18,
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
  continueDisabled: {
    backgroundColor: Colors.darkSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 18,
  },
  continueDisabledText: {
    color: Colors.textTertiary,
  },
});
