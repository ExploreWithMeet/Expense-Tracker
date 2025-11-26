import { exportAndShareCSV } from "@/utils/csv";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function ExportScreen() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const doExport = async () => {
      try {
        await exportAndShareCSV();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setTimeout(() => router.back(), 1000);
      }
    };

    doExport();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#6C47FF" />
          <Text style={styles.text}>Preparing your CSV...</Text>
        </>
      ) : (
        <Text style={styles.text}>Done!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    marginTop: 16,
    fontSize: 16,
  },
});
