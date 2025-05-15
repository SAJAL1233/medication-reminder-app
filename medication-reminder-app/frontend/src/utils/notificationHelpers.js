import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const cancelMedicationNotifications = async (medicationId) => {
  try {
    const notificationIds = await AsyncStorage.getItem(
      `medication_notifications_${medicationId}`
    );
    
    if (notificationIds) {
      const ids = JSON.parse(notificationIds);
      for (const id of ids) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
      await AsyncStorage.removeItem(`medication_notifications_${medicationId}`);
    }
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};

export const getAllScheduledNotifications = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

export const testNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Test Notification',
      body: 'This is a test notification!',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 30 },
  });
};