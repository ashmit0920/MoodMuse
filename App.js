import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Button, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, FlatList } from 'react-native';
import NewEntryScreen from './screens/NewEntryScreen';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Your App</Text>
        <Text style={styles.subtitle}>
          Start writing your amazing journal!
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Details')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

function DetailsScreen() {
  const [name, setName] = useState('');
  const [isNameSaved, setIsNameSaved] = useState(false);
  const driftAnimation = useRef(new Animated.Value(0)).current;
  const [entries, setEntries] = useState([]);

  const dailyQuote = "“Start where you are. Use what you have. Do what you can.”"
  const navigation = useNavigation();

  // temporary function to clear async storage for testing
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      alert('All data cleared!');
    } catch (error) {
      console.error('Failed to clear AsyncStorage:', error);
    }
  };

  // Loading stored name when the component mounts
  useEffect(() => {
    const fetchName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        if (storedName) {
          setName(storedName);
          setIsNameSaved(true);
        }
      } catch (error) {
        console.error('Failed to load name:', error);
      }
    };
    fetchName();
  }, []);

  // Save the name to AsyncStorage
  const saveName = async () => {
    try {
      await AsyncStorage.setItem('userName', name);
      setIsNameSaved(true);
    } catch (error) {
      console.error('Failed to save name:', error);
    }
  };

  // welcome message animation
  useEffect(() => {
    if (isNameSaved) {
      Animated.timing(driftAnimation, {
        toValue: -300, // Move up by 200 units
        duration: 1000, // 1 second
        useNativeDriver: true,
      }).start();
    }
  }, [isNameSaved]);

  // fetching past entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem('journalEntries');
        if (storedEntries) {
          setEntries(JSON.parse(storedEntries));
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, []);

  return (
    <View style={styles.detailsContainer}>
      {isNameSaved ? (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Animated Welcome Back Section */}
        <Animated.View
          style={[
            styles.animatedContainer,
            { transform: [{ translateY: driftAnimation }] },
          ]}
        >
          <Text style={styles.detailsText}>Welcome back, {name}!</Text>
        </Animated.View>

        {/* Daily Quote Section */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>{dailyQuote}</Text>
        </View>

        {/* Past Entries Section */}
        <View style={styles.pastEntriesContainer}>
          <Text style={styles.pastEntriesTitle}>Past Entries</Text>
          {entries.length > 0 ? (
            <FlatList
              data={entries}
              keyExtractor={(item) => item.id}
              horizontal
              style={{ height: 170 }}
              renderItem={({ item }) => (
                <View style={styles.entryCard}>
                  <Text style={styles.entryTitle}>{item.title}</Text>
                  <Text style={styles.entryDate}>{item.timestamp}</Text>
                </View>
              )}
            />
          ) : (
            <View style={styles.noEntriesContainer}>
              <Text style={styles.noEntriesText}>
                You have no entries. Click on "Add New Entry" below to start writing!
              </Text>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Text style={styles.progressText}>Weekly Writing Progress: 75%</Text>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#79d7be', '#2575fc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: '75%' }]} // Adjust width dynamically
            />
          </View>
        </View>

        {/* Add New Entry Button */}
        <TouchableOpacity 
          style={styles.addEntryButton} 
          onPress={() => navigation.navigate('NewEntry')}
        >
          <Text style={styles.addEntryButtonText}>Add New Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addEntryButton} onPress={clearAsyncStorage}>
          <Text style={styles.addEntryButtonText}>Clear Storage</Text>
        </TouchableOpacity>
      </ScrollView>
      ) : (
        <View style={styles.askNameContainer}>
          <Text style={styles.detailsText}>What should we call you?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#aaa"
            value={name}
            width="300"
            onChangeText={setName}
          />
          <Button title="Save" onPress={saveName} />
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen
          name="NewEntry"
          component={NewEntryScreen}
          options={{ title: 'New Entry', headerStyle: { backgroundColor: '#6a11cb' }, headerTintColor: '#fff'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#2575fc',
    fontWeight: 'bold',
  },
  askNameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#6a11cb', // teal - #79D7BE
  },
  detailsText: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  animatedContainer: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    right: '10%',
    alignItems: 'center',
  },
  quoteContainer: {
    marginTop: 180, // Adjust position after animation
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 18,
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 20,
  },
  pastEntriesContainer: {
    marginTop: 20,
  },
  pastEntriesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  pastEntriesScroll: {
    flexDirection: 'row',
  },
  addEntryButton: {
    backgroundColor: '#FF7F50', // Coral color for contrast
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 40,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addEntryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    textAlign: 'center',
  },
  progressBarContainer: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 20,
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  entryCard: {
    backgroundColor: '#20b2aa',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    width: 120,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  entryTitle: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  entryDate: {
    color: '#eee',
    fontSize: 12,
    marginTop: 5,
  },
  noEntriesContainer: {
    height: 170,
    borderRadius: 10,
    backgroundColor: '#20b2aa',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  noEntriesText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
