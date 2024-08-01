import 'react-native-gesture-handler';
import React, { useState, useEffect , useRef} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList,ScrollView , Image, Alert, Linking, PermissionsAndroid, Platform  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as WebBrowser from 'expo-web-browser';
import Geolocation from 'react-native-geolocation-service';
import locationsScreen from './LocationsScreen';
import profileScreen from './ProfileScreen';
import call from 'react-native-phone-call';
import SendSMS from 'react-native-sms';

const Stack = createStackNavigator();
let no = '';
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPassword = await AsyncStorage.getItem('password');
      if (email === storedEmail && password === storedPassword) {
        const currentTimestamp = new Date().getTime();
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('loginTimestamp', JSON.stringify(currentTimestamp));
        navigation.navigate('Dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Failed to login', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [caregiver, setCaregiver] = useState('');
  const handleSignUp = async () => {
    try {
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('caregiver',caregiver);
      await AsyncStorage.setItem('password', password);
      alert('Account created successfully!');
      no = caregiver;
      navigation.navigate('AlzCare');
    } catch (error) {
      console.error('Failed to sign up', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="caregiver no"
        value={caregiver}
        onChangeText={setCaregiver}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('AlzCare')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const DashboardScreen = ({ navigation }) => {
  const [username, setUsername] = useState('hello');
  const [greeting, setGreeting] = useState('Good Morning');

  useEffect(() => {
    const loadUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Failed to load username from AsyncStorage', error);
      }
    };

    const determineGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        setGreeting('Good Morning');
      } else if (currentHour < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };

    loadUsername();
    determineGreeting();
  }, []);
  
  const handleEmergencyCall = async () => {
    const args = {
      number: no, // Caregiver's phone number
      prompt: true, // Display a confirmation dialog before calling
    };

    call(args).catch(console.error);
   // sendLocation();
  };

  const sendLocation = async () => {
    const hasLocationPermission = await requestLocationPermission();

    if (!hasLocationPermission) {
      Alert.alert('Location permission denied');
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const message = `Emergency! The patient is at https://maps.google.com/?q=${latitude},${longitude}`;
        const sendSMS = (message) => {
  SendSMS.send(
    {
      body: message,
      recipients: ['9360413425'], // Caregiver's phone number
      successTypes: ['sent', 'queued'],
      allowAndroidSendWithoutReadPermission: true,
    },
    (completed, cancelled, error) => {
      if (completed) {
        alert('SMS sent successfully');
      } else if (cancelled) {
        console.log('SMS sending was cancelled');
      } else {
        console.log('Failed to send SMS', error);
      }
    }
  );
};},
      //   SendSMS.send({
      //     body: message,
      //     recipients: ['9360413425'], // Caregiver's phone number
      //     successTypes: ['sent', 'queued'],
      //     allowAndroidSendWithoutReadPermission: true,
      //   }, (completed, cancelled, error) => {
      //     if (completed) {
      //       alert('SMS sent successfully');
      //     } else if (cancelled) {
      //       console.log('SMS sent cancelled');
      //     } else {
      //       console.log('Failed to send SMS', error);
      //     }
      //   });
      // },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      }
    );
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  return (
    <View style={styles.container}>
     <Text style={styles.title}>{`${greeting}, ${username}`}</Text>

      <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('DailyRoutine')}>
      <Image source={require('./task.jpg')} style={styles.buttonImage} />
        <Text style={styles.buttonText}>Daily Routine</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('Profile')}>
      <Image source={require('./Profile.jpg')} style={styles.buttonImage} />
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('Locations')}>
      <Image source={require('./location.jpg')} style={styles.buttonImage} />
        <Text style={styles.buttonText}>Locations</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('Appointments')}>
      <Image source={require('./img.jpg')} style={styles.buttonImage} />
        <Text style={styles.buttonText}>Appointments</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button1} onPress={handleEmergencyCall}>
        <Image source={require('./emergency.jpg')} style={styles.buttonImage} />
        <Text style={styles.buttonText}>Emergency</Text>
      </TouchableOpacity>
    </View>
  );
};
const DailyRoutineScreen = ({ navigation }) => {
  const [routineItems, setRoutineItems] = useState([]);

  useEffect(() => {
    async function loadRoutineItems() {
      try {
        const savedRoutineItems = await AsyncStorage.getItem('routineItems');
        if (savedRoutineItems) {
          setRoutineItems(JSON.parse(savedRoutineItems));
        }
      } catch (error) {
        console.error('Failed to load routine items from AsyncStorage', error);
      }
    }

    loadRoutineItems();
  }, []);

  useEffect(() => {
    async function saveRoutineItems() {
      try {
        await AsyncStorage.setItem('routineItems', JSON.stringify(routineItems));
      } catch (error) {
        console.error('Failed to save routine items to AsyncStorage', error);
      }
    }

    saveRoutineItems();
  }, [routineItems]);

  const handleAddTask = (newTask) => {
    setRoutineItems([...routineItems, { key: `${routineItems.length + 1}`, ...newTask }]);
  };

  const handleEditTask = (editedTask) => {
    const updatedTasks = routineItems.map((task) => (task.key === editedTask.key ? editedTask : task));
    setRoutineItems(updatedTasks);
  };

  const handleDeleteTask = (taskKey) => { 
  
  
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this Reminder?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedTasks = routineItems.filter((task) => task.key !== taskKey);
            setRoutineItems(updatedTasks);
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  
    
  };
  

  const sortedRoutineItems = [...routineItems].sort((a, b) => {
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    return timeA[0] - timeB[0] || timeA[1] - timeB[1];
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Routine</Text>
      <FlatList
        data={sortedRoutineItems}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('EditTask', { task: item, handleEditTask })} style={styles.locationButton}>
              <Text style={styles.item}>{`${item.task} - ${item.time}`}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTask(item.key)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.key}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTask', { handleAddTask })}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};


const AddTaskScreen = ({ route, navigation }) => {
  const { handleAddTask } = route.params;
  const [task, setTask] = useState('');
  const [time, setTime] = useState('');

  const handleSave = () => {
    handleAddTask({ task, time });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Task</Text>
      <TextInput style={styles.input} placeholder="Task" value={task} onChangeText={setTask} />
      <TextInput style={styles.input} placeholder="Time (HH:MM)" value={time} onChangeText={setTime} />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );

};
const EditTaskScreen = ({ route, navigation }) => {
  const { task, handleEditTask } = route.params;
  const [taskName, setTaskName] = useState(task.task);
  const [time, setTime] = useState(task.time);

  const handleSave = () => {
    handleEditTask({ key: task.key, task: taskName, time });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Task</Text>
      <TextInput style={styles.input} value={taskName} onChangeText={setTaskName} />
      <TextInput style={styles.input} value={time} onChangeText={setTime} />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};


const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPhoto = await AsyncStorage.getItem('photo');
        if (storedUsername) setUsername(storedUsername);
        if (storedEmail) setEmail(storedEmail);
        if (storedPhoto) setPhoto(storedPhoto);
      } catch (error) {
        console.error('Failed to load profile', error);
      }
    };

    loadProfile();
  }, []);

  const handlePhotoUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission to access photos was denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
        await AsyncStorage.setItem('photo', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Failed to upload photo', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.profileImage} />
      ) : (
        <Text>No photo uploaded</Text>
      )}
      <TouchableOpacity style={styles.uploadButton} onPress={handlePhotoUpload}>
        <Text style={styles.buttonText}>Upload Photo</Text>
      </TouchableOpacity>
      <Text style={styles.profileText}>Username: {username}</Text>
      <Text style={styles.profileText}>Email: {email}</Text>
    </View>
  );
};
const LocationsScreen = ({ navigation }) => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const savedLocations = await AsyncStorage.getItem('locations');
        if (savedLocations) {
          setLocations(JSON.parse(savedLocations));
        }
      } catch (error) {
        console.error('Failed to load locations', error);
      }
    };

    loadLocations();
  }, []);

  useEffect(() => {
    const saveLocations = async () => {
      try {
        await AsyncStorage.setItem('locations', JSON.stringify(locations));
      } catch (error) {
        console.error('Failed to save locations', error);
      }
    };

    saveLocations();
  }, [locations]);

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      setLocations([...locations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  const handleOpenMap = (location) => {
    const query = encodeURIComponent(location);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    WebBrowser.openBrowserAsync(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Locations</Text>
      <FlatList
        data={locations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleOpenMap(item)}>
            <Text style={styles.item}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Add New Location"
        value={newLocation}
        onChangeText={setNewLocation}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddLocation}>
        <Text style={styles.buttonText}>Add Location</Text>
      </TouchableOpacity>
    </View>
  );
};
const AddLocationScreen = ({ route, navigation }) => {
  const { handleAddLocation } = route.params;
  const [name, setName] = useState('');

  const handleSave = () => {
    handleAddLocation({ name });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Location</Text>
      <TextInput style={styles.input} placeholder="Location Name" value={name} onChangeText={setName} />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const EditLocationScreen = ({ route, navigation }) => {
  const { location, handleEditLocation } = route.params;
  const [editedName, setEditedName] = useState(location.name);

  const handleSave = () => {
    handleEditLocation({ ...location, name: editedName });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Location</Text>
      <TextInput style={styles.input} placeholder="Location Name" value={editedName} onChangeText={setEditedName} />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const AppointmentsScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const savedAppointments = await AsyncStorage.getItem('appointments');
        if (savedAppointments) {
          setAppointments(JSON.parse(savedAppointments));
        }
      } catch (error) {
        console.error('Failed to load appointments', error);
      }
    };

    loadAppointments();
  }, []);

  useEffect(() => {
    const saveAppointments = async () => {
      try {
        await AsyncStorage.setItem('appointments', JSON.stringify(appointments));
      } catch (error) {
        console.error('Failed to save appointments', error);
      }
    };

    saveAppointments();
  }, [appointments]);

  const handleAddAppointment = (newAppointment) => {
    setAppointments([...appointments, { key: `${appointments.length + 1}`, ...newAppointment }]);
  };

  const handleEditAppointment = (editedAppointment) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.key === editedAppointment.key ? editedAppointment : appointment
    );
    setAppointments(updatedAppointments);
  };

  const handleDeleteAppointment = (appointmentKey) => {
    const updatedAppointments = appointments.filter((appointment) => appointment.key !== appointmentKey);
    setAppointments(updatedAppointments);
  };

  const sortedAppointments = [...appointments].sort((a, b) => a.date - b.date);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointments</Text>
      <FlatList
        data={sortedAppointments}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('EditAppointment', { appointment: item, handleEditAppointment })} style={styles.locationButton}>
              <Text style={styles.item}>{`${item.name} - ${item.time}`}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteAppointment(item.key)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.key}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddAppointment', { handleAddAppointment })}>
        <Text style={styles.buttonText}>Add Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

