import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { Mail } from 'lucide-react-native';
import Layout from '@/constants/layout';
import Spacing from '@/constants/spacing';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReset = async () => {
    if (!email) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>Enter your email to receive reset instructions</Text>
            </View>

            {submitted ? (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>
                  If an account exists for {email}, we sent instructions to reset your password.
                </Text>
                
                <TouchableOpacity 
                  style={styles.backToLoginButton}
                  onPress={() => router.back()}
                >
                  <Text style={styles.backToLoginText}>Back to Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => setSubmitted(false)}
                >
                  <Text style={styles.secondaryButtonText}>Try another email</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Mail color={Colors.textTertiary} size={20} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={Colors.textTertiary}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.resetButton, !email && styles.disabledButton]}
                  onPress={handleReset}
                  disabled={loading || !email}
                >
                  <Text style={styles.resetButtonText}>{loading ? 'Sending...' : 'Send Reset Link'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  backButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.xl,
    marginBottom: Spacing.lg,
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
  resetButton: {
    backgroundColor: Colors.pulseRed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: Layout.borderRadius.full,
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
  resetButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  successContainer: {
    backgroundColor: Colors.signalGray,
    padding: 24,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  successText: {
    color: Colors.textPrimary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  backToLoginButton: {
    backgroundColor: Colors.pulseRed,
    height: 56,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    width: '100%',
  },
  backToLoginText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    padding: 12,
  },
  secondaryButtonText: {
    color: Colors.pulseRed,
    fontSize: 16,
    fontWeight: '600',
  },
});
