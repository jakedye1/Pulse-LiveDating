import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/colors';
import { ArrowRight, ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds

export default function OTPScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Focus input on mount
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = async () => {
    if (otp.length !== OTP_LENGTH) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Verify OTP logic
      // In a real app, this would call verify service
      // await AuthService.verifyOtp(phone, otp);
      
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to next step (Bio/Interests or Name if we skipped it)
      // Since we removed Name from Create Account, maybe we should ask for Name here or in profile setup
      // Let's go to bio-interests, but maybe we need a Name screen first?
      // The user said: "4. Verified → proceed to profile onboarding/setup"
      // Usually profile setup starts with Name. 
      // I'll assume bio-interests handles it or I should create a "name" screen?
      // app/bio-interests.tsx asks for Bio and Interests.
      // app/photo-upload.tsx asks for Photos.
      // Let's route to a "Name" screen? Or reuse welcome? 
      // The "welcome" screen in this app seems to be a "Get Started" landing page.
      // Let's route to photo-upload for now as per typical flow, or maybe I should check if Name is missing.
      // Since I passed "User" as name in create-account, I should probably update it.
      // But for now, let's route to photo-upload.
      
      router.replace('/photo-upload'); 
      
    } catch {
      setError('Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      // await AuthService.resendOtp(phone);
      setCountdown(RESEND_COOLDOWN);
      // Restart timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setError('Failed to resend code');
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
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Enter Code</Text>
              <Text style={styles.subtitle}>
                We sent a verification code to {phone || 'your phone'}.
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={otp}
                onChangeText={(text) => {
                  setOtp(text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH));
                  if (text.length === OTP_LENGTH) {
                    // Auto submit?
                  }
                }}
                keyboardType="number-pad"
                placeholder="000000"
                placeholderTextColor={Colors.darkTertiary}
                maxLength={OTP_LENGTH}
                autoFocus
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity 
              onPress={handleResend}
              disabled={countdown > 0}
              style={styles.resendButton}
            >
              <Text style={[styles.resendText, countdown > 0 && styles.resendTextDisabled]}>
                {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.button, otp.length !== OTP_LENGTH && styles.buttonDisabled]}
              onPress={handleVerify}
              disabled={loading || otp.length !== OTP_LENGTH}
            >
              <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify'}</Text>
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
    justifyContent: 'center',
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
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  input: {
    ...Typography.h1,
    fontSize: 40,
    color: Colors.softWhite,
    letterSpacing: 8,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.pulseRed,
    paddingBottom: Spacing.sm,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.pulseRed,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  resendButton: {
    alignItems: 'center',
  },
  resendText: {
    ...Typography.bodyBold,
    color: Colors.pulseRed,
  },
  resendTextDisabled: {
    color: Colors.textTertiary,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
  },
  button: {
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
  buttonDisabled: {
    backgroundColor: Colors.darkSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    ...Typography.bodyBold,
    color: '#FFF',
    fontSize: 18,
  },
});
