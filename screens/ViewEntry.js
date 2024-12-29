import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ViewEntry = ({ route, navigation }) => {
  const { id, title, text, timestamp } = route.params;

  // Function to delete the current entry
  const deleteEntry = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem("journalEntries");
      const entries = storedEntries ? JSON.parse(storedEntries) : [];
      const updatedEntries = entries.filter((entry) => entry.id !== id);

      await AsyncStorage.setItem(
        "journalEntries",
        JSON.stringify(updatedEntries)
      );
      Alert.alert("Entry Deleted", "The entry has been successfully deleted.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Failed to delete the entry:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{title}</Text>
      {/* Date and Time */}
      <Text style={styles.timestamp}>{timestamp}</Text>

      {/* Main Text */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.text}>{text}</Text>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Button title="Dummy Button" onPress={() => {}} />
        <Button title="Delete" onPress={deleteEntry} color="#ff6347" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginTop: 50,
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
    marginBottom: 20, // Space above the buttons
  },
  scrollContent: {
    paddingBottom: 20, // Prevent content from overlapping with buttons
  },
  text: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginBottom: 30,
  },
  buttonRow: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ViewEntry;
