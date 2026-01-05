import { StyleSheet, View, Text, ScrollView, Pressable, Alert, ActivityIndicator, Dimensions } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ChevronLeft, MoreHorizontal, MessageCircle, Video, Ban, Flag, BadgeCheck } from "lucide-react-native";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/colors";
import Typography from "@/constants/typography";
import Spacing from "@/constants/spacing";
import Layout from "@/constants/layout";
import { useAuth } from "@/context/AuthContext";

import { MOCK_USERS } from "@/constants/mocks";

const { width } = Dimensions.get('window');

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { blockUser } = useAuth();
  const [blocking, setBlocking] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // In a real app, useQuery to fetch user
  const user = MOCK_USERS[id as string] || { 
    id: id || 'unknown', 
    name: 'User', 
    age: 25, 
    bio: 'No bio available', 
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    images: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800']
  };

  const userImages = user.images && user.images.length > 0 ? user.images : [user.image];

  const handleImageTap = () => {
    if (userImages.length > 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentImageIndex((prev) => (prev + 1) % userImages.length);
    }
  };

  const handleBlock = () => {
    Alert.alert(
      `Block ${user.name}?`,
      "They won't be able to view your profile, message you, or find you on Pulse. You can unblock them in Settings.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: async () => {
             setBlocking(true);
             try {
               if (id) {
                 await blockUser(id);
                 Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                 // Ideally show a toast here
                 router.back();
               }
             } catch (error) {
               console.error(error);
               Alert.alert("Error", "Could not block user. Please try again.");
             } finally {
               setBlocking(false);
             }
          }
        }
      ]
    );
  };
  
  const handleReport = () => {
     router.push({
      pathname: '/report-problem',
      params: { 
        reportType: 'User', 
        targetId: id 
      }
    });
  };

  const showOptions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Options",
      undefined,
      [
        { text: "Report User", onPress: handleReport },
        { text: "Block User", onPress: handleBlock, style: "destructive" },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  return (
    <View style={styles.container}>
       <Stack.Screen options={{ headerShown: false }} />
       
       <ScrollView style={styles.scrollView} bounces={false}>
          <View style={styles.imageContainer}>
             <Pressable onPress={handleImageTap} style={StyleSheet.absoluteFill}>
               <Image 
                 source={{ uri: userImages[currentImageIndex] }} 
                 style={styles.image} 
                 contentFit="cover"
                 transition={200}
               />
               <LinearGradient
                  colors={['rgba(0,0,0,0.3)', 'transparent', 'transparent', Colors.voidBlack]}
                  style={styles.gradient}
               />
             </Pressable>
             
             <View style={styles.header} pointerEvents="box-none">
               <Pressable onPress={() => router.back()} style={styles.iconButton}>
                 <ChevronLeft color={Colors.softWhite} size={28} />
               </Pressable>
               <Pressable onPress={showOptions} style={styles.iconButton}>
                 <MoreHorizontal color={Colors.softWhite} size={28} />
               </Pressable>
             </View>
             
             <View style={styles.userInfo} pointerEvents="none">
                <View style={styles.nameContainer}>
                  <Text style={styles.userName}>{user.name}, {user.age}</Text>
                  {user.verification_status === 'verified' && (
                    <View style={styles.badgeContainer}>
                      <BadgeCheck size={20} color={Colors.softWhite} fill={Colors.pulseRed} />
                      <Text style={styles.badgeText}>Verified</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.userBio}>{user.bio}</Text>
             </View>
          </View>

          <View style={styles.actions}>
             <Pressable style={styles.actionButton} onPress={() => {}}>
                <MessageCircle color={Colors.softWhite} size={24} />
                <Text style={styles.actionText}>Message</Text>
             </Pressable>
              <Pressable style={styles.actionButton} onPress={() => {}}>
                <Video color={Colors.softWhite} size={24} />
                <Text style={styles.actionText}>Video Call</Text>
             </Pressable>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.tags}>
               {['Photography', 'Travel', 'Music'].map(tag => (
                 <View key={tag} style={styles.tag}>
                   <Text style={styles.tagText}>{tag}</Text>
                 </View>
               ))}
            </View>
          </View>
          
          <View style={styles.dangerZone}>
            <Pressable style={styles.blockButton} onPress={handleBlock} disabled={blocking}>
              {blocking ? <ActivityIndicator color={Colors.pulseRed} /> : (
                <>
                  <Ban color={Colors.pulseRed} size={20} />
                  <Text style={styles.blockText}>Block {user.name}</Text>
                </>
              )}
            </Pressable>
            
            <Pressable style={styles.reportButton} onPress={handleReport}>
              <Flag color={Colors.textSecondary} size={20} />
              <Text style={styles.reportText}>Report {user.name}</Text>
            </Pressable>
          </View>
          
          <View style={{ height: 100 }} />
       </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: width * 1.25, // 4:5 Aspect Ratio like Instagram/Tinder
    position: 'relative',
    justifyContent: 'flex-end',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    zIndex: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)', // iOS only
  },
  userInfo: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  userName: {
    ...Typography.h1,
    color: Colors.softWhite,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 45, 45, 0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.full,
    gap: 4,
  },
  badgeText: {
    ...Typography.captionBold,
    color: Colors.softWhite,
    fontSize: 12,
  },
  userBio: {
    ...Typography.body,
    color: Colors.textSecondary,
    maxWidth: '90%',
  },
  actions: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.signalGray,
    paddingVertical: Spacing.md,
    borderRadius: Layout.borderRadius.full,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  section: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.softWhite,
    marginBottom: Spacing.md,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  dangerZone: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  blockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
    borderRadius: Layout.borderRadius.lg,
    gap: Spacing.sm,
  },
  blockText: {
    ...Typography.bodyBold,
    color: Colors.pulseRed,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  reportText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
