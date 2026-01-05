import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Users, Video } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, scaleAnim, pulseAnim]);

  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/create-account');
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.voidBlack, '#1a0505']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <View style={styles.pulseDot} />
              {[0, 1, 2].map((i) => {
                const scale = pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 2 + i * 0.5],
                });
                const opacity = pulseAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.6 - i * 0.1, 0.3 - i * 0.1, 0],
                });
                
                return (
                  <Animated.View 
                    key={i}
                    style={[
                      styles.pulseRing, 
                      { 
                        transform: [{ scale }],
                        opacity,
                        zIndex: 3 - i
                      }
                    ]} 
                  />
                );
              })}
            </View>

            <Text style={styles.appName}>PULSE</Text>
            <Text style={styles.tagline}>Find your rhythm.</Text>
          </View>

          <View style={styles.featuresList}>
            <Text style={styles.welcomeText}>
              The all-in-one app for meaningful connections.
            </Text>
            
            <View style={styles.iconsRow}>
              <View style={styles.iconItem}>
                <View style={styles.iconCircle}>
                  <Heart size={24} color={Colors.pulseRed} fill={Colors.pulseRed} />
                </View>
                <Text style={styles.iconLabel}>Date</Text>
              </View>
              <View style={styles.iconItem}>
                <View style={styles.iconCircle}>
                  <Users size={24} color={Colors.pulseRed} />
                </View>
                <Text style={styles.iconLabel}>Groups</Text>
              </View>
              <View style={styles.iconItem}>
                <View style={styles.iconCircle}>
                  <Video size={24} color={Colors.pulseRed} />
                </View>
                <Text style={styles.iconLabel}>Live</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <Pressable 
            style={styles.getStartedButton}
            onPress={handleGetStarted}
          >
            <LinearGradient
              colors={[Colors.pulseRed, Colors.accentRed]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.loginText}>I already have an account</Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    position: 'relative',
  },
  pulseDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.pulseRed,
    zIndex: 4,
    shadowColor: Colors.pulseRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  pulseRing: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.pulseRed,
    width: 32,
    height: 32,
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.softWhite,
    letterSpacing: 6,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 1,
  },
  featuresList: {
    alignItems: 'center',
    width: '100%',
  },
  welcomeText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    fontSize: 16,
    maxWidth: '80%',
  },
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  iconItem: {
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
  },
  getStartedButton: {
    borderRadius: Layout.borderRadius.full,
    overflow: 'hidden',
    shadowColor: Colors.pulseRed,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: Spacing.lg,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 18,
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  loginText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 16,
  },
});
