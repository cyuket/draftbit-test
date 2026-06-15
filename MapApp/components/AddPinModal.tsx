// components/AddPinModal.tsx
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { Location } from "../types/location";

interface Props {
  visible: boolean;
  lat: number;
  lng: number;
  onConfirm: (loc: Location) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  "Landmark",
  "Park",
  "Market",
  "Religious",
  "Shopping",
  "Sports",
  "Other",
];

export function AddPinModal({ visible, lat, lng, onConfirm, onCancel }: Props) {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Landmark");

  const handleConfirm = () => {
    if (!name.trim()) return;
    onConfirm({
      id: `user_${Date.now()}`,
      name: name.trim(),
      description: "User-submitted location",
      category,
      lat,
      lng,
      imageUrl: "https://via.placeholder.com/400x240?text=User+Pin",
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    });
    setName("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.title, { color: theme.text }]}>New Pin</Text>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Location name"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
          />
          {/* Category picker row */}
          <View style={styles.cats}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.catBtn,
                  category === cat && { backgroundColor: theme.background },
                ]}
              >
                <Text
                  style={{
                    color: category === cat ? "#FFF" : theme.textSecondary,
                    fontSize: 12,
                  }}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.row}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
              <Text style={{ color: theme.textSecondary }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              style={[styles.confirmBtn, { backgroundColor: theme.background }]}
            >
              <Text style={{ color: "#FFF", fontWeight: "600" }}>Add Pin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  cats: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  catBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  row: { flexDirection: "row", gap: 12 },
  cancelBtn: { flex: 1, padding: 14, alignItems: "center" },
  confirmBtn: { flex: 2, padding: 14, borderRadius: 8, alignItems: "center" },
});
