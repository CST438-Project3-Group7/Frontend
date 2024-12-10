import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PhoneNavBar = ({ username }) => {
  const [activeCategory, setActiveCategory] = useState('feed');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const toggleCategoryDropdown = () => {
    setCategoryDropdownVisible(!categoryDropdownVisible);
  };

  const handleLogout = async () => {
    console.log('Logout');
    setDropdownVisible(false);
    try {
      await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('@user');
      router.push('/login');
    } catch (error) {
      console.error('Error removing user ID from AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.navContainer}>
          <TouchableOpacity
            style={[styles.logoContainer, activeCategory === 'feed' && styles.logoContainer]}
            onPress={() => router.push('/feed')}
          >
            <Text style={styles.logoText}>CriticConnect</Text>
          </TouchableOpacity>
          <View style={styles.categoryButtonContainer}>
            <TouchableOpacity style={styles.categoryButton} onPress={toggleCategoryDropdown}>
              <Text style={styles.categoryButtonText}>Categories</Text>
              <Ionicons name="chevron-down-outline" size={16} color="black" />
            </TouchableOpacity>
            {categoryDropdownVisible && (
              <View style={styles.categoryDropdown}>
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => {
                    setActiveCategory('Games');
                    setCategoryDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownText}>Games</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => {
                    setActiveCategory('Films');
                    setCategoryDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownText}>Film</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => {
                    setActiveCategory('Books');
                    setCategoryDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownText}>Books</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View style={styles.navContainer}>
          {username ? (
            <TouchableOpacity style={styles.profileButton} onPress={toggleDropdown}>
              <Text style={styles.profileText}>{username}</Text>
              <Ionicons name="chevron-down-outline" size={16} color="black" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.authButton} onPress={() => router.push('/login')}>
                <Text style={styles.authButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.authButton} onPress={() => router.push('/signup')}>
                <Text style={styles.authButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </>
          )}
          {dropdownVisible && username && (
            <View style={styles.dropdown}>
              <TouchableOpacity style={styles.dropdownOption} onPress={() => router.push('/Profile')}>
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
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 5,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginLeft: 8,
  },
  categoryButtonContainer: {
    position: 'relative',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  categoryButtonText: {
    fontSize: 16,
    marginRight: 4,
  },
  categoryDropdown: {
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
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 16,
    marginRight: 4,
  },
  authButton: {
    marginHorizontal: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  authButtonText: {
    fontSize: 16,
    color: 'black',
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
    fontSize: 16,
  },
});

export default PhoneNavBar;