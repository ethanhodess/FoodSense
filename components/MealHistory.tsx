import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const MealHistory: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [mealType, setMealType] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxRating, setMaxRating] = useState<number | null>(null);
  const [showPicker, setShowPicker] = useState({
    mealType: false,
    minRating: false,
    maxRating: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsCollection = collection(db, "logs");
        const snapshot = await getDocs(logsCollection);

        if (snapshot.empty) {
          console.log("No documents found.");
        } else {
          const retrievedLogs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLogs(retrievedLogs);
        }
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError("Failed to fetch logs.");
      }
    };

    fetchLogs();
  }, []);

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-CA"); // This will format as YYYY-MM-DD
  };

  const handleSelect = (type: string, value: string | number | null) => {
    if (type === "mealType") setMealType(value as string | null);
    else if (type === "minRating") setMinRating(value as number | null);
    else if (type === "maxRating") setMaxRating(value as number | null);
    setShowPicker((prev) => ({ ...prev, [type]: false }));
  };

  const filteredLogs = logs.filter((log) => {
    const matchesMealType = mealType ? log.mealType === mealType : true;
    const matchesMinRating = minRating ? log.dayRating >= minRating : true;
    const matchesMaxRating = maxRating ? log.dayRating <= maxRating : true;
    return matchesMealType && matchesMinRating && matchesMaxRating;
  });

  const renderPickerModal = (type: string, options: Array<any>) => (
    <Modal visible={showPicker[type]} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <FlatList
            data={options}
            keyExtractor={(item) => (item.value ?? "null").toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSelect(type, item.value)}
              >
                <Text style={styles.modalOptionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowPicker((prev) => ({ ...prev, [type]: false }))}
          >
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Meal History</Text>

      {/* Meal Type Picker */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Meal Type:</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowPicker((prev) => ({ ...prev, mealType: true }))}
        >
          <Text>{mealType || "Select Meal Type"}</Text>
        </TouchableOpacity>
        {renderPickerModal("mealType", [
          { label: "All", value: null },
          { label: "Breakfast", value: "Breakfast" },
          { label: "Lunch", value: "Lunch" },
          { label: "Dinner", value: "Dinner" },
          { label: "Snack", value: "Snack" },
        ])}
      </View>

      {/* Min Rating Picker */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Min Rating:</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowPicker((prev) => ({ ...prev, minRating: true }))}
        >
          <Text>{minRating || "Select Min Rating"}</Text>
        </TouchableOpacity>
        {renderPickerModal(
          "minRating",
          [...Array(10)].map((_, i) => ({
            label: (i + 1).toString(),
            value: i + 1,
          }))
        )}
      </View>

      {/* Max Rating Picker */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Max Rating:</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowPicker((prev) => ({ ...prev, maxRating: true }))}
        >
          <Text>{maxRating || "Select Max Rating"}</Text>
        </TouchableOpacity>
        {renderPickerModal(
          "maxRating",
          [...Array(10)].map((_, i) => ({
            label: (i + 1).toString(),
            value: i + 1,
          }))
        )}
      </View>

      {/* Logs Section */}
      {filteredLogs.length > 0 ? (
        filteredLogs.map((log) => (
          <View key={log.id} style={styles.logCard}>
            <Text style={styles.logText}>Date: {formatDate(log.timestamp)}</Text>
            <Text style={styles.logText}>Meal Type: {log.mealType}</Text>
            <Text style={styles.logText}>Food: {log.food}</Text>
            <Text style={styles.logText}>Day Rating: {log.dayRating}</Text>
            <Text style={styles.logText}>Notes: {log.notes}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.infoText}>No logs found with the current filters.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  dropdown: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  logCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  logText: {
    fontSize: 14,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalCloseButton: {
    padding: 12,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    marginTop: 16,
  },
  modalCloseButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  infoText: {
    color: "#555",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

export default MealHistory;