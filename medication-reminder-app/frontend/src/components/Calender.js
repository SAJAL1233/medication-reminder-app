import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const Calendar = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1).getDay(); // 0 = Sunday
  
  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        day === today.getDate() && 
        currentDate.getMonth() === today.getMonth() && 
        currentDate.getFullYear() === today.getFullYear();
      
      days.push(
        <TouchableOpacity 
          key={`day-${day}`}
          style={[styles.day, isToday && styles.todayDay]}
        >
          <Text style={[styles.dayText, isToday && styles.todayText]}>{day}</Text>
          {day % 5 === 0 && <View style={styles.eventIndicator} />}
        </TouchableOpacity>
      );
    }
    
    // Add empty cells at the end if needed to complete the grid
    while (days.length < 42) { // 6 rows x 7 days
      days.push(<View key={`empty-end-${days.length}`} style={styles.emptyDay} />);
    }
    
    return days;
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <Text style={styles.title}>Calendar</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Month/Year display with navigation arrows */}
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={() => changeMonth('prev')}>
          <FontAwesome5 name="chevron-left" size={18} color="#4CAF50" />
        </TouchableOpacity>
        
        <Text style={styles.monthText}>{currentMonth} {currentYear}</Text>
        
        <TouchableOpacity onPress={() => changeMonth('next')}>
          <FontAwesome5 name="chevron-right" size={18} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      {/* Day names row */}
      <View style={styles.daysHeader}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text key={day} style={styles.dayName}>{day}</Text>
        ))}
      </View>
      
      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {renderCalendarDays()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerRight: {
    width: 30,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  monthText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333333',
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dayName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 10,
  },
  day: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  todayDay: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    color: '#333333',
  },
  todayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  eventIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginTop: 3,
  },
});

export default Calendar;