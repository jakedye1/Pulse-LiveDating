import { StyleSheet, View, Text, Pressable, ScrollView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

export default function LocationPermissionScreen() {
  const router = useRouter();

  const handleAllow = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (Platform.OS !== 'web') {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status === 'granted') {
          router.push('/photo-upload');
        } else {
          Alert.alert(
            'Location Required',
            'Pulse needs your location to show you nearby people. Please enable location in settings.',
            [
              { text: 'Skip', onPress: () => router.push('/photo-upload') },
              { text: 'OK' }
            ]
          );
        }
      } catch (error) {
        console.error('Location permission error:', error);
        router.push('/photo-upload');
      }
    } else {
      router.push('/photo-upload');
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/photo-upload');
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
            <Text style={styles.stepIndicator}>Step 4 of 8</Text>
            <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <MapPin size={48} color={Colors.pulseRed} fill={Colors.pulseRed} />
              <View style={styles.iconGlow} />
            </View>

            <Text style={styles.title}>Enable Location</Text>
            <Text style={styles.subtitle}>
              See people near you and discover matches in your area
            </Text>

            <View style={styles.benefitsContainer}>
              <View style={styles.benefitRow}>
                <View style={styles.iconCircle}>
                  <MapPin size={20} color={Colors.softWhite} />
                </View>
                <Text style={styles.benefitText}>Find matches nearby</Text>
              </View>
              <View style={styles.benefitRow}>
                <View style={styles.iconCircle}>
                   <MapPin size={20} color={Colors.softWhite} />
                </View>
                <Text style={styles.benefitText}>See distance to others</Text>
              </View>
              <View style={styles.benefitRow}>
                <View style={styles.iconCircle}>
                   <MapPin size={20} color={Colors.softWhite} />
                </View>
                <Text style={styles.benefitText}>Discover local events</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.allowBtn} onPress={handleAllow}>
            <Text style={styles.allowBtnText}>Allow Location</Text>
          </Pressable>

          <Pressable style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipBtnText}>Maybe later</Text>
          </Pressable>

          <Text style={styles.privacyNote}>
            Your exact location is never shared with others. Only approximate distance is shown.
          </Text>
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
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.signalGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.darkSecondary,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.pulseRed,
    opacity: 0.1,
    zIndex: -1,
  },
  title: {
    ...Typography.h1,
    color: Colors.softWhite,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
    lineHeight: 24,
  },
  benefitsContainer: {
    width: '100%',
    padding: Spacing.sm,
    gap: Spacing.lg,
    marginBottom: Spacing.xxxl,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.darkSecondary,
      alignItems: 'center',
      justifyContent: 'center',
  },
  benefitText: {
    ...Typography.body,
    color: Colors.softWhite,
    fontSize: 17,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.voidBlack,
  },
  allowBtn: {
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
  allowBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 18,
  },
  skipBtn: {
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  skipBtnText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  privacyNote: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
    fontSize: 12,
  },
});
