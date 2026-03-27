import { View, Text, StyleSheet, ScrollView, Pressable, Platform, TextInput, Alert, ActivityIndicator, Linking } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from 'expo-router';
import { ChevronLeft, X, Paperclip, Send } from 'lucide-react-native';
import { useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import { LegalConfig } from '@/constants/legal';

const CATEGORIES = [
  { value: 'account', label: 'Account' },
  { value: 'billing', label: 'Billing' },
  { value: 'safety', label: 'Safety' },
  { value: 'technical', label: 'Technical' },
  { value: 'other', label: 'Other' },
];

const MAX_ATTACHMENTS = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type Attachment = {
  uri: string;
  name: string;
  size: number;
};

export default function ContactSupportScreen() {
  const { user } = useAuth();
  const [category, setCategory] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [includeDiagnostics, setIncludeDiagnostics] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleAddAttachment = async () => {
    if (attachments.length >= MAX_ATTACHMENTS) {
      Alert.alert('Limit Reached', `You can attach up to ${MAX_ATTACHMENTS} images.`);
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photos to attach images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const size = asset.fileSize || 0;

      if (size > MAX_FILE_SIZE) {
        Alert.alert('File Too Large', 'Images must be under 5MB.');
        return;
      }

      const newAttachment: Attachment = {
        uri: asset.uri,
        name: asset.fileName || `image-${Date.now()}.jpg`,
        size,
      };

      setAttachments([...attachments, newAttachment]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!category) {
      Alert.alert('Required Field', 'Please select a category.');
      return;
    }

    if (!subject.trim()) {
      Alert.alert('Required Field', 'Please enter a subject.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Required Field', 'Please describe your issue.');
      return;
    }

    setSubmitting(true);

    try {
      const diagnostics = includeDiagnostics ? {
        appVersion: '1.0.0',
        buildNumber: '142',
        platform: Platform.OS,
        osVersion: Platform.Version,
        userId: user?.id,
      } : null;

      console.log('Submitting support ticket:', {
        userId: user?.id,
        category,
        subject,
        description,
        attachments: attachments.map(a => a.name),
        diagnostics,
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockTicketId = `PULSE-${Date.now().toString().slice(-6)}`;
      setTicketId(mockTicketId);
      setSubmitted(true);

    } catch (error) {
      console.error('Failed to submit ticket:', error);
      
      Alert.alert(
        'Submission Failed',
        'Could not send your message. Would you like to email us instead?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Email',
            onPress: async () => {
              const emailBody = `Category: ${category}\nSubject: ${subject}\n\n${description}`;
              const mailtoUrl = `mailto:${LegalConfig.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
              
              const canOpen = await Linking.canOpenURL(mailtoUrl);
              if (canOpen) {
                await Linking.openURL(mailtoUrl);
              } else {
                Alert.alert('Error', 'Could not open email client.');
              }
            },
          },
        ]
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDone = () => {
    router.back();
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={styles.header}>
          <View style={{ width: 28 }} />
          <Text style={styles.headerTitle}>Support Request</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Send color={Colors.softWhite} size={32} />
          </View>
          <Text style={styles.successTitle}>Request Sent</Text>
          <Text style={styles.successText}>
            We received your message and will get back to you soon.
          </Text>
          <View style={styles.ticketBox}>
            <Text style={styles.ticketLabel}>Ticket ID</Text>
            <Text style={styles.ticketId}>{ticketId}</Text>
          </View>
          <Pressable style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ChevronLeft color={Colors.softWhite} size={28} />
        </Pressable>
        <Text style={styles.headerTitle}>Contact Support</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        
        <Text style={styles.sectionLabel}>Category *</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.value}
              style={[
                styles.categoryButton,
                category === cat.value && styles.categoryButtonSelected,
              ]}
              onPress={() => setCategory(cat.value)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  category === cat.value && styles.categoryButtonTextSelected,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Subject *</Text>
        <TextInput
          style={styles.input}
          placeholder="Brief description of your issue"
          placeholderTextColor={Colors.textTertiary}
          value={subject}
          onChangeText={setSubject}
          maxLength={100}
        />

        <Text style={styles.sectionLabel}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Please provide details about your issue..."
          placeholderTextColor={Colors.textTertiary}
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={2000}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{description.length}/2000</Text>

        <Text style={styles.sectionLabel}>Attachments (Optional)</Text>
        <Text style={styles.sectionHint}>
          Up to {MAX_ATTACHMENTS} images, 5MB each
        </Text>
        
        {attachments.length > 0 && (
          <View style={styles.attachmentsContainer}>
            {attachments.map((attachment, index) => (
              <View key={index} style={styles.attachmentItem}>
                <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />
                <Pressable
                  style={styles.removeAttachmentButton}
                  onPress={() => handleRemoveAttachment(index)}
                >
                  <X color={Colors.softWhite} size={16} />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {attachments.length < MAX_ATTACHMENTS && (
          <Pressable style={styles.attachButton} onPress={handleAddAttachment}>
            <Paperclip color={Colors.textSecondary} size={20} />
            <Text style={styles.attachButtonText}>Add Image</Text>
          </Pressable>
        )}

        <Pressable
          style={styles.diagnosticsToggle}
          onPress={() => setIncludeDiagnostics(!includeDiagnostics)}
        >
          <View style={styles.checkbox}>
            {includeDiagnostics && <View style={styles.checkboxInner} />}
          </View>
          <Text style={styles.diagnosticsText}>
            Include app diagnostics (recommended)
          </Text>
        </Pressable>
        <Text style={styles.diagnosticsHint}>
          Helps us troubleshoot technical issues faster. Never includes message contents.
        </Text>

      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={Colors.softWhite} />
          ) : (
            <>
              <Send color={Colors.softWhite} size={20} />
              <Text style={styles.submitButtonText}>Send Request</Text>
            </>
          )}
        </Pressable>
      </View>
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
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  sectionLabel: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  sectionHint: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: -Spacing.xs,
    marginBottom: Spacing.sm,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonSelected: {
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
    borderColor: Colors.pulseRed,
  },
  categoryButtonText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  categoryButtonTextSelected: {
    color: Colors.pulseRed,
    fontWeight: '600' as const,
  },
  input: {
    ...Typography.body,
    color: Colors.softWhite,
    backgroundColor: Colors.signalGray,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textArea: {
    height: 120,
    paddingTop: Spacing.md,
  },
  charCount: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  attachmentItem: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.signalGray,
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.pulseRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  attachButtonText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  diagnosticsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.pulseRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: Colors.pulseRed,
  },
  diagnosticsText: {
    ...Typography.body,
    color: Colors.softWhite,
    flex: 1,
  },
  diagnosticsHint: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginLeft: 38,
    marginTop: Spacing.xs,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.voidBlack,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.lg,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.pulseRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  successTitle: {
    ...Typography.h2,
    color: Colors.softWhite,
    marginBottom: Spacing.md,
  },
  successText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  ticketBox: {
    backgroundColor: Colors.signalGray,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Layout.borderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  ticketLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  ticketId: {
    ...Typography.h3,
    color: Colors.pulseRed,
  },
  doneButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxxl,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.lg,
  },
  doneButtonText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
});
