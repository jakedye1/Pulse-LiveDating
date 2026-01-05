import { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  ListRenderItem
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Check, CheckCheck, Image as ImageIcon, Smile } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import { ChatService } from '@/services/chat';
import { Message, Conversation } from '@/domain/types';

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [typing, setTyping] = useState(false); // Simulate typing indicator

  // Simulate incoming typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setTyping(true);
      // Stop typing after 3s
      setTimeout(() => setTyping(false), 3000);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        // In a real app, we would fetch conversation details too
        // For now, we mock it or fetch it if available
        const msgsResponse = await ChatService.getMessages(id);
        if (msgsResponse.data) {
          setMessages(msgsResponse.data); // Assuming reversed (newest first) or we reverse it
        }
        
        // Mock conversation details
        setConversation({
           id: id,
           created_at: new Date().toISOString(),
           updated_at: new Date().toISOString(),
           participants: [],
           unread_count: 0,
           is_group: false,
           group_name: 'Emma', // Mock
        });

        // Mark as read
        await ChatService.markAsRead(id);

      } catch (error) {
        console.error('Failed to load chat', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Subscribe to realtime messages
    const unsubscribe = ChatService.subscribeToMessages(id!, (newMessage) => {
       setMessages(prev => [newMessage, ...prev]);
       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleSend = async () => {
    if (!inputText.trim() || !id) return;

    const content = inputText.trim();
    setInputText('');
    setIsSending(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Optimistic update
    const tempId = `temp_${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      conversation_id: id,
      sender_id: 'me',
      content: content,
      created_at: new Date().toISOString(),
      type: 'text',
      status: 'sending'
    };

    setMessages(prev => [optimisticMessage, ...prev]);

    try {
      const response = await ChatService.sendMessage(id, content);
      if (response.data) {
        // Replace optimistic message with real one
        setMessages(prev => prev.map(m => m.id === tempId ? response.data! : m));
      }
    } catch (error) {
      console.error('Failed to send message', error);
      // Mark as failed
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m));
    } finally {
      setIsSending(false);
    }
  };

  const renderMessageItem: ListRenderItem<Message> = ({ item, index }) => {
    const isMe = item.sender_id === 'me';
    const isNextSame = messages[index - 1]?.sender_id === item.sender_id;
    const isPrevSame = messages[index + 1]?.sender_id === item.sender_id;

    // Timestamp formatting
    const time = new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={[
        styles.messageRow, 
        isMe ? styles.messageRowMe : styles.messageRowOther,
        !isPrevSame && { marginTop: 12 }
      ]}>
        {!isMe && !isPrevSame && (
           <Image 
             source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' }} 
             style={styles.avatarSmall} 
           />
        )}
        {!isMe && isPrevSame && <View style={styles.avatarSpacer} />}

        <View style={[
          styles.bubble, 
          isMe ? styles.bubbleMe : styles.bubbleOther,
          isMe && isNextSame && { borderBottomRightRadius: 4 },
          isMe && isPrevSame && { borderTopRightRadius: 4 },
          !isMe && isNextSame && { borderBottomLeftRadius: 4 },
          !isMe && isPrevSame && { borderTopLeftRadius: 4 },
        ]}>
           <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
             {item.content}
           </Text>
           <View style={styles.metaContainer}>
             <Text style={[styles.timestamp, isMe ? styles.timestampMe : styles.timestampOther]}>
               {time}
             </Text>
             {isMe && (
               <View style={styles.statusIcon}>
                 {item.status === 'sending' && <ActivityIndicator size="small" color="rgba(255,255,255,0.5)" />}
                 {item.status === 'sent' && <Check size={12} color="rgba(255,255,255,0.7)" />}
                 {item.status === 'delivered' && <CheckCheck size={12} color="rgba(255,255,255,0.7)" />}
                 {item.status === 'read' && <CheckCheck size={12} color={Colors.softWhite} />}
               </View>
             )}
           </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.softWhite} />
        </Pressable>
        
        <View style={styles.headerContent}>
          <Image 
             source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' }} 
             style={styles.headerAvatar} 
          />
          <View>
            <Text style={styles.headerName}>{conversation?.group_name || 'Emma'}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
           <Pressable style={styles.headerBtn} onPress={() => router.push(`/call/${id}?type=audio`)}>
             <Phone size={22} color={Colors.softWhite} />
           </Pressable>
           <Pressable style={styles.headerBtn} onPress={() => router.push(`/call/${id}?type=video`)}>
             <Video size={24} color={Colors.softWhite} />
           </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={styles.keyboardView}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={item => item.id}
          inverted
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            <>
              {typing && (
                <View style={[styles.messageRow, styles.messageRowOther, { marginBottom: 12, marginLeft: 36 }]}>
                   <View style={[styles.bubble, styles.bubbleOther, { paddingVertical: 12, width: 60, alignItems: 'center' }]}>
                      <ActivityIndicator size="small" color={Colors.textSecondary} />
                   </View>
                </View>
              )}
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color={Colors.pulseRed} />
                </View>
              ) : null}
            </>
          }
        />

        {/* Input Area */}
        <BlurView intensity={80} tint="dark" style={[styles.inputContainer, { paddingBottom: insets.bottom + 10 }]}>
           <Pressable style={styles.attachBtn}>
             <MoreVertical size={24} color={Colors.textSecondary} />
           </Pressable>
           
           <View style={styles.inputWrapper}>
             <TextInput
               style={styles.input}
               placeholder="Message..."
               placeholderTextColor={Colors.textSecondary}
               value={inputText}
               onChangeText={setInputText}
               multiline
               maxLength={1000}
             />
             <Pressable style={styles.stickerBtn}>
               <Smile size={20} color={Colors.textSecondary} />
             </Pressable>
           </View>

           {inputText.trim() ? (
             <Pressable style={[styles.sendBtn, isSending && styles.sendBtnDisabled]} onPress={handleSend} disabled={isSending}>
               <Send size={20} color={Colors.softWhite} fill={Colors.softWhite} />
             </Pressable>
           ) : (
             <Pressable style={styles.attachBtn}>
               <ImageIcon size={24} color={Colors.textSecondary} />
             </Pressable>
           )}
        </BlurView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: 'rgba(10,10,10,0.9)',
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: Colors.darkSecondary,
  },
  headerName: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  headerStatus: {
    ...Typography.caption,
    color: Colors.success,
    fontSize: 11,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerBtn: {
    padding: 4,
  },
  keyboardView: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 2,
  },
  avatarSpacer: {
    width: 36,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bubbleMe: {
    backgroundColor: Colors.pulseRed,
  },
  bubbleOther: {
    backgroundColor: Colors.darkSecondary,
  },
  messageText: {
    ...Typography.body,
    fontSize: 16,
    lineHeight: 22,
  },
  messageTextMe: {
    color: Colors.softWhite,
  },
  messageTextOther: {
    color: Colors.softWhite,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  timestamp: {
    ...Typography.caption,
    fontSize: 10,
  },
  timestampMe: {
    color: 'rgba(255,255,255,0.7)',
  },
  timestampOther: {
    color: Colors.textSecondary,
  },
  statusIcon: {
    marginLeft: 2,
  },
  
  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  attachBtn: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.signalGray,
    borderRadius: 20,
    marginHorizontal: 4,
    minHeight: 40,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    color: Colors.softWhite,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  stickerBtn: {
    padding: 4,
  },
  sendBtn: {
    padding: 10,
    backgroundColor: Colors.pulseRed,
    borderRadius: 20,
    marginLeft: 4,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
});
