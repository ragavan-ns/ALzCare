import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { addAppointment } from "../services/api";

const AddAppointmentScreen = ({ navigation }) => {
  const [doctor, setDoctor] = useState("");
  const [time, setTime] = useState("");

  const handleAddAppointment = async () => {
    if (!doctor || !time) {
      Alert.alert("Error", "Please enter both doctor name and time.");
      return;
    }
    await addAppointment(doctor, time);
    Alert.alert("Success", "Appointment added!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Appointment</Text>
      <TextInput style={styles.input} placeholder="Doctor's Name" value={doctor} onChangeText={setDoctor} />
      <TextInput style={styles.input} placeholder="Time (HH:MM AM/PM)" value={time} onChangeText={setTime} />
      <TouchableOpacity style={styles.button} onPress={handleAddAppointment}>
        <Text style={styles.buttonText}>Save Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: "#007BFF", padding: 10, borderRadius: 5 },
  buttonText: { color: "white", textAlign: "center" },
});

export default AddAppointmentScreen;
