import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Location } from '../types/location';

interface MapPinProps {
  location: Location;
  onPress: (id: string) => void;
}

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

export default function MapPin({ location, onPress }: MapPinProps) {
  const color = getCategoryColor(location.category);

  return (
    <Marker
      coordinate={{ latitude: location.lat, longitude: location.lng }}
      title={location.name}
      description={location.category}
      onPress={() => onPress(location.id)}
    >
      <View style={[styles.pinContainer, { backgroundColor: color }]}>
        <Text style={styles.pinText}>{location.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={[styles.pinTail, { borderTopColor: color }]} />
    </Marker>
  );
}

const styles = StyleSheet.create({
  pinContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  pinText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
    marginTop: -1,
  },
});
