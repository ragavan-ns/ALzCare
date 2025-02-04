import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { addDailyTask } from "../services/api";

const AddTaskScreen = ({ navigation }) => {
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");

  const handleAddTask = async () => {
    if (!task || !time) {
      Alert.alert("Error", "Please enter both task and time.");
      return;
    }
    await addDailyTask(task, time);
    Alert.alert("Success", "Task added!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Task</Text>
      <TextInput style={styles.input} placeholder="Task" value={task} onChangeText={setTask} />
      <TextInput style={styles.input} placeholder="Time (HH:MM AM/PM)" value={time} onChangeText={setTime} />
      <TouchableOpacity style={styles.button} onPress={handleAddTask}>
        <Text style={styles.buttonText}>Save Task</Text>
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

export default AddTaskScreen;
