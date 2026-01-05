import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import { ChevronLeft, Shield } from 'lucide-react-native';
import { useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

import { MOCK_USERS } from '@/constants/mocks';

export default function BlockedUsersScreen() {
  const { user, unblockUser } = useAuth();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const blockedIds = user?.blocked_users || [];
  
  // Resolve blocked users from mock DB, or create a placeholder if missing
  const blockedUsers = blockedIds.map(id => {
    return MOCK_USERS[id] || {
      id,
      name: 'Unknown User',
      age: '',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800' // Placeholder
    };
  });

  const handleUnblock = (userId: string, userName: string) => {
    Alert.alert(
      "Unblock User?",
      `Are you sure you want to unblock ${userName}? They will be able to see your profile and message you again.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Unblock", 
          onPress: async () => {
            setProcessingId(userId);
            try {
              await unblockUser(userId);
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to unblock user. Please try again.");
            } finally {
              setProcessingId(null);
            }
          }
        }
      ]
    );
  };

  const BlockedUserItem = ({ item }: { item: any }) => (
    <View style={styles.userRow}>
      <View style={styles.userInfo}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.avatar} 
          contentFit="cover"
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userSubtext}>Blocked on {new Date().toLocaleDateString()}</Text>
        </View>
      </View>
      
      <Pressable 
        style={styles.unblockButton}
        onPress={() => handleUnblock(item.id, item.name)}
        disabled={processingId === item.id}
      >
        {processingId === item.id ? (
          <ActivityIndicator size="small" color={Colors.voidBlack} />
        ) : (
          <Text style={styles.unblockButtonText}>Unblock</Text>
        )}
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={Colors.softWhite} size={28} />
        </Pressable>
        <Text style={styles.headerTitle}>Blocked Users</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {blockedUsers.length > 0 ? (
          <>
            <Text style={styles.description}>
              Blocked users cannot see your profile, message you, or find you on Pulse.
            </Text>
            
            <View style={styles.list}>
              {blockedUsers.map((user) => (
                <BlockedUserItem key={user.id} item={user} />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Shield color={Colors.textTertiary} size={48} />
            </View>
            <Text style={styles.emptyTitle}>No Blocked Users</Text>
            <Text style={styles.emptyText}>
              You haven&apos;t blocked anyone yet. When you block someone, they will appear here.
            </Text>
          </View>
        )}
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
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  list: {
    gap: Spacing.md,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.signalGray,
    padding: Spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.darkSecondary,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: 2,
  },
  userSubtext: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  unblockButton: {
    backgroundColor: Colors.softWhite,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Layout.borderRadius.full,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unblockButtonText: {
    ...Typography.captionBold,
    color: Colors.voidBlack,
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
});
