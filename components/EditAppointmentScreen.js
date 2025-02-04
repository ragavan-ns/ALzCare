import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { updateAppointment } from "../services/api";

const EditAppointmentScreen = ({ route, navigation }) => {
  const { appointment } = route.params;
  const [doctor, setDoctor] = useState(appointment.doctor);
  const [time, setTime] = useState(appointment.time);

  const handleSave = async () => {
    if (!doctor || !time) {
      Alert.alert("Error", "Please enter both doctor name and time.");
      return;
    }
    await updateAppointment(appointment.id, doctor, time);
    Alert.alert("Success", "Appointment updated!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Appointment</Text>
      <TextInput style={styles.input} value={doctor} onChangeText={setDoctor} />
      <TextInput style={styles.input} value={time} onChangeText={setTime} />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
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

export default EditAppointmentScreen;
