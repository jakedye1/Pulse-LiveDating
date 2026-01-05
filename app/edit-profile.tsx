import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { router, Stack } from 'expo-router';
import { ChevronLeft, LogOut, Trash2, ChevronRight, FileText, Shield, Globe, Lock, LifeBuoy, AlertTriangle, ShieldCheck, Share2 } from 'lucide-react-native';
import { useState, useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import PhotoManager from '@/components/PhotoManager';

export default function EditProfileScreen() {
  const { user, updateProfile, logout } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (user?.photos && user.photos.length > 0) {
      setPhotos(user.photos);
    }
  }, [user?.photos]);

  const handleBack = () => {
    router.back();
  };

  const handlePhotosChange = async (newPhotos: string[]) => {
    setPhotos(newPhotos);
    setUploading(true);
    try {
      await updateProfile({ 
        photos: newPhotos,
        avatar_url: newPhotos[0] || null
      });
    } catch (error) {
      console.error('[EditProfile] Failed to update photos:', error);
      Alert.alert('Error', 'Failed to update photos');
    } finally {
      setUploading(false);
    }
  };

  const handleDistanceChange = async (distance: number | 'any') => {
    await updateProfile({ distance_preference: distance });
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to log out");
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent and cannot be undone. All your data, matches, and messages will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            // In a real app, call API to delete account
            await logout(); // For now just logout
          }
        }
      ]
    );
  };

  const DistanceOption = ({ value, label }: { value: number | 'any', label: string }) => {
    const isSelected = user?.distance_preference === value;
    return (
      <Pressable 
        style={[styles.distanceOption, isSelected && styles.distanceOptionSelected]}
        onPress={() => handleDistanceChange(value)}
      >
        <Text style={[styles.distanceOptionText, isSelected && styles.distanceOptionTextSelected]}>
          {label}
        </Text>
      </Pressable>
    );
  };

  const SettingRow = ({ icon: Icon, label, value, onPress, isDestructive = false }: any) => (
    <Pressable style={styles.settingRow} onPress={onPress}>
      <View style={styles.settingRowLeft}>
        <View style={[styles.iconContainer, isDestructive && styles.iconContainerDestructive]}>
          <Icon size={20} color={isDestructive ? Colors.pulseRed : Colors.textSecondary} />
        </View>
        <Text style={[styles.settingLabel, isDestructive && styles.settingLabelDestructive]}>
          {label}
        </Text>
      </View>
      <View style={styles.settingRowRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        <ChevronRight size={20} color={Colors.textTertiary} />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ChevronLeft color={Colors.softWhite} size={28} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        
        {/* Photo Section */}
        <View style={styles.photoSection}>
          <Text style={styles.photoSectionTitle}>Your Photos</Text>
          
          <PhotoManager 
            photos={photos}
            onPhotosChange={handlePhotosChange}
            isLoading={uploading}
            containerPadding={Spacing.lg}
          />
          
          <Text style={styles.photoHint}>First photo is your main profile picture</Text>
        </View>

        {/* Distance Preference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance Preference</Text>
          <View style={styles.distanceContainer}>
            <DistanceOption value={5} label="5 mi" />
            <DistanceOption value={10} label="10 mi" />
            <DistanceOption value={25} label="25 mi" />
            <DistanceOption value="any" label="Any" />
          </View>
          <Text style={styles.sectionHint}>
            We&apos;ll show you people within this range first.
          </Text>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Safety</Text>
          <View style={styles.settingsGroup}>
            <SettingRow 
              icon={Shield} 
              label="Blocked Users" 
              value={`${user?.blocked_users?.length || 0}`}
              onPress={() => router.push('/blocked-users')} 
            />
            <SettingRow 
              icon={Share2} 
              label="Social Links" 
              onPress={() => router.push('/edit-social-links')} 
            />
            <SettingRow 
              icon={Lock} 
              label="Privacy Settings" 
              onPress={() => router.push('/privacy-settings')} 
            />
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal & Support</Text>
          <View style={styles.settingsGroup}>
            <SettingRow 
              icon={FileText} 
              label="Terms of Service" 
              onPress={() => router.push('/terms-of-service')} 
            />
            <SettingRow 
              icon={FileText} 
              label="Privacy Policy" 
              onPress={() => router.push('/privacy-policy')} 
            />
            <SettingRow 
              icon={Globe} 
              label="Community Guidelines" 
              onPress={() => router.push('/community-guidelines')} 
            />
            <SettingRow 
              icon={ShieldCheck} 
              label="Safety Tips" 
              onPress={() => router.push('/safety-tips')} 
            />
             <SettingRow 
              icon={LifeBuoy} 
              label="Contact Support" 
              onPress={() => router.push('/contact-support')} 
            />
             <SettingRow 
              icon={AlertTriangle} 
              label="Report a Problem" 
              onPress={() => router.push('/report-problem')} 
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingRow 
              icon={LogOut} 
              label="Log Out" 
              isDestructive 
              onPress={handleLogout} 
            />
            <SettingRow 
              icon={Trash2} 
              label="Delete Account" 
              isDestructive 
              onPress={handleDeleteAccount} 
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Pulse v1.0.0 (Build 142)</Text>
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
    backgroundColor: Colors.voidBlack, // Ensure opaque header
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
  photoSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  photoSectionTitle: {
    ...Typography.h3,
    color: Colors.softWhite,
    marginBottom: Spacing.md,
  },
  photoHint: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionHint: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
  },
  distanceContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.signalGray,
    padding: 4,
    borderRadius: Layout.borderRadius.lg,
  },
  distanceOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.md,
  },
  distanceOptionSelected: {
    backgroundColor: Colors.softWhite,
  },
  distanceOptionText: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
  },
  distanceOptionTextSelected: {
    color: Colors.voidBlack,
  },
  settingsGroup: {
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerDestructive: {
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
  },
  settingLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  settingLabelDestructive: {
    color: Colors.pulseRed,
  },
  settingRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  settingValue: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  versionText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
});
