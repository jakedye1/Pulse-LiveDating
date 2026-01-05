import { StyleSheet, View, Text, Pressable, Alert, Platform, Dimensions, ActionSheetIOS } from 'react-native';
import { Plus, Star, MoreHorizontal } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import Spacing from '@/constants/spacing';
import Layout from '@/constants/layout';

const { width } = Dimensions.get('window');

const GRID_GAP = 12;
const GRID_COLUMNS = 3; 

interface PhotoManagerProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  isLoading?: boolean;
  containerPadding?: number;
}

export default function PhotoManager({ 
  photos, 
  onPhotosChange, 
  maxPhotos = 6,
  isLoading = false,
  containerPadding = Spacing.xl
}: PhotoManagerProps) {

  // Dynamic layout calculations based on padding
  const heroWidth = width - (containerPadding * 2);
  const heroHeight = heroWidth * 1.1;
  const itemWidth = (width - (containerPadding * 2) - (GRID_GAP * (GRID_COLUMNS - 1))) / GRID_COLUMNS;

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to add photos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async (indexToReplace?: number) => {
    if (isLoading) return;
    
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newUri = result.assets[0].uri;
        
        // If replacing
        if (typeof indexToReplace === 'number') {
          const newPhotos = [...photos];
          newPhotos[indexToReplace] = newUri;
          onPhotosChange(newPhotos);
        } else {
          // Adding new
          if (photos.length < maxPhotos) {
            onPhotosChange([...photos, newUri]);
          }
        }
      }
    } catch (error) {
      console.error('[PhotoManager] Error picking image:', error);
    }
  };

  const handlePhotoTap = (index: number) => {
    if (isLoading) return;
    
    const isMain = index === 0;
    
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', isMain ? null : 'Set as Main Photo', 'Replace Photo', 'Remove Photo'].filter(Boolean) as string[],
          destructiveButtonIndex: isMain ? 2 : 3,
          cancelButtonIndex: 0,
          title: isMain ? 'Main Photo' : 'Manage Photo',
        },
        (buttonIndex) => {
          // Adjust index based on whether "Set as Main Photo" is present
          const offset = isMain ? 1 : 0;
          
          if (buttonIndex === 0) return; // Cancel
          
          if (!isMain && buttonIndex === 1) {
            // Set as Main
            setAsMain(index);
          } else if (buttonIndex === 1 + offset) {
            // Replace
            pickImage(index);
          } else if (buttonIndex === 2 + offset) {
            // Remove
            removePhoto(index);
          }
        }
      );
    } else {
      // Android / Web fallback
      Alert.alert(
        isMain ? 'Main Photo' : 'Manage Photo',
        'Choose an action',
        [
          { text: 'Cancel', style: 'cancel' },
          !isMain ? { text: 'Set as Main', onPress: () => setAsMain(index) } : null,
          { text: 'Replace', onPress: () => pickImage(index) },
          { text: 'Remove', style: 'destructive', onPress: () => removePhoto(index) },
        ].filter(Boolean) as any
      );
    }
  };

  const setAsMain = (index: number) => {
    if (index === 0) return;
    const newPhotos = [...photos];
    const [photo] = newPhotos.splice(index, 1);
    newPhotos.unshift(photo);
    onPhotosChange(newPhotos);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const removePhoto = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    onPhotosChange(newPhotos);
  };

  const renderHeroSlot = () => {
    const hasPhoto = photos.length > 0;
    const photoUri = photos[0];

    return (
      <View style={styles.heroContainer}>
        <View style={styles.heroLabelRow}>
          <Text style={styles.sectionLabel}>Main Photo</Text>
          {hasPhoto && (
            <View style={styles.mainBadge}>
              <Star size={10} color={Colors.voidBlack} fill={Colors.voidBlack} />
              <Text style={styles.mainBadgeText}>Default</Text>
            </View>
          )}
        </View>
        
        <Pressable
          style={[
            styles.heroSlot, 
            !hasPhoto && styles.heroSlotEmpty,
            { width: heroWidth, height: heroHeight }
          ]}
          onPress={() => hasPhoto ? handlePhotoTap(0) : pickImage()}
          disabled={isLoading}
        >
          {hasPhoto ? (
            <>
              <Image source={{ uri: photoUri }} style={styles.heroImage} contentFit="cover" />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={styles.heroGradient}
              />
              <View style={styles.editButton}>
                <MoreHorizontal size={20} color={Colors.softWhite} />
              </View>
            </>
          ) : (
            <View style={styles.emptyHeroContent}>
              <View style={styles.heroPlusIcon}>
                <Plus size={32} color={Colors.pulseRed} strokeWidth={2.5} />
              </View>
              <Text style={styles.heroEmptyText}>Add Main Photo</Text>
            </View>
          )}
        </Pressable>
      </View>
    );
  };

  const renderSecondaryGrid = () => {
    // We want maxPhotos - 1 secondary slots
    const secondarySlots = Array.from({ length: maxPhotos - 1 }).map((_, i) => {
      const photoIndex = i + 1;
      const photoUri = photos[photoIndex];
      const isFilled = !!photoUri;

      return (
        <Pressable
          key={i}
          style={[
            styles.gridSlot, 
            !isFilled && styles.gridSlotEmpty, 
            { width: itemWidth }
          ]}
          onPress={() => isFilled ? handlePhotoTap(photoIndex) : pickImage()}
          disabled={isLoading}
        >
          {isFilled ? (
            <>
              <Image source={{ uri: photoUri }} style={styles.gridImage} contentFit="cover" />
              <View style={styles.miniEditButton}>
                 <MoreHorizontal size={14} color="#FFF" />
              </View>
            </>
          ) : (
            <Plus size={24} color={Colors.darkTertiary} />
          )}
        </Pressable>
      );
    });

    return (
      <View style={styles.gridContainer}>
        <Text style={styles.sectionLabel}>Additional Photos</Text>
        <View style={styles.grid}>
          {secondarySlots}
        </View>
      </View>
    );
  };

  return (
    <View>
      {renderHeroSlot()}
      {renderSecondaryGrid()}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    ...Typography.captionBold,
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroContainer: {
    marginBottom: Spacing.xl,
  },
  heroLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  mainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.pulseRed,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    gap: 4,
  },
  mainBadgeText: {
    ...Typography.captionBold,
    color: Colors.voidBlack,
    fontSize: 10,
  },
  heroSlot: {
    borderRadius: Layout.borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.signalGray,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heroSlotEmpty: {
    borderStyle: 'dashed',
    borderColor: Colors.darkTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  emptyHeroContent: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  heroPlusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 45, 45, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmptyText: {
    ...Typography.bodyBold,
    color: Colors.pulseRed,
  },
  editButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    marginBottom: Spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  gridSlot: {
    aspectRatio: 3/4,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.signalGray,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  gridSlotEmpty: {
    borderStyle: 'dashed',
    borderColor: Colors.darkTertiary,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  miniEditButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
