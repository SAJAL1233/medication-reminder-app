import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as Notifications from 'expo-notifications';

const TestAlarmScreen = () => {
  const testImmediateAlarm = async () => {
    // Request permissions first
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow notifications to test alarm');
      return;
    }

    // Schedule an alarm for 5 seconds from now
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ MEDICATION ALARM',
        body: 'This is a test alarm for your medication',
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.MAX,
        vibrate: [0, 1000, 500, 1000],
        categoryIdentifier: 'medication_alarm',
      },
      trigger: {
        seconds: 5,
        channelId: 'medication-alarm',
      },
    });

    Alert.alert('Alarm Set', 'Test alarm will ring in 5 seconds!');
  };

  const cancelAllAlarms = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    Alert.alert('Success', 'All alarms have been cancelled');
  };

  const checkScheduledAlarms = async () => {
    const alarms = await Notifications.getAllScheduledNotificationsAsync();
    Alert.alert('Scheduled Alarms', `You have ${alarms.length} alarms scheduled`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Medication Alarms</Text>
      
      <TouchableOpacity
        style={[styles.button, styles.greenButton]}
        onPress={testImmediateAlarm}
      >
        <Text style={styles.buttonText}>Test Alarm (5 seconds)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.blueButton]}
        onPress={checkScheduledAlarms}
      >
        <Text style={styles.buttonText}>Check Scheduled Alarms</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.redButton]}
        onPress={cancelAllAlarms}
      >
        <Text style={styles.buttonText}>Cancel All Alarms</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  greenButton: {
    backgroundColor: '#4CAF50',
  },
  blueButton: {
    backgroundColor: '#2196F3',
  },
  redButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TestAlarmScreen;