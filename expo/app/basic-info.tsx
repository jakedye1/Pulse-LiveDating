import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import { ChevronLeft, Check } from 'lucide-react-native';

export default function BasicInfoScreen() {
  const router = useRouter();
  const { updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'man' | 'woman' | 'nonbinary' | null>(null);
  
  const handleContinue = async () => {
    if (!name.trim() || !gender) return;
    
    await updateProfile({ 
      name: name.trim(),
      gender: gender
    });
    
    // Proceed to mode selection
    router.push('/mode-selection');
  };

  const GenderOption = ({ value, label }: { value: 'man' | 'woman' | 'nonbinary', label: string }) => (
    <Pressable 
      style={[
        styles.genderOption, 
        gender === value && styles.genderOptionSelected
      ]}
      onPress={() => setGender(value)}
    >
      <Text style={[
        styles.genderText,
        gender === value && styles.genderTextSelected
      ]}>{label}</Text>
      {gender === value && <Check size={20} color={Colors.pulseRed} />}
    </Pressable>
  );

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
            <Text style={styles.stepIndicator}>Step 1 of 8</Text>
            <View style={{ width: 28 }} />
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Basic Info</Text>
            <Text style={styles.subtitle}>
              Tell us a bit about yourself.
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Your Name"
                    placeholderTextColor={Colors.textTertiary}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                  <GenderOption value="man" label="Man" />
                  <GenderOption value="woman" label="Woman" />
                  <GenderOption value="nonbinary" label="Non-binary" />
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable 
              style={[styles.continueBtn, (!name.trim() || !gender) && styles.disabledButton]}
              onPress={handleContinue}
              disabled={!name.trim() || !gender}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
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
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxxl,
  },
  form: {
    gap: Spacing.xl,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.xl,
    paddingHorizontal: Spacing.lg,
    height: 60,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    ...Typography.h3,
    color: Colors.textPrimary,
    height: '100%',
  },
  genderContainer: {
    gap: Spacing.md,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.xl,
    paddingHorizontal: Spacing.lg,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genderOptionSelected: {
    borderColor: Colors.pulseRed,
    backgroundColor: 'rgba(255, 45, 45, 0.05)',
  },
  genderText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 16,
  },
  genderTextSelected: {
    color: Colors.softWhite,
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
    shadowColor: Colors.pulseRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: Colors.darkSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 18,
  },
});
