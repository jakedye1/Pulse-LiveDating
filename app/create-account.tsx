import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { ArrowRight, Lock, Mail, ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import { AuthService } from '@/services/auth';

export default function CreateAccountScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) return;
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      // Initiate sign up
      await AuthService.signUp(email, 'User', password); // Temporary name 'User'
      
      // Navigate to onboarding
      router.replace('/onboarding');
    } catch (error) {
      console.error(error);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color={Colors.softWhite} />
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>Create Account</Text>
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
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Get Started</Text>
              <Text style={styles.subtitle}>Enter your email and password to create an account.</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Mail color={Colors.textTertiary} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor={Colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock color={Colors.textTertiary} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={Colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock color={Colors.textTertiary} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor={Colors.textTertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}
            </View>
          </ScrollView>

            <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.signupButton, (!email || !password || !confirmPassword) && styles.disabledButton]}
              onPress={handleSignup}
              disabled={loading || !email || !password || !confirmPassword}
            >
              <Text style={styles.signupButtonText}>{loading ? 'Please wait...' : 'Continue'}</Text>
              {!loading && <ArrowRight color="#FFF" size={20} />}
            </TouchableOpacity>
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
  stepIndicator: {
    ...Typography.captionBold,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  titleContainer: {
    marginBottom: Spacing.xxxl,
    marginTop: Spacing.sm,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  form: {
    marginBottom: Spacing.xl,
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.xl,
    paddingHorizontal: Spacing.lg,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginRight: 16,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 17,
    height: '100%',
    fontWeight: '500',
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    backgroundColor: Colors.voidBlack,
  },
  signupButton: {
    backgroundColor: Colors.pulseRed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: Layout.borderRadius.full,
    gap: 8,
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
  signupButtonText: {
    ...Typography.bodyBold,
    color: '#FFF',
    fontSize: 18,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.pulseRed,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
