import { StyleSheet, View, Text, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Send } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

export default function AppealFormScreen() {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = () => {
    if (!reason || !details) {
      Alert.alert('Missing Information', 'Please fill out all fields');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Appeal Submitted',
      'We\'ll review your appeal and get back to you within 2-3 business days.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Submit an Appeal</Text>
        <Text style={styles.subtitle}>
          Explain why you believe the decision should be reconsidered
        </Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Reason for Appeal</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., This was a misunderstanding..."
              placeholderTextColor={Colors.textTertiary}
              value={reason}
              onChangeText={setReason}
              maxLength={100}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Additional Details</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Provide as much context as possible..."
              placeholderTextColor={Colors.textTertiary}
              multiline
              textAlignVertical="top"
              value={details}
              onChangeText={setDetails}
              maxLength={1000}
            />
            <Text style={styles.charCount}>{details.length}/1000</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Appeal Review Process:</Text>
            <Text style={styles.infoText}>• Appeals are reviewed by our safety team</Text>
            <Text style={styles.infoText}>• Review typically takes 2-3 business days</Text>
            <Text style={styles.infoText}>• Decisions are based on our Community Guidelines</Text>
            <Text style={styles.infoText}>• You&apos;ll be notified via email</Text>
          </View>

          <Pressable style={styles.submitBtn} onPress={handleSubmit}>
            <Send size={20} color={Colors.softWhite} />
            <Text style={styles.submitBtnText}>Submit Appeal</Text>
          </Pressable>
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
  form: {
    gap: Spacing.xl,
  },
  field: {
    gap: Spacing.sm,
  },
  label: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  input: {
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    padding: Spacing.lg,
    ...Typography.body,
    color: Colors.softWhite,
  },
  textArea: {
    minHeight: 150,
  },
  charCount: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'right',
  },
  infoCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
  },
  infoTitle: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
  },
  infoText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.full,
  },
  submitBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
});
