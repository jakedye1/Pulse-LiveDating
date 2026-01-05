import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Platform, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';

import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import { PrivacySettings } from '@/domain/types';

type PrivacySetting = {
  key: keyof PrivacySettings;
  label: string;
  description: string;
};

const PRIVACY_SETTINGS_LIST: PrivacySetting[] = [
  {
    key: 'public_profile',
    label: 'Public Profile',
    description: 'Allow others to view your full profile',
  },
  {
    key: 'appear_in_discover',
    label: 'Appear in Discover',
    description: 'Show your profile in discovery and search',
  },
  {
    key: 'allow_message_requests',
    label: 'Message Requests',
    description: 'Allow new people to send you messages',
  },
  {
    key: 'show_online_status',
    label: 'Online Status',
    description: 'Show when you are active and online',
  },
  {
    key: 'allow_live_video_invites',
    label: 'Live Video Invites',
    description: 'Allow direct invites to live video calls',
  },
];

export default function PrivacySettingsScreen() {
  const { user, updateProfile } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>(user?.privacy_settings || {
    public_profile: true,
    appear_in_discover: true,
    allow_message_requests: true,
    show_online_status: true,
    allow_live_video_invites: true,
  });
  const [savingState, setSavingState] = useState<Record<string, boolean>>({});
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    if (user?.privacy_settings) {
      setSettings(user.privacy_settings);
    }
  }, [user?.privacy_settings]);

  const handleBack = () => {
    router.back();
  };

  const handleToggle = async (key: keyof PrivacySettings) => {
    const newValue = !settings[key];
    const previousValue = settings[key];

    setSettings(prev => ({ ...prev, [key]: newValue }));
    setSavingState(prev => ({ ...prev, [key]: true }));

    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]);
    }

    debounceTimers.current[key] = setTimeout(async () => {
      try {
        await updateProfile({ 
          privacy_settings: { ...settings, [key]: newValue } 
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setSavingState(prev => ({ ...prev, [key]: false }));
      } catch (error) {
        console.error('Failed to save privacy setting:', error);
        
        setSettings(prev => ({ ...prev, [key]: previousValue }));
        setSavingState(prev => ({ ...prev, [key]: false }));
        
        Alert.alert(
          "Couldn't Save",
          "Failed to update privacy setting. Please try again.",
          [{ text: "OK" }]
        );
      }
    }, 500);
  };

  const PrivacyToggleRow = ({ setting }: { setting: PrivacySetting }) => {
    const isEnabled = settings[setting.key];
    const isSaving = savingState[setting.key];

    return (
      <View style={styles.toggleRow}>
        <View style={styles.toggleContent}>
          <View style={styles.toggleTextContainer}>
            <Text style={styles.toggleLabel}>{setting.label}</Text>
            <Text style={styles.toggleDescription}>{setting.description}</Text>
          </View>
          <View style={styles.toggleControl}>
            {isSaving && (
              <View style={styles.savingIndicator}>
                <ActivityIndicator size="small" color={Colors.textTertiary} />
                <Text style={styles.savingText}>Saving…</Text>
              </View>
            )}
            <Switch
              value={isEnabled}
              onValueChange={() => handleToggle(setting.key)}
              trackColor={{ 
                false: Colors.signalGray, 
                true: Colors.pulseRed 
              }}
              thumbColor={Colors.softWhite}
              ios_backgroundColor={Colors.signalGray}
              disabled={isSaving}
              style={styles.switch}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ChevronLeft color={Colors.softWhite} size={28} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        
        <View style={styles.introSection}>
          <Text style={styles.introText}>
            Control who can see your profile and interact with you. You can change these anytime.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            {PRIVACY_SETTINGS_LIST.map((setting, index) => (
              <View key={setting.key}>
                <PrivacyToggleRow setting={setting} />
                {index < PRIVACY_SETTINGS_LIST.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Privacy Tools</Text>
          
          <Pressable 
            style={styles.navigationRow}
            onPress={() => router.push('/block-contacts')}
          >
            <View style={styles.navigationContent}>
              <View style={styles.navigationIconContainer}>
                <Shield color={Colors.pulseRed} size={22} />
              </View>
              <View style={styles.navigationTextContainer}>
                <Text style={styles.navigationLabel}>Block Contacts</Text>
                <Text style={styles.navigationDescription}>
                  Prevent specific phone numbers from seeing you
                </Text>
              </View>
            </View>
            <ChevronRight color={Colors.textTertiary} size={20} />
          </Pressable>
        </View>

        <View style={styles.infoSection}>

          <Text style={styles.infoTitle}>How Privacy Settings Work</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Public Profile OFF</Text>
              <Text style={styles.infoDescription}>
                Only approved connections can view your full profile
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Appear in Discover OFF</Text>
              <Text style={styles.infoDescription}>
                You won&apos;t show up in Dating, Groups, or Friends discovery
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Message Requests OFF</Text>
              <Text style={styles.infoDescription}>
                Only connections can message you (blocks strangers)
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Online Status OFF</Text>
              <Text style={styles.infoDescription}>
                Hides &quot;active now&quot; and &quot;last seen&quot; everywhere
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Live Video Invites OFF</Text>
              <Text style={styles.infoDescription}>
                Blocks direct video call invites from others
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing.xxxl,
  },
  introSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  introText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    ...Typography.captionBold,
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  settingsGroup: {
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
  },
  toggleRow: {
    backgroundColor: Colors.signalGray,
  },
  toggleContent: {
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  toggleLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  toggleDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  toggleControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  savingText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontSize: 12,
  },
  switch: {
    transform: Platform.OS === 'ios' ? [] : [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: Spacing.md,
  },
  navigationRow: {
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navigationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  navigationIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.darkSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationTextContainer: {
    flex: 1,
  },
  navigationLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  navigationDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  infoSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  infoTitle: {
    ...Typography.bodyBold,
    fontSize: 17,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  infoBullet: {
    ...Typography.body,
    color: Colors.pulseRed,
    width: 20,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  infoDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