const AddAppointmentScreen = ({ route, navigation }) => {
  const [appointmentName, setAppointmentName] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const { handleAddAppointment } = route.params;

  const handleSave = () => {
    if (appointmentName.trim() && appointmentTime.trim()) {
      const newAppointment = {
        key: Date.now().toString(),
        name: appointmentName.trim(),
        time: appointmentTime.trim(),
      };
      handleAddAppointment(newAppointment);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Appointment</Text>
      <TextInput
        style={styles.input}
        placeholder="Appointment Name"
        value={appointmentName}
        onChangeText={setAppointmentName}
      />
      <TextInput
        style={styles.input}
        placeholder="Time (HH:MM)"
        value={appointmentTime}
        onChangeText={setAppointmentTime}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const EditAppointmentScreen = ({ route, navigation }) => {
  const { appointment, handleEditAppointment } = route.params;
  const [appointmentName, setAppointmentName] = useState(appointment.name);
  const [appointmentTime, setAppointmentTime] = useState(appointment.time);

  const handleSave = () => {
    if (appointmentName.trim() && appointmentTime.trim()) {
      const editedAppointment = {
        key: appointment.key,
        name: appointmentName.trim(),
        time: appointmentTime.trim(),
      };
      handleEditAppointment(editedAppointment);
      navigation.goBack();
    }
  };

  return (
    <ScrollView  style={styles.container}>
      <Text style={styles.title}>Edit Appointment</Text>
      <TextInput
        style={styles.input}
        placeholder="Appointment Name"
        value={appointmentName}
        onChangeText={setAppointmentName}
      />
      <TextInput
        style={styles.input}
        placeholder="Time (HH:MM)"
        value={appointmentTime}
        onChangeText={setAppointmentTime}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const playSound = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require('./FM9B3TC-alarm.mp3') // Make sure you have an alarm sound file in your assets folder
  );
  await sound.playAsync();
};

const App = () => {
  const navigationRef = useRef();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        const loginTimestamp = await AsyncStorage.getItem('loginTimestamp');
        const currentTimestamp = new Date().getTime();
        const loginTimeDifference = currentTimestamp - parseInt(loginTimestamp);

        if (isLoggedIn === 'true' && loginTimeDifference <= 3600000) {
          navigationRef.current.navigate('Dashboard');
        }
      } catch (error) {
        console.error('Failed to check login status', error);
      }
    };

    const checkAlarms = async () => {
      const savedRoutineItems = await AsyncStorage.getItem('routineItems');
      if (savedRoutineItems) {
        const routineItems = JSON.parse(savedRoutineItems);
        //const currentTime = new Date().getHours() + ":" + new Date().getMinutes();
        routineItems.forEach((item) => {
          const itemTime = item.time;
          const l = item.time.split(":")
          // if (itemTime <= currentTime && itemTime >= currentTime - 60000) {
          //   playSound();
          // }
          if (new Date().getHours() == l[0] && new Date().getMinutes() - parseInt(l[1],10) < 2){
            Alert.alert('Alarm', 'It is time for your ' + item.task.trim() + '!');
            playSound();
            
          }
        });
      }
    };

    const intervalId = setInterval(checkAlarms, 60000);

    checkLoginStatus();

    return () => clearInterval(intervalId);
  }, []);

  return (
    // <ScrollView>
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="AlzCare" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="DailyRoutine" component={DailyRoutineScreen} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} />
        <Stack.Screen name="EditTask" component={EditTaskScreen} />
        <Stack.Screen name="Profile" component={profileScreen} />
        <Stack.Screen name="Locations" component={locationsScreen} />
        <Stack.Screen name="AddLocation" component={locationsScreen.AddLocationScreen} />
        <Stack.Screen name="EditLocation" component={locationsScreen.EditLocationScreen} />
        <Stack.Screen name="Appointments" component={AppointmentsScreen} />
        <Stack.Screen name="AddAppointment" component={AddAppointmentScreen} />
        <Stack.Screen name="EditAppointment" component={EditAppointmentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    // </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
    paddingTop: 30,
  },
  title: {
    //fontSize: 32,
    alignSelf: 'center',
    marginBottom: 20,
    color: '#333',
    fontSize: 28,
   fontWeight: 'bold',
  },
  input: {
    //flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
  },
   locationButton: {
    flex: 1,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  button1:{
     flexDirection: 'row',
  //  alignItems: 'center',
  //   backgroundColor: '#DDDDDD',
   padding: 10,
   margin: 10,
  // borderRadius: 5,
  // width: '80%',
   justifyContent: 'space-between',
   backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
     shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
 buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    
  },
   buttonImage: {
    width: 120,
    height: 70,
    marginBottom:10,
  },
  link: {
    marginTop: 10,
    alignItems: 'center',
  },
  linkText: {
    color: '#007BFF',
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  item: {
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // deleteButton: {
  //   backgroundColor: '#dc3545',
  //   paddingVertical: 5,
  //   paddingHorizontal: 10,
  //   borderRadius: 5,
  // },
  // deleteButtonText: {
  //   color: '#fff',
  //   fontSize: 16,
  // },
  addButton: {
    backgroundColor: '#28a745',
    //alignSelf: 'center',
     paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  profileText: {
    fontSize: 18,
    marginBottom: 10,
  },
  
  
});

export default App;

//AlzCare: An Android Application For Assisting Alzheimer Patients