import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

export default function OnboardingScreen() {
  const [name, setName] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const router = useRouter();

  const handleSave = async () => {
    if (name.trim()) {
      await AsyncStorage.setItem("username", name.trim());
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter your name"
        placeholderTextColor="#999"
        value={name}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={setName}
        style={[styles.input, isFocused && styles.inputFocused]}
      />
      <Button title="Continue" onPress={handleSave} color="#6200ee" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    color: "#fff",
    outlineWidth: 0,
  },
  inputFocused: {
    borderColor: "#6200ee",
  },
});
