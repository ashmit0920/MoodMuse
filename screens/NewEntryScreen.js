import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const NewEntryScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [entry, setEntry] = useState('');

  const handleSubmit = () => {
    if (title.trim() && entry.trim()) {
      const newEntry = {
        title,
        text: entry,
        timestamp: new Date().toLocaleString(),
      };

      // You can save this newEntry to AsyncStorage, database, or global state
      console.log('New Entry Saved:', newEntry);

      // Navigate back to the main screen
      navigation.goBack();
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
    height: 150,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF7F50',
    padding: 15,
    borderRadius: 20,
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
