import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView ,FlatList, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    location: '',
    phoneNumber: '',
    bio: '',
  });

  const [image, setImage] = useState(null);
  const [recording, setRecording] = useState(null);
  const soundRef = useRef(null);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access the media library is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await AsyncStorage.setItem('profileImage', result.assets[0].uri);
    }
  };

  const handleStartRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access the microphone is required!');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const handleStopRecording = async () => {
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    soundRef.current = new Audio.Sound();
    await soundRef.current.loadAsync({ uri });
  };

  const handlePlayRecording = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync();
    }
  };

  const handleSaveProfile = async () => {
    try {
      await AsyncStorage.setItem('profile', JSON.stringify(profile));
      Alert.alert('Profile saved successfully!');
    } catch (error) {
      console.error('Failed to save profile', error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    navigation.navigate('Login');
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('profile');
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error('Failed to load profile from AsyncStorage', error);
      }
    };

    const loadImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem('profileImage');
        if (savedImage) {
          setImage(savedImage);
        }
      } catch (error) {
        console.error('Failed to load image from AsyncStorage', error);
      }
    };

    loadProfile();
    loadImage();
  }, []);

  return (
    <ScrollView  style={styles.container}>
      <LinearGradient colors={['#8E2DE2', '#4A00E0']} style={styles.header}>
        {image && <Image source={{ uri: image }} style={styles.profileImage} />}
        <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
        <Text style={styles.location}>{profile.location}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
      </LinearGradient>

      <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={profile.firstName}
        onChangeText={(text) => setProfile({ ...profile, firstName: text })}
      />
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={profile.lastName}
        onChangeText={(text) => setProfile({ ...profile, lastName: text })}
      />
      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={profile.age}
        onChangeText={(text) => setProfile({ ...profile, age: text })}
      />
      <Text style={styles.label}>Gender</Text>
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={profile.gender}
        onChangeText={(text) => setProfile({ ...profile, gender: text })}
      />
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={profile.location}
        onChangeText={(text) => setProfile({ ...profile, location: text })}
      />
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={profile.phoneNumber}
        onChangeText={(text) => setProfile({ ...profile, phoneNumber: text })}
      />
      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={profile.bio}
        onChangeText={(text) => setProfile({ ...profile, bio: text })}
      />

      <TouchableOpacity style={styles.button} onPress={recording ? handleStopRecording : handleStartRecording}>
        <Text style={styles.buttonText}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
      </TouchableOpacity>
      {soundRef.current && (
        <TouchableOpacity style={styles.button} onPress={handlePlayRecording}>
          <Text style={styles.buttonText}>Play Recording</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
    color: '#fff',
  },
  bio: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 10,
  },
  input: {
    height: 40,
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileScreen;
