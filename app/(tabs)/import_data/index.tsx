import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import Papa from "papaparse";
import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  date: string;
  priority: string;
  author: string;
};

export default function ImportScreen() {
  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const fileUri = result.assets?.[0]?.uri;
      if (!fileUri) return Alert.alert("No file selected.");

      const csvContent = await FileSystem.readAsStringAsync(fileUri);

      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: async ({ data }: { data: ExpenseItem[] }) => {
          try {
            const existing = await AsyncStorage.getItem("expenses");
            const existingItems: ExpenseItem[] = existing
              ? JSON.parse(existing)
              : [];

            // Find the current max ID (as a number)
            const maxId = existingItems.length
              ? Math.max(
                  ...existingItems
                    .map((e) => parseInt(e.id, 10))
                    .filter((n) => !isNaN(n))
                )
              : 0;

            // Assign new incremental IDs to imported items
            let nextId = maxId + 1;
            const newItems = data
              .map((item) => ({
                ...item,
                id: String(nextId++),
                amount: Number(item.amount),
              }))
              .filter(
                (item) =>
                  item.id &&
                  item.title &&
                  !isNaN(item.amount) &&
                  item.date &&
                  item.priority &&
                  item.author
              );

            // Add to existing items
            const allItems = [...existingItems, ...newItems];

            await AsyncStorage.setItem("expenses", JSON.stringify(allItems));
            Alert.alert(`Imported ${newItems.length} items successfully.`);
          } catch (e) {
            console.error("Saving error:", e);
            Alert.alert("Failed to save imported data.");
          }
        },
        error: (error: Error) => {
          console.error("CSV parsing error:", error);
          Alert.alert("Failed to parse CSV.");
        },
      });
    } catch (err) {
      console.error("Import error:", err);
      Alert.alert("Something went wrong during import.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          <Ionicons
            name="arrow-back-circle"
            size={28}
            color="white"
            onPress={() => router.push("/(tabs)")}
          />
          Import Data
        </Text>
      </View>
      <Text>Import CSV Data</Text>
      <Button title="Select CSV File" onPress={handleImport} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 50,
    backgroundColor: "#0D0D0D",
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    display: "flex",
    gap: 10,
  },
});
