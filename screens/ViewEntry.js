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
import { analyzeJournal } from "../utils/geminiApi";

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
  const handleAskMoodAI = async (entryText, selectedOption) => {
    try {
      const result = await analyzeJournal(entryText, selectedOption);
      console.log("AI Response:", result);
      // Handle the AI response (e.g., display in a modal or new screen)
    } catch (error) {
      Alert.alert("Error", `Failed to get AI analysis. ${error}`);
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
        <TouchableOpacity
          style={[styles.button, styles.askMoodAIButton]}
          onPress={() => setShowMenu(!showMenu)}
        >
          <Text style={styles.askMoodAIText}>Ask MoodAI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
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
            onPress={() => handleAskMoodAI("Analyze Mood")}
          >
            Analyze Mood
          </Text>
          <Text
            style={styles.menuOption}
            onPress={() => handleAskMoodAI("Generate Reflection")}
          >
            Generate Reflection
          </Text>
          <Text
            style={styles.menuOption}
            onPress={() => handleAskMoodAI("Give Writing Advice")}
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
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  deleteButton: {
    borderWidth: 1,
    shadowOpacity: 0,
  },
  deleteText: {
    color: "#ff4c4c",
    fontWeight: "bold",
    fontSize: 16,
  },
  askMoodAIButton: {
    backgroundColor: "#4CAF50",
  },
  askMoodAIText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  menu: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    //padding: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
    //width: "50%",
  },
  menuOption: {
    fontSize: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    textAlign: "center",
    color: "#009200",
  },
});

export default ViewEntry;
