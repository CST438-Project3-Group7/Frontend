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

    return (
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.navContainer}>
                <TouchableOpacity style={[styles.logoContainer, activeCategory === 'feed' && styles.logoContainer]} onPress={() => router.push('/feed')}>
                    <Text style={styles.logoText}>CriticConnect</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.catButton, activeCategory === 'Games' && styles.activeCatButton]} onPress={() => setActiveCategory('Games')}>
                    <Text style={styles.catButtonText}>Games</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.catButton, activeCategory === 'Film' && styles.activeCatButton]} 
                    onPress={() => setActiveCategory('Film')}>
                    <Text style={styles.catButtonText}>Movies</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.catButton, activeCategory === 'Music' && styles.activeCatButton]} 
                    onPress={() => setActiveCategory('Music')}>
                    <Text style={styles.catButtonText}>Music</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
                <TextInput style={styles.searchInput} placeholder="Search CriticConnect"/>
            </View>
            <View style={styles.navContainer}>
                <TouchableOpacity style={styles.profileButton}  onPress={username !== "Guest" ? toggleDropdown: () => {}} >
                    <Text style={styles.profileText}>{username}</Text>
                    <Ionicons name="chevron-down-outline" size={16} color="black" />
                </TouchableOpacity>
                {dropdownVisible && (
            <View style={styles.dropdown}>
              <TouchableOpacity style={styles.dropdownOption} onPress={()=> router.push('/Profile')}>
                <Text style={styles.dropdownText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownOption} onPress={handleLogout}>
                <Text style={styles.dropdownText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        paddingVertical: 15,
        paddingHorizontal: 20,
        zIndex: 1,
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
        fontSize: 24*1.2,
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
        fontSize: 16*1.2,
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
      catButtonText:{
        fontSize: 16*1.2,
        color: 'black',
      },
      profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 25,
      },
      profileIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#ccc',
        marginRight: 8,
      },
      profileText: {
        fontSize: 16*1.2,
        marginRight: 4,
      },
      dropdown: {
        position: 'absolute',
        top: 40,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        zIndex: 1000,
      },
      dropdownOption: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      dropdownText: {
        fontSize: 16*1.2,
      },
});

export default WebNavBar;