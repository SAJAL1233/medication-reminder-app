import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPills, faUser, faPlus, faCalendar, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    age: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch("http://192.168.169.218:8080/api/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Fetch failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        setUserData({ 
          fullName: data.fullName || "Unnamed",
          email: data.email || "",
          age: data.age || ""
        });
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faArrowLeft} size={20} color="#4CAF50" />
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Text style={styles.accountText}>My Account</Text>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileInitial}>{userData.fullName.charAt(0)}</Text>
        </View>
        <Text style={styles.profileName}>Welcome {userData.fullName}✨</Text>
        <Text style={styles.profileInfo}>Email: {userData.email}</Text>
        <Text style={styles.profileInfo}>Age: {userData.age}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Welcome')}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: StatusBar.currentHeight || 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
  },
  backButton: {
    paddingLeft: 20,
    zIndex: 10,
  },
  accountText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  profileImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: '500',
  },
  profileName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "600",
  },
  profileInfo: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#FF4D4D",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;