import { View, Text, StyleSheet, ScrollView, Pressable, Platform, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from 'expo-router';
import { ChevronLeft, X, Paperclip, AlertTriangle, ShieldCheck } from 'lucide-react-native';
import { useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

const REPORT_TYPES = [
  { value: 'user', label: 'User' },
  { value: 'message', label: 'Message' },
  { value: 'live_video', label: 'Live Video' },
  { value: 'group', label: 'Group' },
  { value: 'bug', label: 'Bug' },
  { value: 'other', label: 'Other' },
];

const REASONS = [
  { value: 'harassment', label: 'Harassment' },
  { value: 'spam', label: 'Spam/Scam' },
  { value: 'nudity', label: 'Nudity/Sexual' },
  { value: 'hate_speech', label: 'Hate Speech' },
  { value: 'impersonation', label: 'Impersonation' },
  { value: 'underage', label: 'Underage' },
  { value: 'violence', label: 'Violence/Threats' },
  { value: 'other', label: 'Other' },
];

const MAX_ATTACHMENTS = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type Attachment = {
  uri: string;
  name: string;
  size: number;
};

export default function ReportProblemScreen() {
  const { user, blockUser } = useAuth();
  const [reportType, setReportType] = useState<string>('');
  const [targetUserId, setTargetUserId] = useState('');
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [shouldBlockUser, setShouldBlockUser] = useState(false);
  const [shouldMuteUser, setShouldMuteUser] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    if (!reportType) {
      Alert.alert('Required Field', 'Please select a report type.');
      return;
    }

    if (!reason) {
      Alert.alert('Required Field', 'Please select a reason.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Required Field', 'Please describe the issue.');
      return;
    }

    setSubmitting(true);

    try {
      console.log('Submitting report:', {
        userId: user?.id,
        reportType,
        targetUserId: targetUserId || null,
        reason,
        description,
        attachments: attachments.map(a => a.name),
        shouldBlockUser,
        shouldMuteUser,
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      if (shouldBlockUser && targetUserId) {
        await blockUser(targetUserId);
      }

      setSubmitted(true);

    } catch (error) {
      console.error('Failed to submit report:', error);
      Alert.alert(
        'Submission Failed',
        'Could not submit your report. Please try again later.',
        [{ text: 'OK' }]
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
          <Text style={styles.headerTitle}>Report Submitted</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <ShieldCheck color={Colors.softWhite} size={32} />
          </View>
          <Text style={styles.successTitle}>Thank You</Text>
          <Text style={styles.successText}>
            We&apos;ve received your report and will review it shortly. Your safety is our priority.
          </Text>
          
          {shouldBlockUser && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                The user has been blocked from contacting you.
              </Text>
            </View>
          )}

          <Pressable style={styles.safetyButton} onPress={() => router.push('/safety-tips')}>
            <Text style={styles.safetyButtonText}>View Safety Tips</Text>
          </Pressable>

          <Pressable style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const isUserReport = reportType === 'user' || reportType === 'message' || reportType === 'live_video';

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ChevronLeft color={Colors.softWhite} size={28} />
        </Pressable>
        <Text style={styles.headerTitle}>Report a Problem</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        
        <Text style={styles.sectionLabel}>Report Type *</Text>
        <View style={styles.categoryContainer}>
          {REPORT_TYPES.map((type) => (
            <Pressable
              key={type.value}
              style={[
                styles.categoryButton,
                reportType === type.value && styles.categoryButtonSelected,
              ]}
              onPress={() => setReportType(type.value)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  reportType === type.value && styles.categoryButtonTextSelected,
                ]}
              >
                {type.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {isUserReport && (
          <>
            <Text style={styles.sectionLabel}>User ID / Username (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter user ID or username"
              placeholderTextColor={Colors.textTertiary}
              value={targetUserId}
              onChangeText={setTargetUserId}
              autoCapitalize="none"
            />
          </>
        )}

        <Text style={styles.sectionLabel}>Reason *</Text>
        <View style={styles.categoryContainer}>
          {REASONS.map((r) => (
            <Pressable
              key={r.value}
              style={[
                styles.categoryButton,
                reason === r.value && styles.categoryButtonSelected,
              ]}
              onPress={() => setReason(r.value)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  reason === r.value && styles.categoryButtonTextSelected,
                ]}
              >
                {r.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Please provide details about what happened..."
          placeholderTextColor={Colors.textTertiary}
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={2000}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{description.length}/2000</Text>

        <Text style={styles.sectionLabel}>Evidence (Optional)</Text>
        <Text style={styles.sectionHint}>
          Screenshots or images that support your report
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

        {isUserReport && targetUserId.trim() && (
          <>
            <View style={styles.divider} />
            
            <Pressable
              style={styles.toggle}
              onPress={() => setShouldBlockUser(!shouldBlockUser)}
            >
              <View style={styles.checkbox}>
                {shouldBlockUser && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.toggleText}>
                Block this user
              </Text>
            </Pressable>
            <Text style={styles.toggleHint}>
              They won&apos;t be able to contact you or see your profile
            </Text>

            <Pressable
              style={styles.toggle}
              onPress={() => setShouldMuteUser(!shouldMuteUser)}
            >
              <View style={styles.checkbox}>
                {shouldMuteUser && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.toggleText}>
                Mute this user
              </Text>
            </Pressable>
            <Text style={styles.toggleHint}>
              Hide their messages and activity
            </Text>
          </>
        )}

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
              <AlertTriangle color={Colors.softWhite} size={20} />
              <Text style={styles.submitButtonText}>Submit Report</Text>
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
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xl,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
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
  toggleText: {
    ...Typography.body,
    color: Colors.softWhite,
    flex: 1,
  },
  toggleHint: {
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
    marginBottom: Spacing.lg,
  },
  infoBox: {
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.pulseRed,
    marginBottom: Spacing.lg,
  },
  infoText: {
    ...Typography.body,
    color: Colors.softWhite,
    textAlign: 'center',
  },
  safetyButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    marginBottom: Spacing.md,
  },
  safetyButtonText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
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
