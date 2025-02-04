import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const DashboardScreen = ({ navigation }) => {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    // Fetch user details (this can be updated with API call)
    setUsername("John Doe");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {username}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("DailyRoutine")}>
        <Image source={require("../assets/task.jpg")} style={styles.buttonImage} />
        <Text style={styles.buttonText}>Daily Routine</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Appointments")}>
        <Image source={require("../assets/appointments.jpg")} style={styles.buttonImage} />
        <Text style={styles.buttonText}>Appointments</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Profile")}>
        <Image source={require("../assets/profile.jpg")} style={styles.buttonImage} />
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f7f7f7" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  button: { flexDirection: "row", backgroundColor: "#007BFF", padding: 10, margin: 10, borderRadius: 5, alignItems: "center" },
  buttonImage: { width: 50, height: 50, marginRight: 10 },
  buttonText: { color: "white", fontSize: 18 },
});

export default DashboardScreen;
