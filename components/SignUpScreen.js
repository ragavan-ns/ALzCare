import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signUpUser } from "../services/api";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [caregiver, setCaregiver] = useState("");

  const handleSignUp = async () => {
    if (!username || !email || !password || !caregiver) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const response = await signUpUser(username, email, password, caregiver);
    if (response.success) {
      Alert.alert("Account Created Successfully!");
      navigation.navigate("Login");
    } else {
      Alert.alert("Signup Failed", response.error || "Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Caregiver Phone" value={caregiver} onChangeText={setCaregiver} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ **Fix: Add Missing `styles` Object**
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold" },
  input: { width: "80%", padding: 10, marginBottom: 10, borderWidth: 1, borderRadius: 5 },
  button: { backgroundColor: "#007BFF", padding: 10, borderRadius: 5 },
  buttonText: { color: "white" },
  linkText: { color: "#007BFF", marginTop: 10 },
});

export default SignUpScreen;
