import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, Modal, StyleSheet } from "react-native";
import { getAppointments, addAppointment, updateAppointment, deleteAppointment } from "../services/api";
import { scheduleNotification, createNotificationChannel } from "../services/notificationService";

const AppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState({ id: null, doctor: "", time: "" });

  // Memoizing fetchAppointments
  const fetchAppointments = useCallback(async () => {
    const data = await getAppointments();
    setAppointments(data);
    scheduleAppointments(data);
  }, []);

  useEffect(() => {
    createNotificationChannel();
    fetchAppointments();
  }, [fetchAppointments]);

  const scheduleAppointments = (appointments) => {
    appointments.forEach((appointment) => {
      const appointmentTime = new Date();
      const [hours, minutes] = appointment.time.split(":");
      appointmentTime.setHours(parseInt(hours, 10));
      appointmentTime.setMinutes(parseInt(minutes, 10));

      if (appointmentTime > new Date()) {
        scheduleNotification("Appointment Reminder", `Doctor: ${appointment.doctor} at ${appointment.time}`, appointmentTime);
      }
    });
  };

  const handleSaveAppointment = async () => {
    if (!currentAppointment.doctor || !currentAppointment.time) {
      Alert.alert("Error", "Please enter both doctor name and time.");
      return;
    }

    if (currentAppointment.id) {
      await updateAppointment(currentAppointment.id, currentAppointment.doctor, currentAppointment.time);
      Alert.alert("Success", "Appointment updated!");
    } else {
      await addAppointment(currentAppointment.doctor, currentAppointment.time);
      Alert.alert("Success", "Appointment added!");
    }

    setModalVisible(false);
    fetchAppointments();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointments</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              setCurrentAppointment(item);
              setModalVisible(true);
            }}
          >
            <Text>{`${item.doctor} - ${item.time}`}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AppointmentsScreen;
