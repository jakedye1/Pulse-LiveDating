import { View, Text, StyleSheet, Pressable, ActivityIndicator, Share } from 'react-native';
import { WebView } from 'react-native-webview';
import { router, Stack } from 'expo-router';
import { ChevronLeft, Share2 } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import { LegalContent, getHtmlContent } from '@/constants/legal-content';

export default function TermsOfServiceScreen() {
  const [loading, setLoading] = useState(false);
  
  const content = LegalContent.terms;
  const html = getHtmlContent(content.title, content.lastUpdated, content.content);

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Pulse Terms of Service\n\nRead more here: https://pulse.app/terms`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <ChevronLeft color={Colors.softWhite} size={28} />
          </Pressable>
          <Text style={styles.headerTitle}>Terms of Service</Text>
          <Pressable onPress={handleShare} style={styles.actionButton}>
            <Share2 color={Colors.softWhite} size={20} />
          </Pressable>
        </View>
      </SafeAreaView>

      <WebView
        source={{ html }}
        style={styles.webview}
        originWhitelist={['*']}
        showsVerticalScrollIndicator={true}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        containerStyle={{ backgroundColor: Colors.voidBlack }}
      />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.pulseRed} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  safeArea: {
    backgroundColor: Colors.voidBlack,
    zIndex: 10,
  },
  header: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.voidBlack,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.softWhite,
  },
  actionButton: {
    padding: Spacing.xs,
    marginRight: -Spacing.xs,
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
    opacity: 0.99, // Fix for some android webview flicker issues
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.voidBlack,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
