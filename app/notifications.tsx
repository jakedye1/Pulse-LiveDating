import React from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, MessageCircle, Heart, UserPlus, Video, Users, Info, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { formatDistanceToNow } from 'date-fns';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import { trpc } from '@/lib/trpc';
import type { Notification } from '@/backend/trpc/routes/notifications';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: notifications, isLoading, refetch } = trpc.notifications.getAll.useQuery();
  
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.getAll.invalidate();
    },
  });

  // Mark all as read on mount (optional per spec, but "On Screen Open" was one option)
  // The spec says: "On Screen Open -> Fetch notifications -> Mark all as read (or mark on tap)"
  // Let's stick to "Mark on Tap" for individual read status as it feels more interactive,
  // but maybe provide a "Mark all read" button or do it automatically. 
  // The spec says "Mark all as read (or mark on tap—pick one approach and be consistent)".
  // I will implement "Mark on Tap" as primary, but maybe trigger mark all read when leaving or entering?
  // Let's implement "Mark on Tap" clearly first.

  const handleNotificationPress = (notification: Notification) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Mark as read
    if (!notification.isRead) {
      markAsReadMutation.mutate({ id: notification.id });
    }

    // Deep linking logic
    switch (notification.type) {
      case 'match':
        if (notification.targetId) {
          router.push(`/users/${notification.targetId}`);
        }
        break;
      case 'message':
        // Assuming we have a way to go to specific chat, for now go to messages tab
        router.push('/(tabs)/messages');
        break;
      case 'friend_request':
        router.push('/(tabs)/home'); // Redirect to home for friends
        break;
      case 'group_invite':
        // router.push(`/groups/${notification.targetId}`);
        router.push('/(tabs)/discover'); // Fallback
        break;
      case 'live_video_invite':
        router.push('/(tabs)/live');
        break;
      case 'system':
        // Show modal or alert
        // For now, just stay here or maybe show a detail modal
        break;
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'match': return <Heart size={20} color={Colors.pulseRed} fill={Colors.pulseRed} />;
      case 'message': return <MessageCircle size={20} color={Colors.softWhite} />;
      case 'friend_request': return <UserPlus size={20} color={Colors.success} />;
      case 'group_invite': return <Users size={20} color={Colors.warning} />;
      case 'live_video_invite': return <Video size={20} color={Colors.pulseRed} />;
      case 'system': return <Info size={20} color={Colors.textSecondary} />;
      default: return <Bell size={20} color={Colors.textSecondary} />;
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <Pressable 
      style={[styles.itemContainer, !item.isRead && styles.itemUnread]} 
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.iconContainer}>
        {getIcon(item.type)}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, !item.isRead && styles.titleBold]}>{item.title}</Text>
        <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.timestamp}>
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color={Colors.softWhite} />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={Colors.softWhite} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Bell size={48} color={Colors.textTertiary} />
              <Text style={styles.emptyText}>You&apos;re all caught up</Text>
              <Text style={styles.emptySubtext}>No new notifications yet.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.voidBlack,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.softWhite,
  },
  headerRight: {
    width: 28, // Balance back button
  },
  listContent: {
    paddingBottom: Spacing.xxxl,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'flex-start',
  },
  itemUnread: {
    backgroundColor: 'rgba(255, 45, 45, 0.05)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.signalGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    ...Typography.body,
    color: Colors.softWhite,
    marginBottom: 2,
  },
  titleBold: {
    fontWeight: '700',
  },
  body: {
    ...Typography.callout,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  timestamp: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.pulseRed,
    marginTop: 6,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: Spacing.md,
  },
  emptyText: {
    ...Typography.h3,
    color: Colors.softWhite,
  },
  emptySubtext: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
