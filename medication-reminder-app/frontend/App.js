import { StyleSheet, Platform, SafeAreaView } from 'react-native';
import { useEffect } from 'react';
import Welcome from './src/screens/Welcome';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import Home from './src/components/Home';
import AddMedication from './src/components/AddMedication';
import Prescription from './src/components/Prescription';
import Profile from './src/components/Profile';
import Sidebar from './src/components/Sidebar';
import Calender from './src/components/Calender';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';

const Stack = createNativeStackNavigator();

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  useEffect(() => {
    // Set up notification listeners
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification clicked:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="AddMedication" component={AddMedication} options={{ headerShown: false }} />
            <Stack.Screen name="Prescription" component={Prescription} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="Sidebar" component={Sidebar} options={{ headerShown: false }} />
            <Stack.Screen name="Calender" component={Calender} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  }
});