import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, Platform, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { ChevronLeft, Shield, Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import * as Crypto from 'expo-crypto';

import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

function normalizePhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  if (phone.startsWith('+')) {
    return `+${cleaned}`;
  }
  
  return `+1${cleaned}`;
}

async function hashPhoneNumber(phone: string): Promise<string> {
  const normalized = normalizePhoneNumber(phone);
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    normalized
  );
  return hash;
}

function maskPhoneNumber(hash: string): string {
  const last4 = hash.slice(-4);
  return `***-***-${last4}`;
}

export default function BlockContactsScreen() {
  const { user, updateProfile } = useAuth();
  const [phoneInput, setPhoneInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [removingHash, setRemovingHash] = useState<string | null>(null);

  const blockedContacts = user?.blocked_contacts || [];

  const handleAddContact = async () => {
    if (!phoneInput.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    const cleaned = phoneInput.replace(/\D/g, '');
    if (cleaned.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsAdding(true);
    try {
      const hash = await hashPhoneNumber(phoneInput);
      
      if (blockedContacts.includes(hash)) {
        Alert.alert('Already Blocked', 'This contact is already in your blocked list');
        setIsAdding(false);
        return;
      }

      const updatedContacts = [...blockedContacts, hash];
      await updateProfile({ blocked_contacts: updatedContacts });
      
      setPhoneInput('');
      Alert.alert('Contact Blocked', "You won't see each other on Pulse");
    } catch (error) {
      console.error('Failed to block contact:', error);
      Alert.alert('Error', 'Failed to block contact. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveContact = (hash: string) => {
    Alert.alert(
      'Unblock Contact?',
      'This contact will be able to see you on Pulse again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: async () => {
            setRemovingHash(hash);
            try {
              const updatedContacts = blockedContacts.filter(h => h !== hash);
              await updateProfile({ blocked_contacts: updatedContacts });
            } catch (error) {
              console.error('Failed to unblock contact:', error);
              Alert.alert('Error', 'Failed to unblock contact. Please try again.');
            } finally {
              setRemovingHash(null);
            }
          }
        }
      ]
    );
  };

  const formatPhoneInput = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);
    
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    } else {
      return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneInput(text);
    setPhoneInput(formatted);
  };

  const BlockedContactItem = ({ hash }: { hash: string }) => (
    <View style={styles.contactRow}>
      <View style={styles.contactInfo}>
        <View style={styles.iconCircle}>
          <Shield color={Colors.textSecondary} size={20} />
        </View>
        <View style={styles.contactDetails}>
          <Text style={styles.contactNumber}>{maskPhoneNumber(hash)}</Text>
          <Text style={styles.contactSubtext}>Blocked contact</Text>
        </View>
      </View>
      
      <Pressable
        style={styles.removeButton}
        onPress={() => handleRemoveContact(hash)}
        disabled={removingHash === hash}
      >
        {removingHash === hash ? (
          <ActivityIndicator size="small" color={Colors.textTertiary} />
        ) : (
          <X color={Colors.textTertiary} size={20} />
        )}
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={Colors.softWhite} size={28} />
        </Pressable>
        <Text style={styles.headerTitle}>Block Contacts</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.introSection}>
          <Text style={styles.introText}>
            Don&apos;t want to see family, coworkers, or people you know? Add their phone numbers and we&apos;ll make sure you never appear to each other.
          </Text>
        </View>

        <View style={styles.addSection}>
          <Text style={styles.sectionTitle}>Add Phone Number</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.countryCode}>+1</Text>
              <TextInput
                style={styles.input}
                placeholder="(555) 123-4567"
                placeholderTextColor={Colors.textTertiary}
                value={phoneInput}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={handleAddContact}
                editable={!isAdding}
              />
            </View>
            
            <Pressable
              style={[styles.addButton, isAdding && styles.addButtonDisabled]}
              onPress={handleAddContact}
              disabled={isAdding}
            >
              {isAdding ? (
                <ActivityIndicator size="small" color={Colors.voidBlack} />
              ) : (
                <Plus color={Colors.voidBlack} size={24} />
              )}
            </Pressable>
          </View>

          <Text style={styles.helperText}>
            Enter any US phone number. Works with (555) 123-4567 or 5551234567 format.
          </Text>
        </View>

        {blockedContacts.length > 0 ? (
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Blocked Contacts ({blockedContacts.length})</Text>
            
            <View style={styles.list}>
              {blockedContacts.map((hash) => (
                <BlockedContactItem key={hash} hash={hash} />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Shield color={Colors.textTertiary} size={48} />
            </View>
            <Text style={styles.emptyTitle}>No Blocked Contacts</Text>
            <Text style={styles.emptyText}>
              Add phone numbers above to prevent seeing specific people on Pulse.
            </Text>
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How It Works</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Privacy-Safe</Text>
              <Text style={styles.infoDescription}>
                Phone numbers are hashed before storage. We never store raw numbers.
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Mutual Blocking</Text>
              <Text style={styles.infoDescription}>
                You won&apos;t see them, and they won&apos;t see you. Applies everywhere.
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>No Notifications</Text>
              <Text style={styles.infoDescription}>
                Blocking is private. The other person is never notified.
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Instant Effect</Text>
              <Text style={styles.infoDescription}>
                Takes effect immediately across Discovery, Live, Groups, and Matches.
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
  addSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    ...Typography.bodyBold,
    fontSize: 17,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  countryCode: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.softWhite,
    paddingVertical: Spacing.md,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  helperText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    lineHeight: 18,
  },
  listSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  list: {
    gap: Spacing.sm,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.signalGray,
    padding: Spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.darkSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactDetails: {
    flex: 1,
  },
  contactNumber: {
    ...Typography.body,
    color: Colors.softWhite,
    marginBottom: 2,
  },
  contactSubtext: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.darkSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.signalGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
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
