import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPills,
  faPlus,
  faCalendar,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import PrescriptionCard from "../components/PrescriptionCard";
import Calender  from "../components/Calender";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;
const dayWidth = screenWidth / 7;

// Generate current week's dates
function getCurrentWeekDates(startDate) {
  const startOfWeek = new Date(startDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });
}

const Home = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState(getCurrentWeekDates(new Date()));
  const [userData, setUserData] = useState({ fullName: "Loading..." });
  const [prescriptions, setPrescriptions] = useState([]);

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
        setUserData({ fullName: data.fullName || "Unnamed" });
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  const fetchPrescriptions = async (startDate = new Date()) => {
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
      const allPrescriptions = data.data || [];

      const selected = new Date(startDate);
      selected.setHours(0, 0, 0, 0);

      const filtered = allPrescriptions
        .filter((item) => {
          const itemStartDate = new Date(item.date);
          itemStartDate.setHours(0, 0, 0, 0);
          const itemEndDate = new Date(item.endDate);
          itemEndDate.setHours(0, 0, 0, 0);
          return selected >= itemStartDate && selected <= itemEndDate;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setPrescriptions(filtered);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const changeDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
    setWeekDates(getCurrentWeekDates(newDate));
    fetchPrescriptions(newDate);
  };

  const handleDateClick = (date) => {
    setCurrentDate(date);
    fetchPrescriptions(date);
  };

  const noPrescriptionsMessage = prescriptions.length === 0 ? (
    <Text style={styles.noMedsText}>No meds today</Text>
  ) : null;

  useEffect(() => {
    fetchPrescriptions(currentDate);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <View style={styles.s1}>
              <Text style={styles.txt}>S</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.head}>Hello {userData.fullName} !</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Sidebar")}>
            <FontAwesomeIcon icon={faBars} size={28} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => changeDate("prev")}>
            <Ionicons name="chevron-back" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <TouchableOpacity onPress={() => changeDate("next")}>
            <Ionicons name="chevron-forward" size={28} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekContainer}>
          {weekDates.map((date) => {
            const isSelected =
              date.toDateString() === currentDate.toDateString();
            return (
              <TouchableOpacity
                key={date.toISOString()}
                onPress={() => handleDateClick(date)}
              >
                <View
                  style={[
                    styles.dayContainer,
                    isSelected && styles.selectedDay,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.selectedDayText,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                  <Text
                    style={[
                      styles.dayName,
                      isSelected && styles.selectedDayText,
                    ]}
                  >
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {noPrescriptionsMessage}
        <FlatList
          data={prescriptions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <PrescriptionCard item={item} />}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

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

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  topSection: {
    flex: 0,
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
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  dayContainer: {
    width: dayWidth - 10,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f0f4f8",
  },
  selectedDay: {
    backgroundColor: "#4A90E2",
  },
  selectedDayText: {
    fontWeight: "bold",
    color: "white",
  },
  dayText: {
    fontSize: 18,
    color: "#000",
  },
  dayName: {
    fontSize: 12,
    color: "#666",
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
    width: 55,
    height: 55,
    borderRadius: 25,
    backgroundColor: "#228B22",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  noMedsText: {
    textAlign: "center",
    fontSize: 18,
    color: "#777",
    marginTop: 20,
  },
});