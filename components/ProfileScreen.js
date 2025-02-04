import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile } from "../services/api";

const ProfileScreen = () => {
  const [user, setUser] = useState({ username: "", email: "", caregiver_phone: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = await AsyncStorage.getItem("userId"); // Retrieve stored user ID
      if (!userId) {
        Alert.alert("Error", "User not found");
        return;
      }

      const data = await getUserProfile(userId); // Fetch profile using dynamic user ID
      if (data.success) {
        setUser(data.user);
      } else {
        Alert.alert("Error", "Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Image source={require("../assets/profile.jpg")} style={styles.profileImage} />
      <Text style={styles.text}>Username: {user.username}</Text>
      <Text style={styles.text}>Email: {user.email}</Text>
      <Text style={styles.text}>Caregiver Contact: {user.caregiver_phone}</Text>
    </View>
  );
};

export default ProfileScreen;
