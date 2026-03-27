import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, ChevronRight } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { LegalContent, getHtmlContent } from '@/constants/legal-content';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

type LegalDocType = 'terms' | 'privacy' | 'community';

export default function LegalConsentScreen() {
  const router = useRouter();
  const { completeConsent } = useAuth();
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedCommunity, setAgreedCommunity] = useState(false);
  
  const [activeDoc, setActiveDoc] = useState<LegalDocType | null>(null);

  const allAgreed = agreedTerms && agreedPrivacy && agreedCommunity;

  const handleContinue = async () => {
    if (allAgreed) {
      await completeConsent();
      router.replace('/(tabs)/home');
    }
  };

  const getActiveDocContent = () => {
    if (!activeDoc) return null;
    const doc = LegalContent[activeDoc];
    return getHtmlContent(doc.title, doc.lastUpdated, doc.content);
  };

  const closeModal = () => setActiveDoc(null);

  const Checkbox = ({ label, checked, onPress }: { label: string, checked: boolean, onPress: () => void }) => (
    <TouchableOpacity style={styles.checkboxRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Check size={14} color="#FFF" strokeWidth={3} />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <View style={styles.pulseLogo}>
                <View style={styles.pulseDot} />
            </View>
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.title}>Welcome to Pulse</Text>
          <Text style={styles.subtitle}>
            Before we start, please review and accept our policies to ensure a safe community.
          </Text>

          <View style={styles.section}>
            <Checkbox 
              label="I accept the Terms of Service" 
              checked={agreedTerms} 
              onPress={() => setAgreedTerms(!agreedTerms)} 
            />
            <TouchableOpacity style={styles.linkButton} onPress={() => setActiveDoc('terms')}>
              <Text style={styles.linkText}>Read Terms of Service</Text>
              <ChevronRight size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Checkbox 
              label="I accept the Privacy Policy" 
              checked={agreedPrivacy} 
              onPress={() => setAgreedPrivacy(!agreedPrivacy)} 
            />
            <TouchableOpacity style={styles.linkButton} onPress={() => setActiveDoc('privacy')}>
              <Text style={styles.linkText}>Read Privacy Policy</Text>
              <ChevronRight size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Checkbox 
              label="I agree to the Community Guidelines" 
              checked={agreedCommunity} 
              onPress={() => setAgreedCommunity(!agreedCommunity)} 
            />
            <TouchableOpacity style={styles.linkButton} onPress={() => setActiveDoc('community')}>
              <Text style={styles.linkText}>Read Community Guidelines</Text>
              <ChevronRight size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.button, !allAgreed && styles.disabledButton]}
            onPress={handleContinue}
            disabled={!allAgreed}
          >
            <Text style={styles.buttonText}>Enter Pulse</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        visible={activeDoc !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {activeDoc ? LegalContent[activeDoc].title : ''}
            </Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
          {activeDoc && (
            <WebView
              originWhitelist={['*']}
              source={{ html: getActiveDocContent() || '' }}
              style={styles.webview}
              showsVerticalScrollIndicator={true}
            />
          )}
        </View>
      </Modal>
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
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  pulseLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.pulseRed,
  },
  pulseDot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: Colors.pulseRed,
  },
  content: {
    flexGrow: 1,
    padding: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxxl,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.signalGray,
    padding: Spacing.lg,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.textTertiary,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.pulseRed,
    borderColor: Colors.pulseRed,
  },
  checkboxLabel: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 36, // Align with text start (24 + 12)
    paddingVertical: 8,
  },
  linkText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    backgroundColor: Colors.voidBlack,
  },
  button: {
    backgroundColor: Colors.pulseRed,
    height: 56,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.pulseRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: Colors.darkSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    ...Typography.bodyBold,
    color: '#FFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  modalHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.voidBlack,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  doneText: {
    color: Colors.pulseRed,
    fontSize: 17,
    fontWeight: '600',
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
});
