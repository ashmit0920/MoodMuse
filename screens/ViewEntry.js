import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ViewEntry = ({ route, navigation }) => {
  const { id, title, text, timestamp } = route.params;
  const [showMenu, setShowMenu] = useState(false);

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

  // Ask MoodAI button options
  const handleMenuOption = (option) => {
    setShowMenu(false);
    Alert.alert("Selected option", `You chose: ${option}`);
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
        <TouchableOpacity
          style={styles.askMoodAIButton}
          onPress={() => setShowMenu(!showMenu)}
        >
          <Text style={styles.askMoodAIText}>Ask MoodAI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteEntry}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      {showMenu && (
        <View style={styles.menu}>
          <Text
            style={styles.menuOption}
            onPress={() => handleMenuOption("Analyze Mood")}
          >
            Analyze Mood
          </Text>
          <Text
            style={styles.menuOption}
            onPress={() => handleMenuOption("Generate Reflection")}
          >
            Generate Reflection
          </Text>
          <Text
            style={styles.menuOption}
            onPress={() => handleMenuOption("Give Writing Advice")}
          >
            Give Writing Advice
          </Text>
        </View>
      )}
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
    padding: 10,
  },
  deleteButton: {
    backgroundColor: "ff6437",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: "50%",
  },
  deleteText: {
    color: "#ff6437",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  askMoodAIButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: "50%",
  },
  askMoodAIText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  menu: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  menuOption: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    textAlign: "center",
    color: "#333",
  },
});

export default ViewEntry;
