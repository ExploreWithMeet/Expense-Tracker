import Tile from "@/components/Tile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExternalPathString, RelativePathString } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface ITiles {
  title: string;
  route: ExternalPathString | RelativePathString;
}

const tiles: ITiles[] = [
  { title: "Expenses", route: "./expenses" },
  { title: "Share Data", route: "./share" },
  { title: "Import Data", route: "./import_data" },
];

export default function HomeScreen() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("username").then(setUsername);
  }, []);

  return (
    <View style={styles.container}>
      {username && <Text style={styles.welcomeText}>Hello, {username}</Text>}

      <FlatList
        data={tiles}
        keyExtractor={(item) => item.route}
        numColumns={2}
        contentContainerStyle={styles.tilesWrapper}
        columnWrapperStyle={{ gap: 16 }}
        renderItem={({ item }) => <Tile item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 50,
    backgroundColor: "#0D0D0D",
    overflow: "scroll",
  },
  welcomeText: {
    fontSize: 20,
    color: "#E0E0E0",
    fontWeight: "bold",
    textAlign: "center",
  },
  tilesWrapper: {
    flexGrow: 1,
    justifyContent: "center",
    gap: 15,
  },
});
