import { View, Text, StyleSheet, Pressable, Platform, ActivityIndicator, Share } from 'react-native';
import { WebView } from 'react-native-webview';
import { router, Stack } from 'expo-router';
import { ChevronLeft, Share2 } from 'lucide-react-native';
import { useState } from 'react';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import { LegalContent, getHtmlContent } from '@/constants/legal-content';

export default function SafetyTipsScreen() {
  const [loading, setLoading] = useState(false);
  
  const content = LegalContent.safety;
  const html = getHtmlContent(content.title, content.lastUpdated, content.content);

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Pulse Safety Tips\n\nRead more here: https://pulse.app/safety`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ChevronLeft color={Colors.softWhite} size={28} />
        </Pressable>
        <Text style={styles.headerTitle}>Safety Tips</Text>
        <Pressable onPress={handleShare} style={styles.actionButton}>
          <Share2 color={Colors.softWhite} size={20} />
        </Pressable>
      </View>

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
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.md,
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
    opacity: 0.99,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.voidBlack,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
