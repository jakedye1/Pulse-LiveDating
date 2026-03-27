import { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  Dimensions, 
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  PhoneOff, 
  FlipHorizontal, 
  MoreHorizontal,
  ShieldAlert
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';
import { VideoService } from '@/services/video';
import { CallSession } from '@/domain/types';

const { width, height } = Dimensions.get('window');

type CallState = 'lobby' | 'connecting' | 'connected' | 'reconnecting' | 'ended';

export default function CallScreen() {
  const { id, type = 'video' } = useLocalSearchParams<{ id: string, type: 'video' | 'audio' }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [callState, setCallState] = useState<CallState>('lobby');
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(type === 'video');
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [session, setSession] = useState<CallSession | null>(null);
  
  // Lobby initialization
  useEffect(() => {
    // In a real app, we would request permissions here
    
    // Auto-join if it's an incoming call or we just started it
    // For this demo, we stay in lobby for a moment then connect
    if (callState === 'lobby') {
      // Setup preview
    }
  }, [callState]);

  const handleJoinCall = async () => {
    setCallState('connecting');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // 1. Get Token
      const tokenRes = await VideoService.fetchAccessToken(id!, 'me');
      if (tokenRes.error) throw new Error(tokenRes.error.message);
      
      // 2. Join Room
      const roomRes = await VideoService.joinRoom(id!, tokenRes.data!);
      if (roomRes.data) {
        setSession(roomRes.data);
        setCallState('connected');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Failed to join call', error);
      setCallState('ended');
    }
  };

  const handleEndCall = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCallState('ended');
    
    if (session?.id) {
       await VideoService.leaveRoom(session.id);
    }
    
    // Navigate back after a delay
    setTimeout(() => {
      router.back();
    }, 1500);
  };

  const renderLobby = () => (
    <View style={styles.container}>
       <Image 
         source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&fit=crop' }} 
         style={styles.fullScreenImage}
         contentFit="cover"
         blurRadius={20}
       />
       
       <BlurView intensity={40} tint="dark" style={styles.lobbyContent}>
         <View style={[styles.previewContainer, { marginTop: insets.top + 60 }]}>
            {cameraOn ? (
               <Image 
                 source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&fit=crop' }} 
                 style={styles.previewImage}
                 contentFit="cover"
               />
            ) : (
               <View style={styles.previewPlaceholder}>
                 <View style={styles.avatarLarge}>
                   <Text style={styles.avatarText}>ME</Text>
                 </View>
               </View>
            )}
            
            <View style={styles.previewControls}>
               <Pressable 
                 style={[styles.controlBtn, !micOn && styles.controlBtnOff]} 
                 onPress={() => setMicOn(!micOn)}
               >
                 {micOn ? <Mic size={24} color={Colors.softWhite} /> : <MicOff size={24} color={Colors.voidBlack} />}
               </Pressable>
               <Pressable 
                 style={[styles.controlBtn, !cameraOn && styles.controlBtnOff]} 
                 onPress={() => setCameraOn(!cameraOn)}
               >
                 {cameraOn ? <VideoIcon size={24} color={Colors.softWhite} /> : <VideoOff size={24} color={Colors.voidBlack} />}
               </Pressable>
               <Pressable 
                 style={styles.controlBtn} 
                 onPress={() => {
                   setIsFrontCamera(!isFrontCamera);
                   VideoService.switchCamera();
                 }}
               >
                 <FlipHorizontal size={24} color={Colors.softWhite} />
               </Pressable>
            </View>
         </View>
         
         <View style={styles.lobbyActions}>
            <Text style={styles.lobbyTitle}>Ready to join?</Text>
            <Pressable style={styles.joinBtn} onPress={handleJoinCall}>
              <Text style={styles.joinBtnText}>Join Call</Text>
            </Pressable>
            <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
         </View>
       </BlurView>
    </View>
  );

  const renderConnected = () => (
    <View style={styles.container}>
      {/* Remote Participant */}
      <View style={styles.remoteVideoContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&fit=crop' }} 
          style={styles.remoteVideo}
          contentFit="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent']}
          style={styles.topGradient}
        >
          <View style={[styles.header, { paddingTop: insets.top }]}>
             <Text style={styles.remoteName}>Emma</Text>
             <View style={styles.signalIndicator}>
                <View style={[styles.signalDot, { backgroundColor: Colors.success }]} />
                <Text style={styles.signalText}>Good</Text>
             </View>
          </View>
        </LinearGradient>
      </View>

      {/* Local Participant (PIP) */}
      <View style={[styles.localPip, { top: insets.top + 60 }]}>
         {cameraOn ? (
           <Image 
             source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop' }} 
             style={styles.localVideo}
             contentFit="cover"
           />
         ) : (
           <View style={styles.localPlaceholder}>
             <Text style={styles.localPlaceholderText}>Me</Text>
           </View>
         )}
      </View>

      {/* Controls Overlay */}
      <LinearGradient
         colors={['transparent', 'rgba(0,0,0,0.8)']}
         style={styles.bottomOverlay}
      >
         <View style={styles.controlsRow}>
            <Pressable 
               style={[styles.callControlBtn, !micOn && styles.btnOff]} 
               onPress={() => {
                 setMicOn(!micOn);
                 VideoService.toggleMute(micOn);
               }}
            >
               {micOn ? <Mic size={24} color={Colors.softWhite} /> : <MicOff size={24} color={Colors.voidBlack} />}
            </Pressable>
            
            <Pressable 
               style={[styles.callControlBtn, !cameraOn && styles.btnOff]} 
               onPress={() => {
                 setCameraOn(!cameraOn);
                 VideoService.toggleCamera(cameraOn);
               }}
            >
               {cameraOn ? <VideoIcon size={24} color={Colors.softWhite} /> : <VideoOff size={24} color={Colors.voidBlack} />}
            </Pressable>

            <Pressable 
               style={[styles.callControlBtn, styles.endCallBtn]} 
               onPress={handleEndCall}
            >
               <PhoneOff size={32} color={Colors.softWhite} fill={Colors.softWhite} />
            </Pressable>

            <Pressable 
               style={styles.callControlBtn} 
               onPress={() => {
                 setIsFrontCamera(!isFrontCamera);
                 VideoService.switchCamera();
               }}
            >
               <FlipHorizontal size={24} color={Colors.softWhite} />
            </Pressable>

            <Pressable style={styles.callControlBtn}>
               <MoreHorizontal size={24} color={Colors.softWhite} />
            </Pressable>
         </View>
      </LinearGradient>
    </View>
  );

  const renderEnded = () => (
    <View style={styles.container}>
      <BlurView intensity={80} tint="dark" style={styles.endedContent}>
        <View style={styles.endedIconContainer}>
           <PhoneOff size={48} color={Colors.textSecondary} />
        </View>
        <Text style={styles.endedTitle}>Call Ended</Text>
        <Text style={styles.endedSubtitle}>Duration: 12:04</Text>
        
        <View style={styles.feedbackContainer}>
           <Text style={styles.feedbackTitle}>How was the quality?</Text>
           <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} style={styles.starBtn}>
                  <Text style={styles.starText}>⭐</Text>
                </Pressable>
              ))}
           </View>
        </View>
        
        <Pressable style={styles.reportGhostBtn}>
          <ShieldAlert size={16} color={Colors.pulseRed} />
          <Text style={styles.reportText}>Report Problem</Text>
        </Pressable>
      </BlurView>
    </View>
  );

  if (callState === 'connecting') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.pulseRed} />
        <Text style={[styles.lobbyTitle, { marginTop: 20 }]}>Connecting...</Text>
      </View>
    );
  }

  return (
    <>
      {callState === 'lobby' && renderLobby()}
      {callState === 'connected' && renderConnected()}
      {callState === 'ended' && renderEnded()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenImage: {
    ...StyleSheet.absoluteFillObject,
  },
  lobbyContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingBottom: 60,
  },
  previewContainer: {
    alignSelf: 'center',
    width: width * 0.8,
    aspectRatio: 3/4,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: Colors.signalGray,
    position: 'relative',
    ...Layout.shadow.lg,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.darkSecondary,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.h3,
    color: Colors.textSecondary,
  },
  previewControls: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 24,
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  controlBtnOff: {
    backgroundColor: Colors.softWhite,
  },
  lobbyActions: {
    paddingHorizontal: Spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  lobbyTitle: {
    ...Typography.h2,
    color: Colors.softWhite,
    marginBottom: Spacing.xl,
  },
  joinBtn: {
    width: '100%',
    paddingVertical: 18,
    backgroundColor: Colors.success,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  joinBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 18,
  },
  cancelBtn: {
    padding: 12,
  },
  cancelBtnText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  
  // Connected Styles
  remoteVideoContainer: {
    flex: 1,
    width: width,
    height: height,
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remoteName: {
    ...Typography.h3,
    color: Colors.softWhite,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  signalIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  signalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  signalText: {
    ...Typography.caption,
    color: Colors.softWhite,
    fontSize: 12,
  },
  localPip: {
    position: 'absolute',
    right: Spacing.lg,
    width: 100,
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.signalGray,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    ...Layout.shadow.md,
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  localPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
  },
  localPlaceholderText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
    paddingTop: 40,
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  callControlBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOff: {
    backgroundColor: Colors.softWhite,
  },
  endCallBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.pulseRed,
  },
  
  // Ended Styles
  endedContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  endedIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  endedTitle: {
    ...Typography.h2,
    color: Colors.softWhite,
    marginBottom: 8,
  },
  endedSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxxl,
  },
  feedbackContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  feedbackTitle: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    marginBottom: Spacing.md,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  starBtn: {
    padding: 8,
  },
  starText: {
    fontSize: 24,
  },
  reportGhostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  reportText: {
    ...Typography.body,
    color: Colors.pulseRed,
  },
});
