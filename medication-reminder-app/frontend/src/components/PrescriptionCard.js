import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPills, faTint, faBell } from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  pills: faPills,
  tint: faTint,
};

const PrescriptionCard = ({ item }) => {
  // Format notification time if available
  const formatNotificationTime = (notificationTime) => {
    const time = new Date(notificationTime);
    if (isNaN(time.getTime())) {
      return null;
    }
    return time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const iconKey = item.icon || 'pills';
  return (
    <View style={[styles.card, { backgroundColor: item.color || '#E3FFE3' }]}>
      <View style={styles.header}>
        <Text style={styles.type}>{item.type || 'N/A'}</Text>
        {item.notificationTime && (
          <View style={styles.notificationBadge}>
            <FontAwesomeIcon icon={faBell} size={14} color="#555" />
            <Text style={styles.notificationText}>
              {formatNotificationTime(item.notificationTime)}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.issueDate}>
          Added: {new Date(item.date).toLocaleDateString()}
        </Text>
        <FontAwesomeIcon
          icon={iconMap[iconKey] || faPills}
          size={24}
          color="#555"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  type: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 5,
    borderRadius: 10,
  },
  notificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 5,
    borderRadius: 10,
  },
  notificationText: {
    fontSize: 12,
    marginLeft: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  issueDate: {
    fontSize: 12,
    color: '#444',
  },
});

export default PrescriptionCard;