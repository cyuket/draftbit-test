import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { Location } from "../types/location";
import { CATEGORY_COLORS } from "@/constants/theme";

interface MapPinProps {
  location: Location;
  onPress: (id: string) => void;
  onDragEnd?: (e: any) => void;
}

// Returns the accent colour for a category, falling back to the default indigo if unknown.
function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category.toLowerCase()] ?? CATEGORY_COLORS.default;
}

// Custom map marker that renders a coloured circle (initial letter) with a triangular tail,
// colour-coded by category. Calls onPress with the location id when tapped.
export default function MapPin({ location, onPress, onDragEnd }: MapPinProps) {
  const color = getCategoryColor(location.category);

  return (
    <Marker
      coordinate={{ latitude: location.lat, longitude: location.lng }}
      title={location.name}
      description={location.category}
      onPress={() => onPress(location.id)}
      onDragEnd={onDragEnd}
    >
      {/* Circle head of the pin showing the location's initial letter */}
      <View style={[styles.pinContainer, { backgroundColor: color }]}>
        <Text style={styles.pinText}>
          {location.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      {/* CSS-border-trick triangle that forms the pointed tail of the pin */}
      <View style={[styles.pinTail, { borderTopColor: color }]} />
    </Marker>
  );
}

const styles = StyleSheet.create({
  pinContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  pinText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    alignSelf: "center",
    marginTop: -1,
  },
});
