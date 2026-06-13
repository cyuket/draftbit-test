import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Location } from '../types/location';
import { useTheme } from '../hooks/useTheme';

interface LocationCardProps {
  location: Location;
  onPress?: () => void;
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

export default function LocationCard({ location, onPress }: LocationCardProps) {
  const { theme } = useTheme();
  const badgeColor = getCategoryColor(location.category);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.cardBg }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={{ uri: location.imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {location.name}
          </Text>
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{location.category}</Text>
          </View>
        </View>
        <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
          {location.description}
        </Text>
        <Text style={[styles.address, { color: theme.textMuted }]} numberOfLines={1}>
          📍 {location.address}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  address: {
    fontSize: 12,
  },
});
