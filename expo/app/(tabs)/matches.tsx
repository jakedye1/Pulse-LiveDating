import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Heart, BadgeCheck } from "lucide-react-native";

import Colors from "@/constants/colors";
import Typography from "@/constants/typography";
import Spacing from "@/constants/spacing";
import Layout from "@/constants/layout";
import { useAuth } from "@/context/AuthContext";

interface Match {
  id: string;
  name: string;
  age: number;
  image: string;
  matchedAt: string;
  verification_status?: 'verified' | 'unverified' | null;
}

const MOCK_MATCHES: Match[] = [
  {
    id: '1',
    name: 'Emma',
    age: 24,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    matchedAt: '2 hours ago',
    verification_status: 'verified',
  },
  {
    id: '2',
    name: 'Sofia',
    age: 26,
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
    matchedAt: '1 day ago',
    verification_status: null,
  },
];

export default function MatchesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const matches = MOCK_MATCHES.filter(match => !user?.blocked_users?.includes(match.id));
  const hasMatches = matches.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>pulse</Text>
      </View>

      {hasMatches ? (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Your Matches</Text>
          <View style={styles.matchesGrid}>
            {matches.map((match) => (
              <Pressable 
                key={match.id} 
                style={styles.matchCard}
                onPress={() => router.push(`/users/${match.id}`)}
              >
                <Image source={{ uri: match.image }} style={styles.matchImage} contentFit="cover" />
                <View style={styles.matchInfo}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.matchName}>{match.name}, {match.age}</Text>
                    {match.verification_status === 'verified' && (
                       <BadgeCheck size={14} color={Colors.softWhite} fill={Colors.pulseRed} />
                    )}
                  </View>
                  <Text style={styles.matchTime}>{match.matchedAt}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Heart color={Colors.textTertiary} size={48} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptySubtitle}>
            Start swiping or connect on Live to find your first match
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
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  content: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.softWhite,
    marginBottom: Spacing.lg,
  },
  matchesGrid: {
    gap: Spacing.md,
  },
  matchCard: {
    backgroundColor: Colors.signalGray,
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  matchImage: {
    width: '100%',
    height: 200,
  },
  matchInfo: {
    padding: Spacing.md,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  matchName: {
    ...Typography.bodyBold,
    color: Colors.softWhite,
  },
  matchTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
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
