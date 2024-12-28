import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewEntryScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [entry, setEntry] = useState('');

  const handleSubmit = async () => {
    if (title.trim() && entry.trim()) {
        const newEntry = {
          id: Date.now().toString(), // Unique identifier
          title,
          text: entry,
          timestamp: new Date().toLocaleString(),
        };
  
        try {
          // Fetch existing entries
          const storedEntries = await AsyncStorage.getItem('journalEntries');
          const entries = storedEntries ? JSON.parse(storedEntries) : [];
  
          // Add the new entry
          entries.push(newEntry);
  
          // Save back to AsyncStorage
          await AsyncStorage.setItem('journalEntries', JSON.stringify(entries));
  
          alert('Entry saved successfully!');
          navigation.goBack();
        } catch (error) {
          console.error('Error saving entry:', error);
          alert('Failed to save the entry. Please try again.');
        }
      } else {
        alert('Please fill in both the title and the entry.');
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Journal Entry</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Write your journal entry here..."
        placeholderTextColor="#aaa"
        value={entry}
        onChangeText={setEntry}
        multiline
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6a11cb',
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 60,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 250,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF7F50',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NewEntryScreen;
