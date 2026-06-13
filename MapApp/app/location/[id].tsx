import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLocation } from '../../hooks/useLocations';
import { useTheme } from '../../hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORY_COLORS: Record<string, string> = {
  museum: '#8B5CF6',
  park: '#10B981',
  restaurant: '#F59E0B',
  landmark: '#3B82F6',
  market: '#EC4899',
  beach: '#06B6D4',
  default: '#6366F1',
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category.toLowerCase()] ?? CATEGORY_COLORS.default;
}

export default function LocationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: location, isLoading, isError, error } = useLocation(id);
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={[styles.loadingText, { color: theme.textMuted }]}>
          Loading location…
        </Text>
      </SafeAreaView>
    );
  }

  if (isError || !location) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: theme.background }]}>
        <TouchableOpacity style={styles.backButtonSmall} onPress={() => router.back()}>
          <Text style={{ fontSize: 16, color: '#6366F1', fontWeight: '600' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={[styles.errorTitle, { color: theme.text }]}>Location not found</Text>
        <Text style={[styles.errorMessage, { color: theme.textMuted }]}>
          {error?.message ?? 'Unknown error'}
        </Text>
      </SafeAreaView>
    );
  }

  const badgeColor = getCategoryColor(location.category);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: location.imageUrl }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <SafeAreaView style={styles.backOverlay}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.backButtonBg }]}
              onPress={() => router.back()}
            >
              <Text style={[styles.backArrow, { color: theme.backButtonText }]}>←</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.text }]}>{location.name}</Text>
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
              <Text style={styles.badgeText}>{location.category}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>📍</Text>
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {location.address}
            </Text>
          </View>

          <View style={styles.coordsRow}>
            <View style={[styles.coordChip, { backgroundColor: theme.coordChipBg }]}>
              <Text style={[styles.coordLabel, { color: theme.textMuted }]}>LAT</Text>
              <Text style={[styles.coordValue, { color: theme.coordValue }]}>
                {location.lat.toFixed(5)}
              </Text>
            </View>
            <View style={[styles.coordChip, { backgroundColor: theme.coordChipBg }]}>
              <Text style={[styles.coordLabel, { color: theme.textMuted }]}>LNG</Text>
              <Text style={[styles.coordValue, { color: theme.coordValue }]}>
                {location.lng.toFixed(5)}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>About</Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {location.description}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
  backButtonSmall: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  imageContainer: {
    position: 'relative',
    width: SCREEN_WIDTH,
    height: 300,
  },
  headerImage: {
    width: SCREEN_WIDTH,
    height: 300,
  },
  backOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backButton: {
    marginTop: 8,
    marginLeft: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  backArrow: {
    fontSize: 20,
    lineHeight: 22,
  },
  content: {
    padding: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    flex: 1,
    marginRight: 12,
    lineHeight: 30,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  metaIcon: {
    fontSize: 16,
    marginRight: 6,
    marginTop: 1,
  },
  metaText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  coordsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  coordChip: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  coordLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  coordValue: {
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  divider: {
    height: 1,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
  },
});
