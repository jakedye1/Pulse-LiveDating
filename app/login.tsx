import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/colors';
import { ArrowRight, Lock, Mail } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Typography from '@/constants/typography';
import Layout from '@/constants/layout';

// const { height } = Dimensions.get('window');
// const isSmallDevice = height < 700;

export default function LoginScreen() {
  const router = useRouter();
  const { login, user, onboardingComplete, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log('[LoginScreen] Mounted');
    if (!isLoading && user && onboardingComplete) {
      console.log('[LoginScreen] User already logged in & onboarding complete, redirecting to home');
      router.replace('/(tabs)/home');
    }
  }, [user, onboardingComplete, isLoading, router]);

  const handleLogin = async () => {
    console.log('[LoginScreen] Attempting login with:', email);
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email);
      console.log('[LoginScreen] Login successful, redirecting to home');
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('[LoginScreen] Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent, 
            { 
              paddingTop: Math.max(insets.top + 20, 60),
              paddingBottom: Math.max(insets.bottom + 20, 40)
            }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentWrapper}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoPulse} />
                <Text style={styles.appName}>PULSE</Text>
              </View>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>Log in to continue your journey</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Mail color={Colors.textTertiary} size={20} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email or Phone"
                    placeholderTextColor={Colors.textTertiary}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
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
              </View>

              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={() => router.push('/forgot-password')}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              <View style={styles.actionGroup}>
                <TouchableOpacity 
                  style={[styles.loginButton, (!email || !password) && styles.disabledButton]}
                  onPress={handleLogin}
                  disabled={loading || !email || !password}
                >
                  <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Log In'}</Text>
                  {!loading && <ArrowRight color="#FFF" size={20} />}
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity style={styles.appleButton} activeOpacity={0.8}>
                  <Text style={styles.appleButtonText}>Continue with Apple</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/create-account')}>
              <Text style={styles.createAccountText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center', // This ensures vertical centering when content is smaller than screen
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 500, // Constrain width on larger screens/tablets
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 48,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  logoPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.pulseRed,
    opacity: 0.2,
    top: -10,
    transform: [{ scale: 1.5 }],
  },
  appName: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.softWhite,
    marginTop: 8,
    letterSpacing: 2,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    gap: 16,
  },
  inputGroup: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.xl,
    paddingHorizontal: 20,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: Colors.pulseRed,
    fontSize: 14,
    fontWeight: '500',
  },
  actionGroup: {
    gap: 16,
  },
  loginButton: {
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
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  appleButton: {
    backgroundColor: '#FFF',
    height: 56,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  appleButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 48,
    paddingBottom: 20,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
  createAccountText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});
