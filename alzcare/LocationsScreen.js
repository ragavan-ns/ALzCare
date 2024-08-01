import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';

const LocationsScreen = ({ navigation }) => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const savedLocations = await AsyncStorage.getItem('locations');
        if (savedLocations) {
          setLocations(JSON.parse(savedLocations));
        }
      } catch (error) {
        console.error('Failed to load locations', error);
      }
    };

    loadLocations();
  }, []);

  useEffect(() => {
    const saveLocations = async () => {
      try {
        await AsyncStorage.setItem('locations', JSON.stringify(locations));
      } catch (error) {
        console.error('Failed to save locations', error);
      }
    };

    saveLocations();
  }, [locations]);

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      setLocations([...locations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  const handleDeleteLocation = (location) => {
    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this location?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setLocations(locations.filter((item) => item !== location));
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const handleOpenMap = (location) => {
    const query = encodeURIComponent(location);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    WebBrowser.openBrowserAsync(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Locations</Text>
      <FlatList
        data={locations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => handleOpenMap(item)} style={styles.locationButton}>
              <Text style={styles.item}>{item}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteLocation(item)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Add New Location"
        value={newLocation}
        onChangeText={setNewLocation}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddLocation}>
        <Text style={styles.buttonText}>Add Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  locationButton: {
    flex: 1,
  },
  item: {
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LocationsScreen;
