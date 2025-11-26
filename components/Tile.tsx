import { Text } from "@react-navigation/elements";
import { ExternalPathString, RelativePathString, router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

interface Iitem {
  title: string;
  route: RelativePathString | ExternalPathString;
}

export default function Tile({ item }: { item: Iitem }) {
  return (
    <TouchableOpacity
      style={styles.tile}
      onPress={() => router.navigate(item.route)}
    >
      <Text style={styles.tileText}>{item.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    minWidth: 100,
  },
  tileText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E0E0E0",
  },
});
