import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {router} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const WebNavBar = ({username}) => {
    const [activeCategory, setActiveCategory] = useState('feed');

    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
      setDropdownVisible(!dropdownVisible);
    };

    const handleLogout = async() => {
      console.log('Logout');
      setDropdownVisible(false);
      try {
        await AsyncStorage.removeItem('userId'); 
        router.push('/login'); 
      } catch (error) {
        console.error('Error removing user ID from AsyncStorage:', error);
      }
    };

    const handleDeleteAccount = () => {
      console.log('Delete Account');
      setDropdownVisible(false);
      // Add your delete account logic here
    };

    const handleEditProfile = () => {
      console.log('Edit Profile');
      setDropdownVisible(false);
      // Add your edit profile logic here
    };

    return (
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.navContainer}>
                <TouchableOpacity style={[styles.logoContainer, activeCategory === 'feed' && styles.logoContainer]} onPress={() => setActiveCategory('feed')}>
                    <Text style={styles.logoText}>CriticConnect</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.catButton, activeCategory === 'games' && styles.activeCatButton]} onPress={() => setActiveCategory('games')}>
                    <Text>Games</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.catButton, activeCategory === 'movies' && styles.activeCatButton]} 
                    onPress={() => setActiveCategory('movies')}>
                    <Text>Movies</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.catButton, activeCategory === 'music' && styles.activeCatButton]} 
                    onPress={() => setActiveCategory('music')}>
                    <Text>Music</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
                <TextInput style={styles.searchInput} placeholder="Search CriticConnect"/>
            </View>
            <View style={styles.navContainer}>
                <TouchableOpacity style={styles.profileButton}  onPress={toggleDropdown}>
                    <View style={styles.profileIcon} />
                    <Text style={styles.profileText}>{username}</Text>
                    <Ionicons name="chevron-down-outline" size={16} color="black" />
                </TouchableOpacity>
        </View>
      </View>

      {dropdownVisible && (
            <View style={styles.dropdown}>
              <TouchableOpacity style={styles.dropdownOption} onPress={handleEditProfile}>
                <Text style={styles.dropdownText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownOption} onPress={handleDeleteAccount}>
                <Text style={styles.dropdownText}>Delete Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownOption} onPress={handleLogout}>
                <Text style={styles.dropdownText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
    </View>
  );
};
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'green',
        marginLeft: 8,
      },
      searchContainer: {
        flex: 1,
        marginLeft: 16,
      },
      searchInput: {
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
      },
      navContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
        position: 'relative',
      },
      catButton: {
        marginHorizontal: 8,
      },
      activeCatButton: {
        borderBottomWidth: 2,
        borderColor: 'green',
      },
      profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 8,
      },
      profileIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#ccc',
        marginRight: 8,
      },
      profileText: {
        fontSize: 16,
        marginRight: 4,
      },
      dropdown: {
        marginTop: 5,
        alignSelf: 'flex-end', // Aligns the dropdown to the right
        width: 150, // Adjust width as needed
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
      },
      dropdownOption: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
      },
      dropdownText: {
        fontSize: 14,
        color: '#333',
      },
});

export default WebNavBar;