import { StyleSheet, View, Text, ScrollView, Switch } from 'react-native';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import { useAuth } from '@/context/AuthContext';

export default function NotificationSettingsScreen() {
  const { user, updateProfile } = useAuth();
  
  const [matches, setMatches] = useState(user?.notification_settings?.matches ?? true);
  const [messages, setMessages] = useState(user?.notification_settings?.messages ?? true);
  const [liveInvites, setLiveInvites] = useState(user?.notification_settings?.live_invites ?? true);

  const handleToggle = async (key: 'matches' | 'messages' | 'liveInvites', value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (key === 'matches') setMatches(value);
    if (key === 'messages') setMessages(value);
    if (key === 'liveInvites') setLiveInvites(value);

    await updateProfile({
      notification_settings: {
        matches: key === 'matches' ? value : matches,
        messages: key === 'messages' ? value : messages,
        live_invites: key === 'liveInvites' ? value : liveInvites,
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          Manage which notifications you receive
        </Text>

        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>New Matches</Text>
              <Text style={styles.settingDesc}>When someone matches with you</Text>
            </View>
            <Switch
              value={matches}
              onValueChange={(value) => handleToggle('matches', value)}
              trackColor={{ false: Colors.border, true: Colors.pulseRed }}
              thumbColor={Colors.softWhite}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Messages</Text>
              <Text style={styles.settingDesc}>When you receive a new message</Text>
            </View>
            <Switch
              value={messages}
              onValueChange={(value) => handleToggle('messages', value)}
              trackColor={{ false: Colors.border, true: Colors.pulseRed }}
              thumbColor={Colors.softWhite}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Live Video Invites</Text>
              <Text style={styles.settingDesc}>When someone invites you to live video</Text>
            </View>
            <Switch
              value={liveInvites}
              onValueChange={(value) => handleToggle('liveInvites', value)}
              trackColor={{ false: Colors.border, true: Colors.pulseRed }}
              thumbColor={Colors.softWhite}
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            You can also manage notifications in your device settings
          </Text>
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
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    ...Typography.h1,
    color: Colors.softWhite,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
  },
  section: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingTitle: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: Spacing.xs,
  },
  settingDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  infoCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
  },
  infoText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
