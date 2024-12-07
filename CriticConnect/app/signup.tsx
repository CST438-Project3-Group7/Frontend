import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,TextInput, ScrollView,Button } from 'react-native';
import styles from '@/hooks/aMStyles';
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from '@react-native-async-storage/async-storage';

const webClientId = '973280850643-799591b5eq02v6gcqsp59jneh22atura.apps.googleusercontent.com';

WebBrowser.maybeCompleteAuthSession();

const signUp = () => {
  const config={
    webClientId,
    // androidClientId,
  };
  const [request,response,promptAsync] = Google.useAuthRequest(config);
  const getUserProfile=async (token:any)=>{
    if(!token) return;
    try{
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me',{
        headers: {Authrization:`Bearer ${token}`},
      });
      const user = await response.json();
      console.log(user);
    }catch(e){
      console.error(e);
    }
  };
  const handleToken=()=>{
    if(response?.type === 'success'){
      const {authentication} = response;
      const token = authentication?.accessToken;
      console.log("accessToken",token);
      getUserProfile(token)
    }
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  function handleSignup() {
    if (username === '' || password === '') {
      setError(true); // Show error message
      setErrorMessage(" Please fill out all required fields before submitting.")
    } else {
      setError(false); 
      //add user to DB
      const user = {
        "username": username,
        "password": password,
        "roles": "USER"
      }
      sendData(user);
    
    }
  }

  const sendData = async(user)=>{

    try{
      const response = await fetch('https://criticconnect-386d21b2b7d1.herokuapp.com/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(user),
      });

    if (response.status != 200) {
      setError(true)
      setErrorMessage("Unable to add user. Please try again!")
      
    }else{
      const data = await response.json();
      console.log("User data:", data);

      // Save user ID to AsyncStorage
      await AsyncStorage.setItem('userId', data.userId.toString());

      // Navigate to feed page
      router.push('/feed');
    }
    }catch (error) {
      console.error("Error adding user:", error);
      //update error messgage UI
      setError(true)
      setErrorMessage("Unable to add user. Please try again!")
    }

  }
    

  useEffect(() => {
    handleToken();
  },[response]);

  return (
    <View>
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/login')}>
          <Text style={styles.navText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]} onPress={() => router.push('/signup')}>
           <Text style={[styles.navText, styles.navTextActive]}>Create Account</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={text => setUsername(text)}
            style={styles.input}
            placeholder="Username"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            placeholder="Password"
            secureTextEntry
          />
        </View>  
        <TouchableOpacity style={styles.submitButton} onPress={() => handleSignup()}>
          <Text style={styles.submitButtonText}>Create Account</Text>
        </TouchableOpacity>
        {error && (
          <Text style={errorStyle.message}>
           {errorMessage}
          </Text>
        )}
        <TouchableOpacity style={styles.link} onPress={() => router.push('/login')}>
          <Text style={styles.linkText}>Already have an account? Login.</Text>
        </TouchableOpacity>
        <View style={styles.link}>
          <Text>or</Text>
        </View>
        <View>
          <TouchableOpacity onPress={()=> promptAsync()}>
            <Text>Sign in with Google</Text>
          </TouchableOpacity>
          <Text>{JSON.stringify(response)}</Text>
        </View>
      </View>
      </View>
  );
};

export default signUp;

const errorStyle = StyleSheet.create({

  message: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: "bold",
  },
});