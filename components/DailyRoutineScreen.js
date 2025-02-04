import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, Modal, StyleSheet } from "react-native";
import { getDailyRoutine, addDailyTask, updateDailyTask, deleteDailyTask } from "../services/api";
import { scheduleNotification, createNotificationChannel } from "../services/notificationService";
import { Audio } from "expo-av";

const DailyRoutineScreen = () => {
  const [routine, setRoutine] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState({ id: null, task: "", time: "" });

  const fetchRoutine = useCallback(async () => {
    const data = await getDailyRoutine();
    setRoutine(data);
    scheduleAlarms(data);
  }, []);

  useEffect(() => {
    createNotificationChannel();
    fetchRoutine();
  }, [fetchRoutine]);

  const scheduleAlarms = async (tasks) => {
    tasks.forEach((task) => {
      const taskTime = new Date();
      const [hours, minutes] = task.time.split(":");
      taskTime.setHours(parseInt(hours, 10));
      taskTime.setMinutes(parseInt(minutes, 10));

      if (taskTime > new Date()) {
        scheduleNotification("Task Reminder", `Time for: ${task.task}`, taskTime);
      }
    });
  };

  const handleSaveTask = async () => {
    if (!currentTask.task || !currentTask.time) {
      Alert.alert("Error", "Please enter both task and time.");
      return;
    }

    if (currentTask.id) {
      await updateDailyTask(currentTask.id, currentTask.task, currentTask.time);
      Alert.alert("Success", "Task updated!");
    } else {
      await addDailyTask(currentTask.task, currentTask.time);
      Alert.alert("Success", "Task added!");
    }

    setModalVisible(false);
    fetchRoutine();
  };

  const handleDeleteTask = async (id) => {
    await deleteDailyTask(id);
    Alert.alert("Success", "Task deleted!");
    fetchRoutine();
  };

  const playAlarm = async () => {
    const { sound } = await Audio.Sound.createAsync(require("../assets/alarm.mp3"));
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Routine</Text>
      <FlatList
        data={routine}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.task}
            onPress={() => {
              setCurrentTask(item);
              setModalVisible(true);
            }}
          >
            <Text>{`${item.task} - ${item.time}`}</Text>
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setCurrentTask({ id: null, task: "", time: "" });
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>

      {/* Edit/Add Task Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{currentTask.id ? "Edit Task" : "Add Task"}</Text>
          <TextInput style={styles.input} placeholder="Task" value={currentTask.task} onChangeText={(text) => setCurrentTask({ ...currentTask, task: text })} />
          <TextInput style={styles.input} placeholder="Time (HH:MM AM/PM)" value={currentTask.time} onChangeText={(text) => setCurrentTask({ ...currentTask, time: text })} />
          <TouchableOpacity style={styles.button} onPress={handleSaveTask}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  task: { flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 1 },
  deleteButton: { color: "red" },
  button: { backgroundColor: "#28a745", padding: 10, borderRadius: 5, marginTop: 10 },
  buttonText: { color: "white", textAlign: "center" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, width: "80%", marginBottom: 10, borderRadius: 5 },
  cancelButton: { marginTop: 10 },
  cancelButtonText: { color: "red" },
});

export default DailyRoutineScreen;
