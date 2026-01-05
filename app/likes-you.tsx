import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Lock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

const MOCK_LIKES = Array.from({ length: 12 }, (_, i) => ({
  id: `like-${i}`,
  imageUrl: `https://images.unsplash.com/photo-${1494790108377 + i}?w=400&h=500&fit=crop`,
}));

export default function LikesYouScreen() {
  const router = useRouter();
  const isSubscribed = false;

  const handleUpgrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/paywall');
  };

  const handleCardPress = () => {
    if (isSubscribed) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      handleUpgrade();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Heart size={32} color={Colors.pulseRed} fill={Colors.pulseRed} />
          </View>
          <Text style={styles.title}>{MOCK_LIKES.length} people like you</Text>
          <Text style={styles.subtitle}>
            {isSubscribed 
              ? 'Match with them instantly'
              : 'Upgrade to see who likes you'}
          </Text>
        </View>

        <View style={styles.grid}>
          {MOCK_LIKES.map((like, index) => (
            <Pressable
              key={like.id}
              style={styles.card}
              onPress={handleCardPress}
            >
              <Image
                source={{ uri: like.imageUrl }}
                style={styles.cardImage}
                contentFit="cover"
              />
              {!isSubscribed && (
                <>
                  <BlurView intensity={80} style={styles.blur} />
                  <View style={styles.lockOverlay}>
                    <Lock size={24} color={Colors.softWhite} />
                  </View>
                </>
              )}
              {index === 0 && !isSubscribed && (
                <LinearGradient
                  colors={['transparent', 'rgba(255,45,45,0.9)']}
                  style={styles.gradient}
                >
                  <Text style={styles.matchText}>Match now</Text>
                </LinearGradient>
              )}
            </Pressable>
          ))}
        </View>

        {!isSubscribed && (
          <Pressable style={styles.upgradeBtn} onPress={handleUpgrade}>
            <Text style={styles.upgradeBtnText}>See Who Likes You</Text>
          </Pressable>
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
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  headerIcon: {
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
    color: Colors.softWhite,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  card: {
    width: '48%',
    aspectRatio: 3 / 4,
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    justifyContent: 'flex-end',
    padding: Spacing.sm,
  },
  matchText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
    textAlign: 'center',
  },
  upgradeBtn: {
    width: '100%',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.pulseRed,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
  },
  upgradeBtnText: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
});
