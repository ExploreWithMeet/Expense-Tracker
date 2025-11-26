import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const CSV_FILE_PATH = FileSystem.cacheDirectory + "expenses.csv";

export const exportAndShareCSV = async () => {
  try {
    const data = await AsyncStorage.getItem("expenses");
    if (!data) return alert("No data to export!");

    const expenses = JSON.parse(data);
    const csvRows = [
      ["ID", "Title", "Amount", "Date", "Priority", "Author"],
      ...expenses.map((item: any) => [
        item.id,
        item.title,
        item.amount,
        item.date,
        item.priority,
        item.author,
      ]),
    ];

    const csvString = csvRows.map((row) => row.join(",")).join("\n");

    await FileSystem.writeAsStringAsync(CSV_FILE_PATH, csvString, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(CSV_FILE_PATH);

    // Delete the file after sharing
    await FileSystem.deleteAsync(CSV_FILE_PATH, { idempotent: true });
  } catch (err) {
    console.error("CSV Export Error:", err);
    alert("Failed to export data");
  }
};
