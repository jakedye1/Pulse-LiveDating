import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { trpc } from '@/lib/trpc';
import Spacing from '@/constants/spacing';

export default function NotificationBell() {
  const router = useRouter();

  // Fetch notifications for badge count
  // Using the same query key/logic as Home screen so it shares cache/state
  const { data: notifications } = trpc.notifications.getAll.useQuery(undefined, {
    refetchInterval: 5000, 
  });
  
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <Pressable style={styles.iconBtn} onPress={() => router.push('/notifications')}>
      <Bell size={24} color={Colors.softWhite} />
      {unreadCount > 0 && (
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    padding: Spacing.xs,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.pulseRed,
    borderWidth: 1.5,
    borderColor: Colors.voidBlack,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    zIndex: 10,
  },
  notificationBadgeText: {
    color: Colors.softWhite,
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },
});
