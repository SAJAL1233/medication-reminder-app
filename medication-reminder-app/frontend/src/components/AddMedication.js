import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPills,
  faClock,
  faArrowLeft,
  faBreadSlice,
  faHamburger,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const AddMedication = ({ navigation }) => {
  const [pillName, setPillName] = useState("");
  const [pillAmount, setPillAmount] = useState("");
  const [days, setDays] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("breakfast");
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: true,
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        return;
      }
    } else {
      Alert.alert('Must use physical device for Push Notifications');
    }

    return token;
  };

  const scheduleMedicationNotifications = async (medicationData) => {
    const { name, dosage, duration, mealTime, notificationTime } = medicationData;
    const scheduledNotificationIds = [];
    const durationDays = parseInt(duration);
    
    // Convert the notification time to a date object
    const notifyTime = new Date(notificationTime);
    
    // Schedule notifications for each day
    for (let i = 0; i < durationDays; i++) {
      const triggerDate = new Date();
      triggerDate.setDate(triggerDate.getDate() + i);
      triggerDate.setHours(notifyTime.getHours());
      triggerDate.setMinutes(notifyTime.getMinutes());
      triggerDate.setSeconds(0);
      
      // Only schedule if the time is in the future
      if (triggerDate > new Date()) {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '💊 Medication Reminder',
            body: `Time to take ${name} (${dosage}) with ${mealTime}`,
            data: { medicationId: medicationData._id },
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: triggerDate,
        });
        
        scheduledNotificationIds.push(notificationId);
      }
    }
    
    return scheduledNotificationIds;
  };

  const onTimeChange = (event, selectedTime) => {
    if (Platform.OS !== "ios") setShowPicker(false);
    if (selectedTime) setNotificationTime(selectedTime);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmit = async () => {
    if (
      !pillName.trim() ||
      !pillAmount.trim() ||
      !days.trim() ||
      !selectedMeal ||
      !notificationTime
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      const parsedDays = parseInt(days.trim(), 10);

      const payload = {
        name: pillName.trim(),
        dosage: pillAmount.trim(),
        duration: days.trim(),
        mealTime: selectedMeal,
        notificationTime: notificationTime.toISOString(),
        date: new Date().toISOString(),
        type: `${pillAmount} pills`,
        description:
          parsedDays === 1
            ? `Take ${pillAmount} pills with ${selectedMeal} today at ${formatTime(
                notificationTime
              )}.`
            : `Take ${pillAmount} pills with ${selectedMeal} for ${parsedDays} days at ${formatTime(
                notificationTime
              )}.`,
        icon: "pills",
        color: "#E3FFE3",
      };

      const response = await fetch("http://192.168.169.218:8080/api/medications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server responded with:", errorData);
        throw new Error(errorData.error || "Failed to add medication");
      }

      const responseData = await response.json();
      
      // Schedule notifications
      const notificationIds = await scheduleMedicationNotifications({
        ...payload,
        _id: responseData.data._id
      });
      
      // Store notification IDs with the medication data
      await AsyncStorage.setItem(
        `medication_notifications_${responseData.data._id}`,
        JSON.stringify(notificationIds)
      );

      Alert.alert("Success", "Medication added successfully with alarm reminders!");
      navigation.navigate("Prescription");
    } catch (error) {
      console.error("Error adding medication:", error.message);
      Alert.alert("Error", "Failed to add medication");
    }
  };

  const mealOptions = [
    { value: "breakfast", icon: faBreadSlice, label: "Breakfast" },
    { value: "lunch", icon: faHamburger, label: "Lunch" },
    { value: "dinner", icon: faMoon, label: "Dinner" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesomeIcon icon={faArrowLeft} size={20} color="#4CAF50" />
      </TouchableOpacity>

      <Text style={styles.title}>Add Plan</Text>

      <Text style={styles.sectionTitle}>Pills name</Text>
      <View style={styles.inputContainer}>
        <FontAwesomeIcon icon={faPills} size={20} color="#4CAF50" />
        <TextInput
          style={styles.input}
          value={pillName}
          onChangeText={setPillName}
          placeholder="Add the Name"
          placeholderTextColor="#888"
        />
      </View>

      <Text style={styles.sectionTitle}>Amount & How long?</Text>
      <View style={styles.row}>
        <View style={styles.amountContainer}>
          <TextInput
            style={[styles.input, styles.amountInput]}
            value={pillAmount}
            keyboardType="numeric"
            onChangeText={setPillAmount}
            placeholder="0"
            placeholderTextColor="#888"
          />
          <Text style={styles.unitText}>pills</Text>
        </View>

        <Text style={styles.dash}>-</Text>

        <View style={styles.amountContainer}>
          <TextInput
            style={[styles.input, styles.amountInput]}
            value={days}
            keyboardType="numeric"
            onChangeText={setDays}
            placeholder="0"
            placeholderTextColor="#888"
          />
          <Text style={styles.unitText}>days</Text>
        </View>

        <Text style={styles.dash}>-</Text>
      </View>

      <Text style={styles.sectionTitle}>Food & Pills</Text>
      <View style={styles.mealContainer}>
        {mealOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.mealOption,
              selectedMeal === option.value && styles.selectedMealOption,
            ]}
            onPress={() => setSelectedMeal(option.value)}
          >
            <FontAwesomeIcon
              icon={option.icon}
              size={24}
              color={selectedMeal === option.value ? "#fff" : "#4CAF50"}
            />
            <Text
              style={[
                styles.mealLabel,
                selectedMeal === option.value && styles.selectedMealLabel,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Notification Time</Text>
      <TouchableOpacity
        style={styles.timeContainer}
        onPress={() => setShowPicker(true)}
      >
        <FontAwesomeIcon icon={faClock} size={20} color="#4CAF50" />
        <Text style={styles.timeText}>
          {formatTime(notificationTime)}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={notificationTime}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour={false}
          onChange={onTimeChange}
        />
      )}

      <TouchableOpacity style={styles.doneButton} onPress={handleSubmit}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 50,
    backgroundColor: "#fff",
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#000",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#888",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
    marginBottom: 25,
  },
  input: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    color: "#000",
  },
  amountInput: {
    flex: 0,
    width: 40,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#888",
  },
  dash: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#888",
  },
  mealContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  mealOption: {
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    width: "30%",
  },
  selectedMealOption: {
    backgroundColor: "#4CAF50",
  },
  mealLabel: {
    marginTop: 8,
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  selectedMealLabel: {
    color: "#fff",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
    marginBottom: 25,
  },
  timeText: {
    marginLeft: 10,
    fontSize: 18,
    color: "#000",
  },
  doneButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  doneText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddMedication;