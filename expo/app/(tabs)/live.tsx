import { StyleSheet, View, Text, Pressable, Animated, Dimensions, Modal, Platform, ActivityIndicator } from "react-native";
import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Flag, SkipForward, Users, MessageSquare, Heart, Sparkles, AlertTriangle, X, Zap, Check, Star } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import Colors from "@/constants/colors";
import Typography from "@/constants/typography";
import Spacing from "@/constants/spacing";
import Layout from "@/constants/layout";
import { useAppMode } from "@/context/AppModeContext";
import { trpc } from "@/lib/trpc";

const { width, height } = Dimensions.get('window');

type LiveStatus = 'idle' | 'searching' | 'match_found' | 'connected' | 'decision';

export default function LiveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { autoStart } = useLocalSearchParams();
  const { mode, setMode } = useAppMode();
  const [status, setStatus] = useState<LiveStatus>('idle');
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  
  // Gate State
  const [showGate, setShowGate] = useState(false);
  const [gateDecision, setGateDecision] = useState<'undecided' | 'yes' | 'no'>('undecided');
  const [waitingForPartner, setWaitingForPartner] = useState(false);
  const [decisionTimer, setDecisionTimer] = useState(5);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const gateTimeoutRef = useRef<any>(null);
  const decisionIntervalRef = useRef<any>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const gateSlideAnim = useRef(new Animated.Value(300)).current;

  const limitsQuery = trpc.limits.getLimits.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const checkLimitQuery = trpc.limits.checkLiveCallLimit.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const matchLimitQuery = trpc.limits.checkMatchLimit.useQuery(undefined, {
    enabled: mode === 'dating' && status === 'connected',
  });
  
  const recordCallMutation = trpc.limits.recordLiveCall.useMutation();
  const recordMatchMutation = trpc.limits.recordMatch.useMutation();
  const purchaseMutation = trpc.limits.purchaseExtraCalls.useMutation({
    onSuccess: () => {
      limitsQuery.refetch();
      checkLimitQuery.refetch();
      setShowUpsellModal(false);
      handleStart();
    },
  });

  // Toast Timer
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Gate Logic
  useEffect(() => {
    if (status === 'connected' && mode === 'dating') {
      // Start 10s timer to show gate
      gateTimeoutRef.current = setTimeout(() => {
        setShowGate(true);
        // Animate slide up
        Animated.spring(gateSlideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 15,
          stiffness: 100,
        }).start();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 10000);
    } else {
      // Cleanup if status changes or mode changes
      if (gateTimeoutRef.current) clearTimeout(gateTimeoutRef.current);
      setShowGate(false);
      gateSlideAnim.setValue(300); // Reset position
      setGateDecision('undecided');
      setWaitingForPartner(false);
      setDecisionTimer(5);
    }
    return () => {
      if (gateTimeoutRef.current) clearTimeout(gateTimeoutRef.current);
      if (decisionIntervalRef.current) clearInterval(decisionIntervalRef.current);
    };
  }, [status, mode, gateSlideAnim]);

  const handleGateSuccess = useCallback(() => {
    setWaitingForPartner(false);
    setShowGate(false);
    
    // Check match limit
    const matchLimit = matchLimitQuery.data;
    if (matchLimit && !matchLimit.allowed) {
        setToastMessage("Daily match limit reached. Call continues but match not saved.");
    } else {
        recordMatchMutation.mutate();
        setToastMessage("It's a match! Keep talking.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [matchLimitQuery.data, recordMatchMutation]);

  const handleStart = useCallback(() => {
    if (checkLimitQuery.isError || !checkLimitQuery.data) {
      console.log('Starting without limit check (backend unavailable)');
    } else {
      const limitCheck = checkLimitQuery.data;
      if (!limitCheck?.allowed) {
        setShowUpsellModal(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStatus('searching');
    
    setTimeout(() => {
      setStatus('match_found');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      setTimeout(() => {
        setStatus('connected');
        if (!checkLimitQuery.isError) {
          recordCallMutation.mutate();
        }
      }, 1500);
    }, 3000);
  }, [checkLimitQuery.isError, checkLimitQuery.data, recordCallMutation]);

  const handleGateDecision = useCallback((choice: 'yes' | 'skip') => {
    if (choice === 'skip') {
      setGateDecision('no');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      // End call and go to idle/searching
      if (decisionIntervalRef.current) clearInterval(decisionIntervalRef.current);
      
      // Show failure feedback
      setToastMessage("No match this time. Finding someone new...");
      
      // Reset after short delay to searching (requeue)
      setTimeout(() => {
        handleStart(); // Requeue
      }, 2000);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setGateDecision('yes');
      setWaitingForPartner(true);
      
      // Simulate partner decision delay (1.5s)
      setTimeout(() => {
        // Partner says YES (simulated)
        handleGateSuccess();
      }, 1500);
    }
  }, [handleGateSuccess, handleStart]);

  // Decision Timer Logic
  useEffect(() => {
    if (showGate && gateDecision === 'undecided') {
       decisionIntervalRef.current = setInterval(() => {
         setDecisionTimer((prev) => {
           if (prev <= 1) {
             handleGateDecision('skip');
             return 0;
           }
           return prev - 1;
         });
       }, 1000);
    }
    return () => {
      if (decisionIntervalRef.current) clearInterval(decisionIntervalRef.current);
    };
  }, [showGate, gateDecision, handleGateDecision]);

  // Reset status when mode changes
  useEffect(() => {
    setStatus('idle');
  }, [mode]);

  // Handle auto-start from other screens
  useEffect(() => {
    if (autoStart === 'true' && status === 'idle') {
      if (!checkLimitQuery.isError && checkLimitQuery.data && !checkLimitQuery.data.allowed) {
        setShowUpsellModal(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setStatus('searching');
      
      setTimeout(() => {
        setStatus('match_found');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        setTimeout(() => {
          setStatus('connected');
          if (!checkLimitQuery.isError) {
            recordCallMutation.mutate();
          }
        }, 1500);
      }, 3000);
    }
  }, [autoStart, status, checkLimitQuery.data, checkLimitQuery.isError, recordCallMutation]);

  useEffect(() => {
    let pulse: Animated.CompositeAnimation;
    if (status === 'searching' || status === 'match_found' || status === 'idle') {
      pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => pulse?.stop();
  }, [pulseAnim, status]);


  const handleEndCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Cleanup gate timers
    if (gateTimeoutRef.current) clearTimeout(gateTimeoutRef.current);
    if (decisionIntervalRef.current) clearInterval(decisionIntervalRef.current);
    
    setStatus('decision');
  };

  const handleDecision = (choice: 'keep' | 'skip' | 'report') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (choice === 'keep') {
       // Logic to create match
    }
    if (!limitsQuery.isError) {
      limitsQuery.refetch();
    }
    if (!checkLimitQuery.isError) {
      checkLimitQuery.refetch();
    }
    setStatus('idle');
  };

  const handleNextMatch = () => {
    handleDecision('skip');
    setTimeout(() => handleStart(), 100);
  };

  const handlePurchaseExtraCalls = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    purchaseMutation.mutate();
  };

  const renderUpsellModal = () => (
    <Modal
      visible={showUpsellModal}
      transparent
      animationType="slide"
      onRequestClose={() => {
        setShowUpsellModal(false);
        router.navigate('/(tabs)/home');
      }}
    >
      <BlurView intensity={80} tint="dark" style={styles.modalOverlay}>
        <Pressable 
          style={styles.modalBackdrop} 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowUpsellModal(false);
            router.push('/(tabs)/home');
          }}
        />
        <View style={styles.modalContent}>
          <LinearGradient
            colors={['#1a1a1a', '#000000']}
            style={styles.modalGradient}
          />
          
          <View style={styles.premiumBadge}>
            <LinearGradient
              colors={[Colors.pulseRed, Colors.accentRed]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumBadgeGradient}
            >
              <Star size={12} color="#FFF" fill="#FFF" />
              <Text style={styles.premiumBadgeText}>PULSE POWER-UP</Text>
            </LinearGradient>
          </View>

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Daily Limit Reached</Text>
            <Text style={styles.modalSubtitle}>
              You&apos;ve used all 5 free live calls today. Refill your energy to keep connecting.
            </Text>
          </View>

          <View style={styles.offerCard}>
            <LinearGradient
              colors={['rgba(255, 45, 45, 0.1)', 'rgba(255, 45, 45, 0.02)']}
              style={styles.offerBackground}
            />
            <View style={styles.offerContent}>
              <View style={styles.offerLeft}>
                 <Text style={styles.offerBigText}>5 Extra Calls</Text>
                 <Text style={styles.offerSmallText}>Valid for 24 hours</Text>
              </View>
              <View style={styles.offerPriceContainer}>
                 <Text style={styles.offerPrice}>$2.99</Text>
              </View>
            </View>
          </View>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Check size={14} color={Colors.success} strokeWidth={3} />
              </View>
              <Text style={styles.benefitText}>Instant access to live video</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Check size={14} color={Colors.success} strokeWidth={3} />
              </View>
              <Text style={styles.benefitText}>Works in Dating, Friends & Groups</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Check size={14} color={Colors.success} strokeWidth={3} />
              </View>
              <Text style={styles.benefitText}>Support the platform</Text>
            </View>
          </View>

          <Pressable 
            style={({ pressed }) => [
              styles.modalPrimaryBtn,
              pressed && styles.modalPrimaryBtnPressed,
              purchaseMutation.isPending && styles.modalPrimaryBtnDisabled
            ]}
            onPress={handlePurchaseExtraCalls}
            disabled={purchaseMutation.isPending}
          >
            <LinearGradient
              colors={[Colors.pulseRed, Colors.accentRed]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {purchaseMutation.isPending ? (
                <Text style={styles.modalPrimaryBtnText}>Processing...</Text>
              ) : (
                <>
                  <Text style={styles.modalPrimaryBtnText}>Get 5 Calls for $2.99</Text>
                  <Zap size={20} color={Colors.softWhite} fill={Colors.softWhite} />
                </>
              )}
            </LinearGradient>
          </Pressable>

          <Pressable 
            style={styles.modalSecondaryBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowUpsellModal(false);
              router.navigate('/(tabs)/home');
            }}
          >
            <Text style={styles.modalSecondaryBtnText}>Not Now</Text>
          </Pressable>
        </View>
      </BlurView>
    </Modal>
  );

  const renderIdleState = () => (
    <View style={styles.centerContent}>
      
      <View style={styles.modeSelectorContainer}>
        <View style={styles.modeSelector}>
          <Pressable 
            style={[styles.modeBtn, mode === 'dating' && styles.modeBtnActive]} 
            onPress={() => setMode('dating')}
          >
            <Heart size={16} color={mode === 'dating' ? Colors.softWhite : Colors.textSecondary} fill={mode === 'dating' ? Colors.pulseRed : 'transparent'} />
            <Text style={[styles.modeText, mode === 'dating' && styles.modeTextActive]}>Dating</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.modeBtn, mode === 'groups' && styles.modeBtnActive]} 
            onPress={() => setMode('groups')}
          >
            <Users size={16} color={mode === 'groups' ? Colors.softWhite : Colors.textSecondary} />
            <Text style={[styles.modeText, mode === 'groups' && styles.modeTextActive]}>Groups</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.modeBtn, mode === 'friends' && styles.modeBtnActive]} 
            onPress={() => setMode('friends')}
          >
            <Sparkles size={16} color={mode === 'friends' ? Colors.softWhite : Colors.textSecondary} />
            <Text style={[styles.modeText, mode === 'friends' && styles.modeTextActive]}>Friends</Text>
          </Pressable>
        </View>
      </View>

      <Animated.View style={[styles.pulseContainer, { transform: [{ scale: pulseAnim }] }]}>
        <View style={styles.pulseOuter}>
          <View style={styles.pulseMiddle}>
            <View style={styles.pulseInner}>
              {mode === 'dating' && <Heart color={Colors.softWhite} size={48} strokeWidth={1.5} fill={Colors.softWhite} />}
              {mode === 'groups' && <Users color={Colors.softWhite} size={48} strokeWidth={1.5} />}
              {mode === 'friends' && <Sparkles color={Colors.softWhite} size={48} strokeWidth={1.5} />}
            </View>
          </View>
        </View>
      </Animated.View>

      <Text style={styles.title}>
        {mode === 'dating' ? 'Start Dating' : mode === 'groups' ? 'Join a Group' : 'Hangout with Friends'}
      </Text>
      <Text style={styles.subtitle}>
        {mode === 'dating' 
          ? 'Connect instantly with someone new' 
          : mode === 'groups' 
          ? 'Find your community in live rooms' 
          : 'See which friends are online'}
      </Text>

      <Pressable 
        style={({ pressed }) => [
          styles.startButton,
          pressed && styles.startButtonPressed
        ]}
        onPress={handleStart}
      >
        <Text style={styles.startButtonText}>
          {mode === 'dating' ? 'Start Pulse' : mode === 'groups' ? 'Explore Rooms' : 'Go Live'}
        </Text>
      </Pressable>
    </View>
  );

  const renderSearchingState = () => (
    <View style={styles.centerContent}>
      <Animated.View style={[styles.pulseContainer, { transform: [{ scale: pulseAnim }] }]}>
        <View style={[styles.pulseOuter, { backgroundColor: 'rgba(255, 45, 45, 0.05)' }]}>
          <View style={[styles.pulseMiddle, { backgroundColor: 'rgba(255, 45, 45, 0.1)' }]}>
             <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' }} 
                style={styles.searchingAvatar} 
                contentFit="cover"
              />
          </View>
        </View>
      </Animated.View>
      <Text style={styles.searchingText}>
        {mode === 'dating' ? 'Finding someone to vibe with...' : mode === 'groups' ? 'Finding someone from your groups...' : 'Finding a new friend...'}
      </Text>
      <Pressable style={styles.cancelButton} onPress={() => setStatus('idle')}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </View>
  );

  const renderMatchFoundState = () => (
    <View style={styles.centerContent}>
      <View style={[styles.pulseContainer, { transform: [{ scale: 1.1 }] }]}>
        <View style={[styles.pulseOuter, { backgroundColor: 'rgba(48, 209, 88, 0.1)' }]}>
          <View style={[styles.pulseMiddle, { backgroundColor: 'rgba(48, 209, 88, 0.2)' }]}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' }} 
              style={[styles.searchingAvatar, { borderColor: Colors.success }]} 
              contentFit="cover"
            />
          </View>
        </View>
      </View>
      <Text style={styles.searchingText}>Pulse Detected!</Text>
      <Text style={styles.subtitle}>Connecting you now...</Text>
    </View>
  );

  const renderDecisionState = () => (
    <View style={styles.centerContent}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' }} 
        style={styles.decisionAvatar} 
        contentFit="cover"
      />
      <Text style={styles.decisionTitle}>How was your chat with Sarah?</Text>
      
      <View style={styles.decisionActions}>
        <Pressable style={styles.decisionBtn} onPress={() => handleDecision('keep')}>
          <View style={[styles.decisionIconCircle, { backgroundColor: 'rgba(255, 45, 45, 0.15)' }]}>
            <Heart size={32} color={Colors.pulseRed} fill={Colors.pulseRed} />
          </View>
          <Text style={styles.decisionLabel}>Keep</Text>
        </Pressable>

        <Pressable style={styles.decisionBtn} onPress={() => handleDecision('skip')}>
          <View style={[styles.decisionIconCircle, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
            <X size={32} color={Colors.textSecondary} />
          </View>
          <Text style={styles.decisionLabel}>Pass</Text>
        </Pressable>

        <Pressable style={styles.decisionBtn} onPress={() => handleDecision('report')}>
          <View style={[styles.decisionIconCircle, { backgroundColor: 'rgba(255, 45, 45, 0.15)' }]}>
            <AlertTriangle size={32} color={Colors.pulseRed} />
          </View>
          <Text style={styles.decisionLabel}>Report</Text>
        </Pressable>
      </View>

      {limitsQuery.data && (
        <View style={styles.usageContainer}>
          <Text style={styles.usageText}>
            Live calls used today: {limitsQuery.data.dailyFreeLiveCallsUsed} / 5
          </Text>
          {limitsQuery.data.extraLiveCallsRemaining > 0 && (
             <Text style={styles.extraUsageText}>
               (+{limitsQuery.data.extraLiveCallsRemaining} extra calls)
             </Text>
          )}
        </View>
      )}

      <Pressable style={styles.nextMatchBtn} onPress={handleNextMatch}>
        <Text style={styles.nextMatchText}>Find Next Match</Text>
      </Pressable>
    </View>
  );

  const renderGateOverlay = () => {
    if (!showGate) return null;
    
    return (
      <View style={styles.gateOverlay}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        <Animated.View 
          style={[
            styles.gateSlideContainer, 
            { transform: [{ translateY: gateSlideAnim }] }
          ]}
        >
          <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.95)']}
              style={styles.gateGradient}
          >
            <View style={styles.gateContent}>
              <View style={styles.gateTimerContainer}>
                  <View style={styles.timerCircle}>
                    <Text style={styles.gateTimerText}>{decisionTimer}</Text>
                  </View>
                  <Text style={styles.gateTitle}>Is this a match?</Text>
              </View>
              
              <Text style={styles.gateSubtitle}>
                If you both say yes, you&apos;ll keep talking and become a match.
              </Text>
              
              {waitingForPartner ? (
                  <View style={styles.waitingContainer}>
                    <ActivityIndicator color={Colors.pulseRed} size="large" />
                    <Text style={styles.waitingText}>Waiting for them...</Text>
                  </View>
              ) : (
                  <View style={styles.gateActions}>
                      <Pressable style={styles.gateSkipBtn} onPress={() => handleGateDecision('skip')}>
                        <Text style={styles.gateSkipText}>Skip</Text>
                      </Pressable>
                      <Pressable style={styles.gateKeepBtn} onPress={() => handleGateDecision('yes')}>
                        <LinearGradient
                          colors={[Colors.pulseRed, Colors.accentRed]}
                          style={styles.gateKeepGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        >
                          <Heart size={20} color="#FFF" fill="#FFF" />
                          <Text style={styles.gateKeepText}>Yes, keep talking</Text>
                        </LinearGradient>
                      </Pressable>
                  </View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    );
  };

  const renderToast = () => {
    if (!toastMessage) return null;
    return (
      <Animated.View style={[styles.toastContainer, { top: insets.top + 60 }]}>
        <BlurView intensity={80} tint="dark" style={styles.toastBlur}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </BlurView>
      </Animated.View>
    );
  };

  const renderDatingLive = () => (
    <View style={styles.fullScreen}>
      {/* Remote Video (Mock) */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&fit=crop' }} 
        style={styles.fullScreenImage}
        contentFit="cover"
      />
      
      {/* Local Video (Mock) */}
      <View style={[styles.localVideoContainer, { top: insets.top + 10 }]}>
         <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' }} 
            style={styles.localVideo}
            contentFit="cover"
          />
      </View>

      {/* Overlay UI - Only show if Gate is NOT showing */}
      {!showGate && (
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent', 'rgba(0,0,0,0.8)']}
        style={styles.videoOverlay}
      >
        <View style={[styles.topControls, { paddingTop: insets.top }]}>
           <View style={styles.matchInfo}>
             <Text style={styles.matchName}>Sarah, 23</Text>
             <View style={styles.liveTag}>
               <View style={styles.recordingDot} />
               <Text style={styles.liveTagText}>LIVE</Text>
             </View>
           </View>
           <Pressable style={styles.reportBtn}>
             <Flag size={20} color={Colors.softWhite} />
           </Pressable>
        </View>

        <View style={styles.bottomControls}>
          <View style={styles.controlRow}>
            <Pressable style={styles.controlBtn} onPress={() => setMicOn(!micOn)}>
              {micOn ? <Mic size={24} color={Colors.softWhite} /> : <MicOff size={24} color={Colors.pulseRed} />}
            </Pressable>
            <Pressable style={styles.controlBtn} onPress={() => setCameraOn(!cameraOn)}>
              {cameraOn ? <VideoIcon size={24} color={Colors.softWhite} /> : <VideoOff size={24} color={Colors.pulseRed} />}
            </Pressable>
            <Pressable style={[styles.controlBtn, styles.endCallBtn]} onPress={handleEndCall}>
              <PhoneOff size={28} color={Colors.softWhite} fill={Colors.softWhite} />
            </Pressable>
            <Pressable style={[styles.controlBtn, styles.nextBtn]} onPress={handleNextMatch}>
              <SkipForward size={24} color={Colors.voidBlack} fill={Colors.voidBlack} />
            </Pressable>
          </View>
        </View>
      </LinearGradient>
      )}
      
      {renderGateOverlay()}
    </View>
  );

  const renderGroupsLive = () => (
    <View style={styles.fullScreen}>
      {/* Grid View (Mock - 2x2) */}
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
           <Image source={{ uri: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&fit=crop' }} style={styles.gridImage} contentFit="cover" />
           <Text style={styles.gridName}>You</Text>
        </View>
        <View style={styles.gridItem}>
           <Image source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&fit=crop' }} style={styles.gridImage} contentFit="cover" />
           <Text style={styles.gridName}>Jessica</Text>
        </View>
        <View style={styles.gridItem}>
           <Image source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop' }} style={styles.gridImage} contentFit="cover" />
           <Text style={styles.gridName}>David</Text>
        </View>
        <View style={styles.gridItem}>
           <Image source={{ uri: 'https://images.unsplash.com/photo-1621784563330-caee0b138a00?w=400&fit=crop' }} style={styles.gridImage} contentFit="cover" />
           <Text style={styles.gridName}>Emily</Text>
        </View>
      </View>

      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
        style={styles.videoOverlay}
      >
        <View style={[styles.topControls, { paddingTop: insets.top }]}>
           <Text style={styles.roomTitle}>Late Night Talks 🌙</Text>
           <View style={styles.viewerCount}>
             <Users size={16} color={Colors.softWhite} />
             <Text style={styles.viewerCountText}>124</Text>
           </View>
        </View>

        <View style={styles.bottomControls}>
          <Pressable style={styles.leaveRoomBtn} onPress={handleEndCall}>
             <Text style={styles.leaveRoomText}>Leave Room</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );

  const renderFriendsLive = () => (
    <View style={styles.fullScreen}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800&fit=crop' }} 
        style={styles.fullScreenImage}
        contentFit="cover"
      />
       <View style={[styles.localVideoContainer, { top: insets.top + 10 }]}>
         <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' }} 
            style={styles.localVideo}
            contentFit="cover"
          />
      </View>

       <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.8)']}
        style={styles.videoOverlay}
      >
        <View style={[styles.topControls, { paddingTop: insets.top }]}>
           <View>
             <Text style={styles.matchName}>Alex</Text>
             <Text style={styles.friendStatus}>In a call</Text>
           </View>
        </View>

        <View style={styles.bottomControls}>
           <View style={styles.controlRow}>
            <Pressable style={styles.controlBtn} onPress={() => setMicOn(!micOn)}>
              {micOn ? <Mic size={24} color={Colors.softWhite} /> : <MicOff size={24} color={Colors.pulseRed} />}
            </Pressable>
            <Pressable style={[styles.controlBtn, styles.endCallBtn]} onPress={handleEndCall}>
              <PhoneOff size={28} color={Colors.softWhite} fill={Colors.softWhite} />
            </Pressable>
            <Pressable style={styles.controlBtn}>
              <MessageSquare size={24} color={Colors.softWhite} />
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderConnectedState = () => {
    switch(mode) {
      case 'dating': return renderDatingLive();
      case 'groups': return renderGroupsLive();
      case 'friends': return renderFriendsLive();
      default: return renderDatingLive();
    }
  };

  return (
    <View style={styles.container}>
      {status === 'idle' && renderIdleState()}
      {status === 'searching' && renderSearchingState()}
      {status === 'match_found' && renderMatchFoundState()}
      {status === 'connected' && renderConnectedState()}
      {status === 'decision' && renderDecisionState()}
      {renderUpsellModal()}
      {renderToast()}

      {limitsQuery.data && status === 'idle' && (
        <View style={[styles.limitsIndicator, { top: insets.top + 120 }]}>
          <Text style={styles.limitsText}>
            {checkLimitQuery.data?.extraRemaining ? 
              `${checkLimitQuery.data.extraRemaining} extra calls left` :
              `${5 - (limitsQuery.data.dailyFreeLiveCallsUsed || 0)} / 5 free calls left`
            }
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  fullScreen: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#000',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  pulseContainer: {
    marginBottom: Spacing.xxxl,
  },
  pulseOuter: {
    width: 200,
    height: 200,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseMiddle: {
    width: 140,
    height: 140,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: 'rgba(255, 45, 45, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseInner: {
    width: 96,
    height: 96,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.pulseRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchingAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: Colors.pulseRed,
  },
  title: {
    ...Typography.h1,
    color: Colors.softWhite,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxxl,
    textAlign: 'center',
  },
  startButton: {
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.full,
    ...Layout.shadow.md,
  },
  startButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  startButtonText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    letterSpacing: 0.5,
  },
  searchingText: {
    ...Typography.h3,
    color: Colors.softWhite,
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  cancelButtonText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  
  // Video UI Styles
  localVideoContainer: {
    position: 'absolute',
    right: Spacing.lg,
    width: 100,
    height: 150,
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: '#000',
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  matchInfo: {
    gap: 4,
  },
  matchName: {
    ...Typography.h3,
    color: Colors.softWhite,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  recordingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.pulseRed,
  },
  liveTagText: {
    ...Typography.caption,
    color: Colors.softWhite,
    fontWeight: '700',
    fontSize: 10,
  },
  reportBtn: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  bottomControls: {
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  controlBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCallBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.pulseRed,
  },
  nextBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.softWhite,
  },
  
  // Group Styles
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
    height: '50%',
    borderWidth: 1,
    borderColor: '#000',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridName: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    color: Colors.softWhite,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
  roomTitle: {
    ...Typography.h3,
    color: Colors.softWhite,
  },
  viewerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginTop: 8,
  },
  viewerCountText: {
    color: Colors.softWhite,
    fontWeight: '600',
    fontSize: 12,
  },
  leaveRoomBtn: {
    backgroundColor: 'rgba(255, 45, 45, 0.9)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  leaveRoomText: {
    color: Colors.softWhite,
    fontWeight: '600',
  },
  friendStatus: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.8)',
  },
  modeSelectorContainer: {
    position: 'absolute',
    top: 60,
    alignItems: 'center',
    zIndex: 10,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.full,
    padding: 4,
  },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Layout.borderRadius.full,
    gap: 6,
  },
  modeBtnActive: {
    backgroundColor: Colors.darkSecondary,
  },
  modeText: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
  },
  modeTextActive: {
    color: Colors.softWhite,
  },
  decisionAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: Spacing.xl,
    borderWidth: 3,
    borderColor: Colors.border,
  },
  decisionTitle: {
    ...Typography.h2,
    color: Colors.softWhite,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  decisionActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginBottom: 40,
  },
  decisionBtn: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  decisionIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decisionLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  usageContainer: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  usageText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  extraUsageText: {
    ...Typography.caption,
    color: Colors.pulseRed,
    marginTop: 4,
  },
  nextMatchBtn: {
    backgroundColor: Colors.pulseRed,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: Layout.borderRadius.full,
    ...Layout.shadow.md,
  },
  nextMatchText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#121212',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
    paddingTop: 32,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 1,
    borderColor: '#333',
    borderBottomWidth: 0,
  },
  modalGradient: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  premiumBadge: {
    marginBottom: Spacing.lg,
    borderRadius: 100,
    overflow: 'hidden',
    ...Layout.shadow.sm,
  },
  premiumBadgeGradient: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  premiumBadgeText: {
    ...Typography.captionBold,
    color: '#FFF',
    fontSize: 11,
    letterSpacing: 1,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    ...Typography.h2,
    fontSize: 28,
    color: Colors.softWhite,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '80%',
  },
  offerCard: {
    width: '100%',
    height: 80,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 45, 0.3)',
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  offerBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  offerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  offerLeft: {
    flex: 1,
  },
  offerBigText: {
    ...Typography.h3,
    color: Colors.softWhite,
    marginBottom: 2,
  },
  offerSmallText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  offerPriceContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.softWhite,
    borderRadius: 12,
  },
  offerPrice: {
    ...Typography.h3,
    color: Colors.voidBlack,
    fontWeight: '800',
  },
  benefitsList: {
    width: '100%',
    gap: 12,
    marginBottom: Spacing.xl + 10,
    paddingHorizontal: Spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(48, 209, 88, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 15,
  },
  modalPrimaryBtn: {
    width: '100%',
    borderRadius: 20,
    marginBottom: Spacing.md,
    ...Layout.shadow.md,
    overflow: 'hidden',
  },
  buttonGradient: {
    width: '100%',
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalPrimaryBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  modalPrimaryBtnDisabled: {
    opacity: 0.6,
  },
  modalPrimaryBtnText: {
    ...Typography.bodyBold,
    fontSize: 17,
    color: Colors.softWhite,
  },
  modalSecondaryBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  modalSecondaryBtnText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  limitsIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Layout.borderRadius.full,
  },
  limitsText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  
  // Gate Styles
  gateOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 20,
  },
  gateSlideContainer: {
    width: '100%',
    height: 400,
    justifyContent: 'flex-end',
  },
  gateGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  gateContent: {
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    paddingBottom: 20,
  },
  gateTimerContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  timerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: Colors.pulseRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  gateTimerText: {
    ...Typography.h3,
    color: Colors.pulseRed,
    fontWeight: '700',
  },
  gateTitle: {
    ...Typography.h1,
    color: Colors.softWhite,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  gateSubtitle: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: Spacing.xl,
    maxWidth: '80%',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  gateActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    width: '100%',
  },
  gateSkipBtn: {
    flex: 1,
    paddingVertical: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
  },
  gateSkipText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  gateKeepBtn: {
    flex: 2,
    borderRadius: Layout.borderRadius.full,
    ...Layout.shadow.md,
    overflow: 'hidden',
  },
  gateKeepGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  gateKeepText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    fontSize: 17,
  },
  waitingContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  waitingText: {
    ...Typography.body,
    color: Colors.softWhite,
  },
  
  // Toast
  toastContainer: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    alignItems: 'center',
    zIndex: 100,
  },
  toastBlur: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(20,20,20,0.8)',
  },
  toastText: {
    ...Typography.body,
    color: Colors.softWhite,
    textAlign: 'center',
  },
});
