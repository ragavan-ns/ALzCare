import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import call from "react-native-phone-call";
import { getUserProfile } from "../services/api";

const EmergencyScreen = () => {
  const [caregiverPhone, setCaregiverPhone] = useState("");

  useEffect(() => {
    const fetchCaregiverPhone = async () => {
      const userId = await AsyncStorage.getItem("userId"); // Get stored user ID
      if (!userId) {
        Alert.alert("Error", "User not found");
        return;
      }

      const data = await getUserProfile(userId);
      if (data.success) {
        setCaregiverPhone(data.user.caregiver_phone);
      } else {
        Alert.alert("Error", "Failed to fetch caregiver contact.");
      }
    };

    fetchCaregiverPhone();
  }, []);

  const handleEmergencyCall = () => {
    if (!caregiverPhone) {
      Alert.alert("Error", "No caregiver contact found.");
      return;
    }
    const args = { number: caregiverPhone, prompt: true };
    call(args).catch(console.error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Contact</Text>
      <Image source={require("../assets/emergency.jpg")} style={styles.image} />
      <Text style={styles.text}>Caregiver: {caregiverPhone}</Text>
      <TouchableOpacity style={styles.button} onPress={handleEmergencyCall}>
        <Text style={styles.buttonText}>Call Caregiver</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmergencyScreen;
