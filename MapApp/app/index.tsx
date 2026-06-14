import React, { useRef, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useLocations } from '../hooks/useLocations';
import { useTheme } from '../hooks/useTheme';
import MapPin from '../components/MapPin';
import { Location } from '../types/location';

// Derives a MapView region that fits all location pins with ~40% padding on each axis.
// The 0.02 floor prevents a region that's too tight when all pins are close together.
function computeRegion(locations: Location[]) {
  const lats = locations.map((l) => l.lat);
  const lngs = locations.map((l) => l.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return {
    // Centre of the bounding box
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    // 1.4× span adds padding around the outermost pins so they're not clipped
    latitudeDelta: (maxLat - minLat) * 1.4 + 0.02,
    longitudeDelta: (maxLng - minLng) * 1.4 + 0.02,
  };
}

// Screen 1: renders a full-screen map with colour-coded pins for every location.
// Tapping a pin navigates to the detail screen via Expo Router.
export default function MapScreen() {
  const router = useRouter();
  // mapRef lets us imperatively animate the camera after data loads.
  const mapRef = useRef<MapView>(null);
  const { data: locations, isLoading, isError, error } = useLocations();
  const { theme, isDark, toggleTheme } = useTheme();

  // Once locations arrive, smoothly animate the camera to a region that fits all pins.
  // Uses animateToRegion instead of setting initialRegion so the transition is visible.
  useEffect(() => {
    if (locations && locations.length > 0) {
      mapRef.current?.animateToRegion(computeRegion(locations), 500);
    }
  }, [locations]);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={[styles.loadingText, { color: theme.textMuted }]}>
          Loading locations…
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={[styles.errorTitle, { color: theme.text }]}>
          Could not load locations
        </Text>
        <Text style={[styles.errorMessage, { color: theme.textMuted }]}>
          {error?.message}
        </Text>
      </View>
    );
  }

  // Fallback region (Abuja, Nigeria) used only before data loads or if the list is empty.
  // The useEffect above will override this with the real bounding box once data arrives.
  const initialRegion =
    locations && locations.length > 0
      ? computeRegion(locations)
      : { latitude: 9.0579, longitude: 7.4951, latitudeDelta: 0.1, longitudeDelta: 0.1 };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        userInterfaceStyle={isDark ? 'dark' : 'light'}
      >
        {/* Each pin navigates to the detail route using Expo Router's push */}
        {locations?.map((location) => (
          <MapPin
            key={location.id}
            location={location}
            onPress={(id) => router.push(`/location/${id}`)}
          />
        ))}
      </MapView>
      <View
        style={[styles.countBadge, { backgroundColor: theme.countBadgeBg }]}
      >
        <Text style={[styles.countText, { color: theme.countBadgeText }]}>
          {locations?.length ?? 0} locations
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.themeToggle, { backgroundColor: theme.countBadgeBg }]}
        onPress={toggleTheme}
        activeOpacity={0.8}
      >
        <Text style={styles.themeToggleIcon}>{isDark ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
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
  countBadge: {
    position: 'absolute',
    top: 52,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
  },
  themeToggle: {
    position: 'absolute',
    top: 44,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  themeToggleIcon: {
    fontSize: 20,
  },
});
