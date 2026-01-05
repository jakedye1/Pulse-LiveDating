import { StyleSheet, View, Text, ScrollView, Switch, Pressable, ActivityIndicator } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Stack, router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Slider from "@react-native-community/slider";

import Colors from "@/constants/colors";
import Typography from "@/constants/typography";
import Spacing from "@/constants/spacing";
import Layout from "@/constants/layout";
import { trpc } from "@/lib/trpc";

import { GENDER_OPTIONS, RELIGION_OPTIONS } from "@/constants/options";

export default function DatingPreferencesScreen() {
  const utils = trpc.useUtils();
  const [isSaving, setIsSaving] = useState(false);
  
  // Local state for form
  const [interestedIn, setInterestedIn] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState({ min: 18, max: 99 });
  const [distance, setDistance] = useState(25);
  const [appearInDating, setAppearInDating] = useState(true);
  const [showWithPhotosOnly, setShowWithPhotosOnly] = useState(true);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [religionFilterEnabled, setReligionFilterEnabled] = useState(false);
  const [religionPreferences, setReligionPreferences] = useState<string[]>([]);

  // Fetch preferences
  const { data: preferences, isLoading } = trpc.preferences.get.useQuery();

  useEffect(() => {
    if (preferences) {
      setInterestedIn(preferences.interestedIn);
      setAgeRange(preferences.ageRange);
      setDistance(preferences.distance);
      setAppearInDating(preferences.appearInDating);
      setShowWithPhotosOnly(preferences.showWithPhotosOnly);
      setShowVerifiedOnly(preferences.showVerifiedOnly);
      setReligionFilterEnabled(preferences.religionFilterEnabled ?? false);
      setReligionPreferences(preferences.religionPreferences ?? []);
    }
  }, [preferences]);

  const updateMutation = trpc.preferences.update.useMutation({
    onMutate: () => {
      setIsSaving(true);
    },
    onSuccess: () => {
      utils.preferences.get.invalidate();
      setTimeout(() => setIsSaving(false), 500); // Show "Saving..." for at least 500ms
    },
    onError: () => {
      setIsSaving(false);
      // Revert would go here in a complex app, or show error toast
      alert("Failed to save preferences");
    }
  });

  // Debounced save
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveData = (newData: any) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      updateMutation.mutate(newData);
    }, 800);
  };

  const handleGenderToggle = (gender: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let newInterestedIn = [...interestedIn];
    
    if (gender === "Everyone") {
      newInterestedIn = ["Everyone"];
    } else {
      if (interestedIn.includes("Everyone")) {
        newInterestedIn = [gender];
      } else {
        if (newInterestedIn.includes(gender)) {
          newInterestedIn = newInterestedIn.filter(g => g !== gender);
        } else {
          newInterestedIn.push(gender);
        }
      }
    }
    
    // Determine logic for "Everyone" vs specific
    if (newInterestedIn.length === 0) newInterestedIn = ["Everyone"]; // Default fallback
    
    setInterestedIn(newInterestedIn);
    saveData({
      interestedIn: newInterestedIn,
      ageRange,
      distance,
      appearInDating,
      showWithPhotosOnly,
      showVerifiedOnly,
      religionFilterEnabled,
      religionPreferences
    });
  };

  const handleSliderChange = (field: 'minAge' | 'maxAge' | 'distance', value: number) => {
    let newAgeRange = { ...ageRange };
    let newDistance = distance;

    if (field === 'minAge') {
      newAgeRange.min = value;
      if (newAgeRange.min > newAgeRange.max) newAgeRange.max = value;
    } else if (field === 'maxAge') {
      newAgeRange.max = value;
      if (newAgeRange.max < newAgeRange.min) newAgeRange.min = value;
    } else if (field === 'distance') {
      newDistance = value;
    }

    if (field === 'distance') {
      setDistance(newDistance);
    } else {
      setAgeRange(newAgeRange);
    }

    saveData({
      interestedIn,
      ageRange: newAgeRange,
      distance: newDistance,
      appearInDating,
      showWithPhotosOnly,
      showVerifiedOnly,
      religionFilterEnabled,
      religionPreferences
    });
  };

  const handleToggle = (field: 'appearInDating' | 'showWithPhotosOnly' | 'showVerifiedOnly' | 'religionFilterEnabled', value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    let newState = {
      interestedIn,
      ageRange,
      distance,
      appearInDating,
      showWithPhotosOnly,
      showVerifiedOnly,
      religionFilterEnabled,
      religionPreferences
    };

    if (field === 'appearInDating') {
      setAppearInDating(value);
      newState.appearInDating = value;
    } else if (field === 'showWithPhotosOnly') {
      setShowWithPhotosOnly(value);
      newState.showWithPhotosOnly = value;
    } else if (field === 'showVerifiedOnly') {
      setShowVerifiedOnly(value);
      newState.showVerifiedOnly = value;
    } else if (field === 'religionFilterEnabled') {
      setReligionFilterEnabled(value);
      newState.religionFilterEnabled = value;
    }

    saveData(newState);
  };

  const handleReligionToggle = (religion: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let newPreferences = [...religionPreferences];
    
    if (newPreferences.includes(religion)) {
      newPreferences = newPreferences.filter(r => r !== religion);
    } else {
      newPreferences.push(religion);
    }
    
    setReligionPreferences(newPreferences);
    saveData({
      interestedIn,
      ageRange,
      distance,
      appearInDating,
      showWithPhotosOnly,
      showVerifiedOnly,
      religionFilterEnabled,
      religionPreferences: newPreferences
    });
  };

  if (isLoading && !preferences) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.pulseRed} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: "Dating Preferences",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
              <ChevronLeft color={Colors.softWhite} size={28} />
            </Pressable>
          ),
          headerStyle: { backgroundColor: Colors.voidBlack },
          headerTintColor: Colors.softWhite,
          headerRight: () => (
             isSaving ? (
              <View style={styles.savingBadge}>
                 <ActivityIndicator size="small" color={Colors.textSecondary} />
                 <Text style={styles.savingText}>Saving...</Text>
              </View>
            ) : null
          )
        }} 
      />
      
      <ScrollView style={styles.content}>
        
        {/* Interested In */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interested In</Text>
          <View style={styles.chipContainer}>
            {GENDER_OPTIONS.map((gender) => {
              const isSelected = interestedIn.includes(gender);
              return (
                <Pressable
                  key={gender}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => handleGenderToggle(gender)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {gender}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Age Range */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Age Range</Text>
             <Text style={styles.sectionValue}>{ageRange.min} - {ageRange.max}</Text>
          </View>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Min Age: {ageRange.min}</Text>
            <Slider
              style={styles.slider}
              minimumValue={18}
              maximumValue={99}
              step={1}
              value={ageRange.min}
              onValueChange={(val) => handleSliderChange('minAge', val)}
              onSlidingComplete={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              minimumTrackTintColor={Colors.pulseRed}
              maximumTrackTintColor={Colors.darkTertiary}
              thumbTintColor={Colors.softWhite}
            />
          </View>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Max Age: {ageRange.max}</Text>
            <Slider
              style={styles.slider}
              minimumValue={18}
              maximumValue={99}
              step={1}
              value={ageRange.max}
              onValueChange={(val) => handleSliderChange('maxAge', val)}
              onSlidingComplete={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              minimumTrackTintColor={Colors.pulseRed}
              maximumTrackTintColor={Colors.darkTertiary}
              thumbTintColor={Colors.softWhite}
            />
          </View>
        </View>

        {/* Distance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Maximum Distance</Text>
             <Text style={styles.sectionValue}>{distance} miles</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={100}
            step={1}
            value={distance}
            onValueChange={(val) => handleSliderChange('distance', val)}
            onSlidingComplete={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            minimumTrackTintColor={Colors.pulseRed}
            maximumTrackTintColor={Colors.darkTertiary}
            thumbTintColor={Colors.softWhite}
          />
        </View>

        {/* Discovery Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discovery Settings</Text>
          
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Appear in Dating</Text>
              <Text style={styles.toggleDescription}>Show my profile to other people</Text>
            </View>
            <Switch
              value={appearInDating}
              onValueChange={(val) => handleToggle('appearInDating', val)}
              trackColor={{ false: Colors.darkTertiary, true: Colors.pulseRed }}
              thumbColor={Colors.softWhite}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Photos Only</Text>
              <Text style={styles.toggleDescription}>Only show people with photos</Text>
            </View>
            <Switch
              value={showWithPhotosOnly}
              onValueChange={(val) => handleToggle('showWithPhotosOnly', val)}
              trackColor={{ false: Colors.darkTertiary, true: Colors.pulseRed }}
              thumbColor={Colors.softWhite}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Verified Only</Text>
              <Text style={styles.toggleDescription}>Only show verified profiles</Text>
            </View>
            <Switch
              value={showVerifiedOnly}
              onValueChange={(val) => handleToggle('showVerifiedOnly', val)}
              trackColor={{ false: Colors.darkTertiary, true: Colors.pulseRed }}
              thumbColor={Colors.softWhite}
            />
          </View>
        </View>

        {/* Religion Preference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Religion Preference</Text>
          <Text style={styles.sectionSubtitle}>Choose what matters to you</Text>
          
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Filter by Religion</Text>
              <Text style={styles.toggleDescription}>Filter matches by religion if it’s important to you. This is optional.</Text>
            </View>
            <Switch
              value={religionFilterEnabled}
              onValueChange={(val) => handleToggle('religionFilterEnabled', val)}
              trackColor={{ false: Colors.darkTertiary, true: Colors.pulseRed }}
              thumbColor={Colors.softWhite}
            />
          </View>

          {religionFilterEnabled && (
            <View>
              <Text style={[styles.toggleDescription, { marginBottom: Spacing.sm }]}>
                Only show me people who match my selected religions
              </Text>
              <View style={[styles.chipContainer]}>
                {RELIGION_OPTIONS.map((religion) => {
                  const isSelected = religionPreferences.includes(religion);
                  return (
                    <Pressable
                      key={religion}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => handleReligionToggle(religion)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {religion}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your preferences help us find the best matches for you. 
            Changing these settings will update your discovery feed immediately.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.voidBlack,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  savingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  savingText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  section: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionSubtitle: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginBottom: Spacing.md,
  },
  sectionValue: {
    ...Typography.h3,
    color: Colors.softWhite,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.darkTertiary,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
    borderColor: Colors.pulseRed,
  },
  chipText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.pulseRed,
    fontWeight: 'bold',
  },
  sliderContainer: {
    marginBottom: Spacing.md,
  },
  sliderLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  toggleInfo: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  toggleLabel: {
    ...Typography.body,
    color: Colors.softWhite,
    marginBottom: 2,
  },
  toggleDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  footer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
