import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,TextInput, ScrollView } from 'react-native';
import styles from '@/hooks/aMStyles';
import { useSession } from "../../utils/DataContext";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';



const login = () => {


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  function handleLogin() {
    if (username === '' || password === '') {
      setError(true); // Show error message
      setErrorMessage(" Please fill out all required fields before submitting.")
    } else {
      setError(false); 
      //create user object
      const user = {
        "username": username,
        "password": password,
      }
      checkLogin(user);
    
    }
  }

  const checkLogin = async(user)=>{

    try{
      const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/users/username/${user.username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

    if (response.status != 200) {
      setError(true)
      setErrorMessage("Unable to login user. Please try again!")
      
    }else{
      const data = await response.json();
      console.log("User data:", data);

      // Save user ID to AsyncStorage
      await AsyncStorage.setItem('userId', data.userId.toString());

      // Navigate to feed page
      router.push('/feed');
    }
    }catch (error) {
      console.error("Error logging in user:", error);
      //update error messgage UI
      setError(true)
      setErrorMessage("Unable to login user. Please try again!")
    }

  }





  return (
    <View>
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navItemActive} onPress={() => router.push('/login')}>
          <Text style={styles.navTextActive}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItem]} onPress={() => router.push('/signup')}>
           <Text style={[styles.navText, styles.navText]}>Create Account</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={text => setUsername(text)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
          />
        </View>  
        <TouchableOpacity style={styles.submitButton} onPress={() => handleLogin()}>
          <Text style={styles.submitButtonText}>Login</Text>
        </TouchableOpacity>
        {error && (
          <Text style={errorStyle.message}>
           {errorMessage}
          </Text>
        )}
        <TouchableOpacity style={styles.link} onPress={()=> router.push('/signup')}>
          <Text style={styles.linkText}>Don't have an account? Sign Up.</Text>
        </TouchableOpacity>
        <View style={styles.link}>
          <Text>or</Text>
        </View>
      </View>
      </View>
  );
};

export default login;

const errorStyle = StyleSheet.create({

  message: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: "bold",
  },
});