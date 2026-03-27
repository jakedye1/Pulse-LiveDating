import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const router = useRouter();
  const { user, isLoading, onboardingComplete, consentComplete } = useAuth();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.5,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Minimum splash time to prevent flicker
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [scaleAnim, opacityAnim]);

  useEffect(() => {
    // Wait for both auth loading to finish AND minimum time to elapse
    if (isLoading || !minTimeElapsed || hasNavigated.current) {
      return;
    }

    const navigate = async () => {
      if (hasNavigated.current) return;
      hasNavigated.current = true;

      console.log('[Splash] Navigating...', { 
        hasUser: !!user, 
        onboardingComplete, 
        consentComplete 
      });
      
      try {
        if (!user) {
          console.log('[Splash] No user, going to login');
          router.replace('/login');
          return;
        }

        // Check for incomplete profile steps
        if (!user.mode) {
          console.log('[Splash] Mode not set -> mode-selection');
          router.replace('/mode-selection');
        } else if (!user.interested_in || user.interested_in.length === 0) {
          console.log('[Splash] InterestedIn not set -> interested-in');
          router.replace('/interested-in');
        } else if (!user.avatar_url) {
          console.log('[Splash] Photo not set -> photo-upload');
          router.replace('/photo-upload');
        } else if (!user.bio && (!user.interests || user.interests.length === 0)) { 
          console.log('[Splash] Bio/interests not set -> bio-interests');
          router.replace('/bio-interests');
        } else if (!consentComplete) {
          console.log('[Splash] Consent not complete -> legal-consent');
          router.replace('/legal-consent');
        } else {
          console.log('[Splash] All complete -> home');
          router.replace('/(tabs)/home');
        }
      } catch (error) {
        console.error('[Splash] Navigation failed:', error);
        // Fallback to login in case of error
        router.replace('/login');
      }
    };

    navigate();
  }, [isLoading, minTimeElapsed, user, onboardingComplete, consentComplete, router]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Animated.View
              style={[
                styles.pulse,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                },
              ]}
            />
            <Image
              source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/s85ba7eduohmraeungsvo' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.appName}>PULSE</Text>
            <Text style={styles.tagline}>Find your rhythm.</Text>
          </View>
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    flexGrow: 1, 
    maxHeight: '60%', 
  },
  logo: {
    width: 160,
    height: 160,
    zIndex: 1,
  },
  pulse: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.pulseRed,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.softWhite,
    letterSpacing: 4,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 1,
  },
});
