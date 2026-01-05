import { StyleSheet, View, Text, Pressable, TextInput, ScrollView, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft, Twitter, Instagram, Facebook, Music2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import { useAuth } from '@/context/AuthContext';

export default function EditSocialLinksScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  
  const [links, setLinks] = useState({
    x: user?.social_links?.x || '',
    instagram: user?.social_links?.instagram || '',
    tiktok: user?.social_links?.tiktok || '',
    facebook: user?.social_links?.facebook || '',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (platform: keyof typeof links, text: string) => {
    setLinks(prev => ({ ...prev, [platform]: text }));
  };

  const normalizeLink = (text: string) => {
    // Basic normalization: remove whitespace
    return text.trim();
  };

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaving(true);

    try {
      const normalizedLinks = {
        x: normalizeLink(links.x),
        instagram: normalizeLink(links.instagram),
        tiktok: normalizeLink(links.tiktok),
        facebook: normalizeLink(links.facebook),
      };

      await updateProfile({ social_links: normalizedLinks });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save social links');
    } finally {
      setSaving(false);
    }
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
          <Text style={styles.headerTitle}>Social Links</Text>
          <Pressable 
            onPress={handleSave}
            disabled={saving}
            style={styles.saveButton}
          >
            <Text style={[styles.saveText, saving && styles.saveTextDisabled]}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </Pressable>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.description}>
              Add your social media handles or links. These will only be visible to your friends.
            </Text>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                  <Twitter size={20} color={Colors.softWhite} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="X (Twitter) username or link"
                  placeholderTextColor={Colors.textTertiary}
                  value={links.x}
                  onChangeText={(text) => handleChange('x', text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                  <Instagram size={20} color={Colors.softWhite} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Instagram username or link"
                  placeholderTextColor={Colors.textTertiary}
                  value={links.instagram}
                  onChangeText={(text) => handleChange('instagram', text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                  <Music2 size={20} color={Colors.softWhite} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="TikTok username or link"
                  placeholderTextColor={Colors.textTertiary}
                  value={links.tiktok}
                  onChangeText={(text) => handleChange('tiktok', text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                  <Facebook size={20} color={Colors.softWhite} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Facebook username or link"
                  placeholderTextColor={Colors.textTertiary}
                  value={links.facebook}
                  onChangeText={(text) => handleChange('facebook', text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
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
  header: {
    paddingHorizontal: Spacing.lg,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.softWhite,
  },
  saveButton: {
    padding: Spacing.sm,
  },
  saveText: {
    ...Typography.bodyBold,
    color: Colors.pulseRed,
  },
  saveTextDisabled: {
    color: Colors.textTertiary,
  },
  content: {
    padding: Spacing.lg,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  inputGroup: {
    gap: Spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: Spacing.md,
    color: Colors.softWhite,
    ...Typography.body,
  },
});
