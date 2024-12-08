import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getUserInfoDb } from '../../components/DbFunc';
import styles from '../../hooks/aMStyles';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const login = () => {


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:'973280850643-799591b5eq02v6gcqsp59jneh22atura.apps.googleusercontent.com',
    androidClientId:'973280850643-qcntidlb6onkpao1mkqovo0ugtku336h.apps.googleusercontent.com',
    iosClientId: '',
    scopes: ['profile', 'email'],
  });
  async function handleGoogleSignIn() {
    let user = await AsyncStorage.getItem("@user");
    console.log("local storage currently has: ", JSON.parse(user));
    // if the user hasnt signed in
    if(!user)
    {
      if(response?.type === "success")
      {
        await getGoogleInfo(response.authentication?.accessToken);
        user = await AsyncStorage.getItem("@user");
        user = JSON.parse(user);
        console.log('user info for checking the database is ', user);
        let check = await getUserInfoDb(user.id);
        console.log("user info is", check)
        if(check == null) {
          // user doesnt exist in our db
          router.push('/signup');
        }
        else {
          // user exists
          await AsyncStorage.setItem("@user", JSON.stringify(check));
          navigator.navigate('(tabs)')
        }

      }
    }
    else
    {
      // if the user has signed in
      router.push('/feed');
    }
  }

  const getGoogleInfo = async (token: string | undefined) => {
    if(!token) return;
    console.log("attempting to fetch");
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      );
      console.log("post fetch");
      let user = await response.json();
      console.log("post json change")
      user.username = 'none';
      await AsyncStorage.setItem("@user", JSON.stringify(user));
    } catch(error){
      // error handler
    }
  };

  React.useEffect(() => {

    handleGoogleSignIn();
  }, [response]);

  async function handleDatabaseSignIn() {
    let user = await AsyncStorage.getItem("@userId");
    console.log("local storage currently has: ", JSON.parse(user));
    // if the user hasnt signed in
    if(!user)
    {
      if(response?.type === "success")
      {
        await getGoogleInfo(response.authentication?.accessToken);
        user = await AsyncStorage.getItem("@user");
        user = JSON.parse(user);
        console.log('user info for checking the database is ', user);
        let check = await getUserInfoDb(user.id);
        console.log("user info is", check)
        if(check == null) {
          // user doesnt exist in our db
          router.push('/signup');
        }
        else {
          // user exists
          await AsyncStorage.setItem("@user", JSON.stringify(check));
          navigator.navigate('(tabs)')
        }

      }
    }
    else
    {
      // if the user has signed in
      router.push('/feed');
    }
  }

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


  // Display Buttons Based on Platform 
  const Component = Platform.select({
    // On Android, display this
    native: () => (
      <View style={styles.googleContainer}>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => {
          if (request) {
            promptAsync();
          } else {
            console.log('Google Auth request is not ready');
          }
        }}>
        <View style={styles.buttonContent}>
          {/* Google Logo */}
          <Image
            source={require('../../assets/images/googlelogo.png')}
            style={styles.googleLogo}
          />
          <Text style={styles.googleButtonText}>Sign in</Text>
        </View>
      </TouchableOpacity>
    </View>
),
    // On Web, display the Google button
    default: () => (
      <View style={styles.googleContainer}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => {
            if (request) {
              promptAsync();
            } else {
              console.log('Google Auth request is not ready');
            }
          }}>
          <View style={styles.buttonContent}>
            {/* Google Logo */}
            <Image
              source={require('../../assets/images/googlelogo.png')}
              style={styles.googleLogo}
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </View>
        </TouchableOpacity>
      </View>
  ),
  })();

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
        <View>
        {/* Google Button */}
        {Component}
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