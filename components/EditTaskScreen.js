import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { updateDailyTask } from "../services/api";

const EditTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const [taskName, setTaskName] = useState(task.task);
  const [time, setTime] = useState(task.time);

  const handleSave = async () => {
    if (!taskName || !time) {
      Alert.alert("Error", "Please enter both task and time.");
      return;
    }
    await updateDailyTask(task.id, taskName, time);
    Alert.alert("Success", "Task updated!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Task</Text>
      <TextInput style={styles.input} value={taskName} onChangeText={setTaskName} />
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

export default EditTaskScreen;
