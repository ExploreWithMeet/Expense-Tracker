import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  date: string;
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  author: string;
};

const PRIORITY_COLORS: Record<ExpenseItem["priority"], string> = {
  URGENT: "#FF4C4C",
  HIGH: "#FFA500",
  MEDIUM: "#FFD700",
  LOW: "#4CAF50",
};

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [form, setForm] = useState<{
    title?: string;
    amount?: string;
    priority?: ExpenseItem["priority"];
  }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [author, setAuthor] = useState("Me");
  const [loaded, setLoaded] = useState(false);
  const [sortOption, setSortOption] = useState<string>("none");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem("expenses", JSON.stringify(expenses));
    }
  }, [expenses]);

  const loadData = () => {
    AsyncStorage.getItem("username").then((data) => setAuthor(data || "Me"));
    AsyncStorage.getItem("expenses").then((data) => {
      try {
        const parsed = data ? JSON.parse(data) : [];
        setExpenses(Array.isArray(parsed) ? parsed : []);
      } catch {
        setExpenses([]);
      }
    });
    setLoaded(true);
  };

  // Generate next incremental string ID
  const getNextId = () => {
    if (expenses.length === 0) return "1";
    const maxId = Math.max(
      ...expenses.map((e) => parseInt(e.id, 10)).filter((n) => !isNaN(n))
    );
    return String(maxId + 1);
  };

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
    setDeleteModalVisible(false);
    setDeleteId(null);
  };

  const handleEdit = (item: ExpenseItem) => {
    setForm({
      title: item.title,
      amount: item.amount.toString(),
      priority: item.priority,
    });
    setEditingId(item.id);
    setModalVisible(true);
  };

  // Double tap detection
  let lastTap: number | null = null;
  const handleItemPress = (item: ExpenseItem) => {
    const now = Date.now();
    if (lastTap && now - lastTap < 300) {
      handleEdit(item); // Double tap: edit
      lastTap = null;
    } else {
      lastTap = now;
      setTimeout(() => {
        if (lastTap && Date.now() - lastTap >= 300) {
          lastTap = null;
        }
      }, 350);
    }
  };

  const handleItemLongPress = (item: ExpenseItem) => {
    setDeleteId(item.id);
    setDeleteModalVisible(true);
  };

  const handleSave = () => {
    if (
      !form.title ||
      !form.amount ||
      isNaN(Number(form.amount)) ||
      !form.priority
    ) {
      Alert.alert("Please fill all fields correctly.");
      return;
    }
    if (editingId) {
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: form.title!,
                amount: Number(form.amount),
                priority: form.priority!,
              }
            : item
        )
      );
    } else {
      const newItem: ExpenseItem = {
        id: getNextId(),
        title: form.title!,
        amount: Number(form.amount),
        date: new Date().toISOString().slice(0, 10),
        priority: form.priority!,
        author,
      };
      setExpenses((prev) => [newItem, ...prev]);
    }
    setForm({});
    setEditingId(null);
    setModalVisible(false);
  };

  const getSortedExpenses = () => {
    let sorted = [...expenses];
    switch (sortOption) {
      case "priority-urgent-low":
        sorted.sort(
          (a, b) =>
            ["URGENT", "HIGH", "MEDIUM", "LOW"].indexOf(a.priority) -
            ["URGENT", "HIGH", "MEDIUM", "LOW"].indexOf(b.priority)
        );
        break;
      case "priority-low-urgent":
        sorted.sort(
          (a, b) =>
            ["LOW", "MEDIUM", "HIGH", "URGENT"].indexOf(a.priority) -
            ["LOW", "MEDIUM", "HIGH", "URGENT"].indexOf(b.priority)
        );
        break;
      case "price-low-high":
        sorted.sort((a, b) => a.amount - b.amount);
        break;
      case "price-high-low":
        sorted.sort((a, b) => b.amount - a.amount);
        break;
      case "date-newest":
        sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "date-oldest":
        sorted.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      default:
        break;
    }
    return sorted;
  };

  // Defensive: filter out invalid items
  const validExpenses = getSortedExpenses().filter(
    (item) =>
      item &&
      typeof item.id === "string" &&
      item.title &&
      typeof item.amount === "number" &&
      item.date &&
      item.priority &&
      item.author
  );

  const total = validExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.expenseHeader}>
        <Text style={styles.expenseTitle}>
          <Ionicons
            name="arrow-back-circle"
            size={28}
            color="white"
            onPress={() => router.push("/(tabs)")}
          />{" "}
          Expenses
        </Text>
        <Picker
          selectedValue={sortOption}
          onValueChange={(val) => setSortOption(val)}
          style={styles.pickertop}
        >
          <Picker.Item label="" value="none" />
          <Picker.Item label="Priority: U → L" value="priority-urgent-low" />
          <Picker.Item label="Priority: L → U" value="priority-low-urgent" />
          <Picker.Item label="Price: Cheap" value="price-low-high" />
          <Picker.Item label="Price: Expensive" value="price-high-low" />
          <Picker.Item label="Date: Newest" value="date-newest" />
          <Picker.Item label="Date: Oldest" value="date-oldest" />
        </Picker>
      </View>

      <FlatList
        data={validExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleItemPress(item)}
            onLongPress={() => handleItemLongPress(item)}
            style={[
              styles.item,
              { borderLeftColor: PRIORITY_COLORS[item.priority] },
            ]}
          >
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>
                ₹{item.amount} • {item.date}
              </Text>
            </View>
            <Text style={styles.amount}>₹{item.amount}</Text>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={styles.totalBar}>
        <Text style={styles.totalText}>Total: ₹{total}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setForm({ priority: "LOW" });
          setModalVisible(true);
        }}
        style={styles.fab}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Edit/Add Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Title"
              placeholderTextColor="#888"
              style={styles.input}
              value={form.title ?? ""}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />
            <TextInput
              placeholder="Amount"
              placeholderTextColor="#888"
              style={styles.input}
              keyboardType="numeric"
              value={form.amount ?? ""}
              onChangeText={(text) =>
                setForm({ ...form, amount: text.replace(/[^0-9.]/g, "") })
              }
            />
            <Picker
              selectedValue={form.priority ?? "LOW"}
              onValueChange={(value) =>
                setForm({ ...form, priority: value as any })
              }
              style={styles.picker}
            >
              <Picker.Item label="URGENT" value="URGENT" />
              <Picker.Item label="HIGH" value="HIGH" />
              <Picker.Item label="MEDIUM" value="MEDIUM" />
              <Picker.Item label="LOW" value="LOW" />
            </Picker>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleSave} style={styles.modalBtn}>
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setForm({});
                  setEditingId(null);
                }}
                style={[styles.modalBtn, { backgroundColor: "#333" }]}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.title, { marginBottom: 20 }]}>
              Do you want to delete this?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => handleDelete(deleteId!)}
                style={[styles.modalBtn, { backgroundColor: "#FF4C4C" }]}
              >
                <Text style={styles.modalBtnText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setDeleteModalVisible(false);
                  setDeleteId(null);
                }}
                style={[styles.modalBtn, { backgroundColor: "#333" }]}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 20,
  },
  expenseTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  pickertop: {
    backgroundColor: "#1A1A1A",
    color: "#fff",
    width: 150,
    height: 40,
    borderWidth: 0,
  },
  item: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 17,
    marginBottom: 12,
    borderLeftWidth: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 4,
  },
  amount: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 50,
    backgroundColor: "#6C47FF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  totalBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#121212",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#222",
  },
  totalText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    transform: [{ translateY: -20 }],
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 12,
  },
  input: {
    backgroundColor: "#2C2C2C",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    color: "#fff",
  },
  picker: {
    backgroundColor: "#2C2C2C",
    color: "#fff",
    padding: 7,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    backgroundColor: "#6C47FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
