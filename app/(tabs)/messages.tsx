import { useState, useCallback } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, RefreshControl, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Image } from "expo-image";
import { MessageCircle, BadgeCheck } from "lucide-react-native";

import NotificationBell from "@/components/NotificationBell";
import Colors from "@/constants/colors";
import Typography from "@/constants/typography";
import Spacing from "@/constants/spacing";
import Layout from "@/constants/layout";
import { ChatService } from "@/services/chat";
import { Conversation } from "@/domain/types";

export default function MessagesScreen() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConversations = async () => {
    try {
      const response = await ChatService.getConversations();
      if (response.data) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const getDisplayInfo = (conversation: Conversation) => {
    if (conversation.is_group) {
      return {
        name: conversation.group_name || 'Group Chat',
        image: conversation.group_image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
        verified: false,
      };
    }

    // Find other participant
    // In a real app, use the current user ID from auth context
    const currentUserId = 'me'; 
    const otherParticipant = conversation.participants.find(p => p.user_id !== currentUserId);
    const user = otherParticipant?.user;

    return {
      name: user?.name || 'User',
      image: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      verified: user?.verification_status === 'verified',
      age: user?.birthdate ? new Date().getFullYear() - new Date(user.birthdate).getFullYear() : null,
    };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // If less than 24 hours
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // If less than 7 days
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.logo}>pulse</Text>
        <View style={styles.headerRight}>
          <NotificationBell />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.pulseRed} />
        </View>
      ) : conversations.length > 0 ? (
        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.pulseRed} />
          }
        >
          {conversations.map((conversation) => {
            const display = getDisplayInfo(conversation);
            const lastMessage = conversation.last_message?.content || 'Started a conversation';
            const time = conversation.last_message ? formatTime(conversation.last_message.created_at) : '';
            const isUnread = conversation.unread_count > 0;

            return (
              <Pressable 
                key={conversation.id} 
                style={styles.conversationCard}
                onPress={() => router.push(`/chat/${conversation.id}`)}
              >
                <Image 
                  source={{ uri: display.image }} 
                  style={styles.avatar} 
                  contentFit="cover" 
                />
                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <View style={styles.nameContainer}>
                      <Text style={styles.conversationName}>
                        {display.name}{display.age ? `, ${display.age}` : ''}
                      </Text>
                      {display.verified && (
                         <BadgeCheck size={14} color={Colors.softWhite} fill={Colors.pulseRed} />
                      )}
                    </View>
                    <Text style={styles.timestamp}>{time}</Text>
                  </View>
                  <Text 
                    style={[
                      styles.lastMessage,
                      isUnread && styles.lastMessageUnread
                    ]}
                    numberOfLines={1}
                  >
                    {lastMessage}
                  </Text>
                </View>
                {isUnread && <View style={styles.unreadDot} />}
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.emptyState}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.pulseRed} />
          }
        >
          <View style={styles.emptyIcon}>
            <MessageCircle color={Colors.textTertiary} size={48} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptySubtitle}>
            When you match with someone, you can start chatting here
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    width: 40, // Balance
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  logo: {
    ...Typography.h2,
    color: Colors.softWhite,
    letterSpacing: 2,
    fontWeight: '300' as const,
  },
  scrollView: {
    flex: 1,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: Layout.borderRadius.full,
    marginRight: Spacing.md,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  conversationName: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  timestamp: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  lastMessage: {
    ...Typography.callout,
    color: Colors.textSecondary,
  },
  lastMessageUnread: {
    color: Colors.textPrimary,
    fontWeight: '500' as const,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.pulseRed,
    marginLeft: Spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 100, // Push it down a bit
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.signalGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
