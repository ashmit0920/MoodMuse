import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Button, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';

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
  const [pastEntries, setPastEntries] = useState([
    'Day at the Beach',
    'Goals for the Month',
    'Thoughts on Happiness',
    'Reflections on Life',
  ]);

  const dailyQuote = "“Start where you are. Use what you have. Do what you can.”"

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

  useEffect(() => {
    if (isNameSaved) {
      Animated.timing(driftAnimation, {
        toValue: -300, // Move up by 200 units
        duration: 1000, // 1 second
        useNativeDriver: true,
      }).start();
    }
  }, [isNameSaved]);

  return (
    <View style={styles.detailsContainer}>
      {isNameSaved ? (
        <>
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.pastEntriesScroll}
          >
            {pastEntries.map((entry, index) => (
              <View key={index} style={styles.entryCard}>
                <Text style={styles.entryText}>{entry}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Add New Entry Button */}
        <TouchableOpacity style={styles.addEntryButton}>
          <Text style={styles.addEntryButtonText}>Add New Entry</Text>
        </TouchableOpacity>
      </>
      ) : (
        <>
          <Text style={styles.detailsText}>What should we call you?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />
          <Button title="Save" onPress={saveName} />
        </>
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
  detailsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#6a11cb', // teal - #79D7BE
  },
  detailsText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  animatedContainer: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    right: '10%',
    alignItems: 'center',
  },
  quoteContainer: {
    marginTop: 200, // Adjust position after animation
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
  entryCard: {
    backgroundColor: '#40E0D0', // Teal color 
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  entryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addEntryButton: {
    backgroundColor: '#FF7F50', // Coral color for contrast
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 30,
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
    height: 60,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingHorizontal: 10,
    marginTop: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
