import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, FileText, Heart, AlertTriangle, Mail, Flag } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

const SAFETY_SECTIONS = [
  { 
    icon: FileText, 
    title: 'Community Guidelines', 
    description: 'Our rules for a safe community',
    route: '/community-guidelines'
  },
  { 
    icon: Heart, 
    title: 'Safety Tips', 
    description: 'Stay safe while meeting new people',
    route: '/safety-tips'
  },
  { 
    icon: AlertTriangle, 
    title: 'Account Standing', 
    description: 'View your account status',
    route: '/account-standing'
  },
  { 
    icon: Mail, 
    title: 'Contact Support', 
    description: 'Get help from our team',
    route: '/contact-support'
  },
  { 
    icon: Flag, 
    title: 'Report a Problem', 
    description: 'Report users or issues',
    route: '/report-problem'
  },
];

export default function SafetyCenterScreen() {
  const router = useRouter();

  const handleSectionPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Shield size={48} color={Colors.pulseRed} />
          </View>
          <Text style={styles.title}>Safety Center</Text>
          <Text style={styles.subtitle}>
            Your safety is our priority. Learn how we keep Pulse safe and what you can do to protect yourself.
          </Text>
        </View>

        <View style={styles.sections}>
          {SAFETY_SECTIONS.map((section, index) => {
            const Icon = section.icon;
            return (
              <Pressable
                key={index}
                style={styles.sectionCard}
                onPress={() => handleSectionPress(section.route)}
              >
                <View style={styles.sectionIcon}>
                  <Icon size={24} color={Colors.pulseRed} />
                </View>
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionDesc}>{section.description}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.emergencyCard}>
          <AlertTriangle size={24} color={Colors.pulseRed} />
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>Emergency?</Text>
            <Text style={styles.emergencyText}>
              If you&apos;re in immediate danger, contact local emergency services.
            </Text>
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
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.signalGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.softWhite,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  sections: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  sectionCard: {
    flexDirection: 'row',
    padding: Spacing.lg,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    gap: Spacing.md,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.darkSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: Spacing.xs,
  },
  sectionDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  emergencyCard: {
    flexDirection: 'row',
    padding: Spacing.lg,
    backgroundColor: 'rgba(255,45,45,0.1)',
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.pulseRed,
    gap: Spacing.md,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    ...Typography.bodyBold,
    color: Colors.pulseRed,
    marginBottom: Spacing.xs,
  },
  emergencyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
