import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WebNavBar from './WebNavBar';
import { router,useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const EditProfile = () => {
  const navigation = useNavigation();
  const [editUsername, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [roles, setRoles] = useState('USER');
  const [user, setUser] = useState<User | null>(null);

  interface User {
    username: string;
  }

  useFocusEffect(
    React.useCallback(() => {

      const fetchUserData = async () => {
        try {
          // Get userId from AsyncStorage
          const userId = await AsyncStorage.getItem('userId');

          if (!userId) {
            console.error("No user ID found in AsyncStorage");
            setUser(null);
            return;
          }

          // Fetch user data by ID
          const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/users/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'cors',
          });

          if (!response.ok) {
            throw new Error(`Error fetching user data: ${response.status}`);
          }

          const userData = await response.json();

          console.log("User data fetched:", userData);
          setUser(userData);
        } catch (error) {
          console.error("Error retrieving user data:", error);
        }
      };
      fetchUserData();
    }, [])
  );

  const handleSave = () => {
    if (password !== reEnterPassword) {
      alert('Passwords do not match');
      return;
    }
    const updateUser = async () => {
      try {
        const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({userId, editUsername, password, roles}),
        });
        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const data = await response.json();
        alert('Profile updated successfully');
        router.push('/feed');
      } catch (error) {
        console.error(error);
        alert('An error occurred while updating the profile');
      }
    };

    updateUser();
    console.log('Profile saved:', { editUsername,password,reEnterPassword });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <WebNavBar username={user?.username || "Guest"} />
        <ScrollView style={styles.content}>
          <Text style={styles.title}>Edit Profile</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Username</Text>
                <TextInput
                style={styles.input}
                placeholder="Username"
                value={editUsername}
                onChangeText={setUsername}
                />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
                <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                />
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Re-enter Password</Text>
                <TextInput
                style={styles.input}
                placeholder="Re-enter Password"
                value={reEnterPassword}
                onChangeText={setReEnterPassword}
                secureTextEntry
                autoCapitalize="none"
                />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => router.push('/feed')}>
                  <Text style={styles.saveButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  buttonContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: 'green',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 100,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginRight: 100,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfile;