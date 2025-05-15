import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'Home'
    };
  }

  renderIcon = (iconSet, iconName, isActive) => {
    const IconComponent = iconSet === 'FontAwesome5' ? FontAwesome5 : FontAwesome;
    return (
      <IconComponent 
        name={iconName} 
        size={18} 
        style={isActive ? styles.iconActive : styles.icon} 
      />
    );
  };

  render() {
    const menuItems = [
      { 
        id: 'Home', 
        icon: 'home', 
        iconSet: 'FontAwesome5',
        onPress: () => this.props.navigation.navigate('Home')
      },
      { 
        id: 'Prescription', 
        icon: 'pills', 
        iconSet: 'FontAwesome5',
        onPress: () => this.props.navigation.navigate('Prescription')
      },
      { 
        id: 'Add Medication', 
        icon: 'pills', 
        iconSet: 'FontAwesome5',
        onPress: () => this.props.navigation.navigate('AddMedication')
      },
      { 
        id: 'Profile', 
        icon: 'user', 
        iconSet: 'FontAwesome',
        onPress: () => this.props.navigation.navigate('Profile')
      },
      { 
        id: 'Calender', 
        icon: 'calendar', 
        iconSet: 'FontAwesome',
        onPress: () => this.props.navigation.navigate('Calender')
      },
    ];

    return (
      <DrawerContentScrollView {...this.props} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>Medizen</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={this.state.activeItem === item.id ? styles.menuItemActive : styles.menuItem}
              onPress={() => {
                this.setState({ activeItem: item.id });
                item.onPress();
              }}
            >
              {this.renderIcon(item.iconSet, item.icon, this.state.activeItem === item.id)}
              <Text style={this.state.activeItem === item.id ? styles.menuTextActive : styles.menuText}>
                {item.id}
              </Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => {
              // Handle logout logic here
              this.props.navigation.navigate('Welcome');
            }}
          >
            <FontAwesome 
              name="sign-out" 
              size={18} 
              style={styles.logoutIcon} 
            />
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    );
  }
}

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
  logo: {
    color: '#333333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  menuSection: {
    paddingVertical: 10,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuItemActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  icon: {
    color: '#555555',
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  iconActive: {
    color: '#4CAF50',
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    color: '#333333',
    fontSize: 15,
  },
  menuTextActive: {
    color: '#4CAF50',
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  logoutIcon: {
    color: '#FF3B30',
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default Sidebar;