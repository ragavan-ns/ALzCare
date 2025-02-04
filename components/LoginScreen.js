import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { loginUser } from "../services/api";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    const response = await loginUser(email, password);
    if (response.success) {
      await AsyncStorage.setItem("userId", response.user.id.toString());
      Alert.alert("Login Successful!");
      navigation.navigate("Dashboard");
    } else {
      Alert.alert("Login Failed", response.message || "Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold" },
  input: { width: "80%", padding: 10, marginBottom: 10, borderWidth: 1, borderRadius: 5 },
  button: { backgroundColor: "#007BFF", padding: 10, borderRadius: 5 },
  buttonText: { color: "white" },
  linkText: { color: "#007BFF", marginTop: 10 },
});

export default LoginScreen;
