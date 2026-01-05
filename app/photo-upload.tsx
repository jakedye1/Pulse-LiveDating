import { StyleSheet, View, Text, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import { useAuth } from '@/context/AuthContext';
import PhotoManager from '@/components/PhotoManager';

export default function PhotoUploadScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.photos && user.photos.length > 0) {
      setPhotos(user.photos);
    }
  }, [user?.photos]);

  const handleContinue = async () => {
    if (photos.length === 0) return;
    
    setIsLoading(true);
    try {
      // Mock upload / persistence
      await updateProfile({
        photos: photos,
        avatar_url: photos[0],
      });
      router.push('/bio-interests');
    } catch (error) {
      console.error('[PhotoUpload] Failed to save photos:', error);
      Alert.alert('Error', 'Failed to save photos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color={Colors.softWhite} size={28} />
          </Pressable>
          <Text style={styles.stepIndicator}>Step 2 of 8</Text> 
          <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.textContainer}>
            <Text style={styles.title}>Add your photos</Text>
            <Text style={styles.subtitle}>Show your best self. Add at least 1 photo to continue.</Text>
          </View>

          <PhotoManager 
            photos={photos} 
            onPhotosChange={setPhotos} 
            isLoading={isLoading}
          />

        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.continueButton,
              photos.length === 0 && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={photos.length === 0 || isLoading}
          >
            <Text style={[
              styles.continueText,
              photos.length === 0 && styles.continueTextDisabled
            ]}>
              {isLoading ? 'Saving...' : 'Continue'}
            </Text>
          </Pressable>
          
          <Pressable 
            style={styles.skipButton}
            onPress={() => router.push('/bio-interests')}
          >
            <Text style={styles.skipText}>Skip for now</Text>
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
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginLeft: -Spacing.xs,
    padding: Spacing.xs,
  },
  stepIndicator: {
    ...Typography.captionBold,
    color: Colors.textTertiary,
    letterSpacing: 1.5,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: 40,
  },
  textContainer: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.softWhite,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 16,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.voidBlack,
  },
  continueButton: {
    backgroundColor: Colors.pulseRed,
    height: 56,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  continueButtonDisabled: {
    backgroundColor: Colors.darkSecondary,
    opacity: 0.5,
  },
  continueText: {
    ...Typography.bodyBold,
    color: '#FFF',
    fontSize: 17,
  },
  continueTextDisabled: {
    color: Colors.textTertiary,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  skipText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 15,
  },
});
