import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPlus,
  faPills,
  faTint,
  faCalendar,
  faBars,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import PrescriptionCard from "../components/PrescriptionCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Prescription = ({ navigation }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [userData, setUserData] = useState({ fullName: "Loading..." });

  // Fetch prescriptions from the backend
  const fetchPrescriptions = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      const response = await fetch("http://192.168.169.218:8080/api/medications", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch medications");
      const data = await response.json();
      setPrescriptions(data.data); // Assuming 'data' contains the prescriptions array
    } catch (error) {
      console.error("Error fetching prescriptions:", error.message);
    }
  };

  // Fetch user data to show fullName
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
      setUserData({ fullName: data.fullName || "Unnamed" });
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  // Fetch prescriptions and user data on component mount
  useEffect(() => {
    fetchPrescriptions();
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesomeIcon icon={faArrowLeft} size={20} color="#4CAF50" />
      </TouchableOpacity>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <View style={styles.s1}>
            <Text style={styles.txt}>S</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.head}>{userData.fullName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Sidebar")}>
        <FontAwesomeIcon icon={faBars} size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Prescriptions</Text>

      {/* Prescription List */}
      <FlatList
        data={prescriptions}
        keyExtractor={(item) => item._id || item.id || Math.random().toString()} // Ensure it's unique
        renderItem={({ item }) => <PrescriptionCard item={item} />}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("Calender")}>
          <FontAwesomeIcon icon={faCalendar} size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.centralButton}
          onPress={() => navigation.navigate("AddMedication")}
        >
          <FontAwesomeIcon icon={faPlus} size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Prescription")}>
          <FontAwesomeIcon icon={faPills} size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  head: {
    fontSize: 18,
    fontWeight: "500",
    flex: 1,
    marginLeft: 10,
  },
  backButton: {
    paddingBottom: 10,
    paddingLeft: 15,
    zIndex: 10,
  },
  s1: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
  },
  txt: {
    fontSize: 20,
    fontWeight: "500",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center",
    paddingBottom: 15,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#355E3B",
    borderRadius: 25,
    margin: 21,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  centralButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#228B22",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
});

export default Prescription;