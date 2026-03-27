import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Users, Video, ArrowRight } from 'lucide-react-native';
import Spacing from '@/constants/spacing';
import Typography from '@/constants/typography';
import Layout from '@/constants/layout';

const { width, height } = Dimensions.get('window');
const IS_SMALL_SCREEN = height < 700;

const SLIDES = [
  {
    id: '1',
    title: 'Find Your Vibe',
    description: 'Whether you’re looking for dating, friends, or groups, Pulse adapts to you.',
    icon: <Heart size={IS_SMALL_SCREEN ? 56 : 72} color={Colors.pulseRed} fill={Colors.pulseRed} />,
  },
  {
    id: '2',
    title: 'Live Moments',
    description: 'Connect instantly through live video. No catfishing, just real connections.',
    icon: <Video size={IS_SMALL_SCREEN ? 56 : 72} color={Colors.pulseRed} fill={Colors.pulseRed} />,
  },
  {
    id: '3',
    title: 'Safe Community',
    description: 'A verified community where respect and safety come first.',
    icon: <Users size={IS_SMALL_SCREEN ? 56 : 72} color={Colors.pulseRed} fill={Colors.pulseRed} />,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/age-gate');
    }
  };

  const handleSkip = async () => {
    router.push('/age-gate');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sliderContainer}>
          <FlatList
            ref={flatListRef}
            data={SLIDES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <View style={styles.slideContent}>
                  <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                      {item.icon}
                    </View>
                    <View style={styles.iconGlow} />
                  </View>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            {currentIndex !== SLIDES.length - 1 && <ArrowRight size={20} color="#FFF" />}
          </TouchableOpacity>
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
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.xl,
    zIndex: 10,
  },
  skipButton: {
    padding: Spacing.sm,
  },
  skipText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sliderContainer: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: Spacing.xxl,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  iconCircle: {
    width: IS_SMALL_SCREEN ? 120 : 140,
    height: IS_SMALL_SCREEN ? 120 : 140,
    borderRadius: IS_SMALL_SCREEN ? 60 : 70,
    backgroundColor: Colors.signalGray,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: Colors.darkSecondary,
  },
  iconGlow: {
    position: 'absolute',
    width: IS_SMALL_SCREEN ? 180 : 220,
    height: IS_SMALL_SCREEN ? 180 : 220,
    borderRadius: IS_SMALL_SCREEN ? 90 : 110,
    backgroundColor: Colors.pulseRed,
    opacity: 0.15,
    zIndex: 1,
    transform: [{ scale: 0.8 }],
  },
  title: {
    ...Typography.h1,
    fontSize: IS_SMALL_SCREEN ? 28 : 34,
    color: Colors.softWhite,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    fontSize: IS_SMALL_SCREEN ? 16 : 17,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    backgroundColor: Colors.voidBlack,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.darkTertiary,
  },
  activeDot: {
    backgroundColor: Colors.pulseRed,
    width: 24,
  },
  button: {
    backgroundColor: Colors.pulseRed,
    height: 56,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: Colors.pulseRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    ...Typography.bodyBold,
    color: '#FFF',
    fontSize: 18,
  },
});
