import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,TextInput, ScrollView,Button,Platform,Image } from 'react-native';
import styles from '@/hooks/aMStyles';
import { router } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getUserInfoDb } from '../../components/DbFunc';
import AsyncStorage from '@react-native-async-storage/async-storage';

const webClientId = '973280850643-799591b5eq02v6gcqsp59jneh22atura.apps.googleusercontent.com';
const androidClientId= '973280850643-qcntidlb6onkpao1mkqovo0ugtku336h.apps.googleusercontent.com';

WebBrowser.maybeCompleteAuthSession();

const SignUp = () => {
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
          // router.push('/signup');
          console.log("User data:", user);
          console.log("User token, user does not exists if statement", user.accessToken);
        }
        else {
          // user exists
          await AsyncStorage.setItem("@user", JSON.stringify(check));
          // router.push('/feed');
          console.log("User data:", user);
          console.log("User token, user exists if statement", data.accessToken);
        }

      }else{
        //auto log in if the user exists in our database as a normal user
        console.log("Google sign in failed");
      }
    }
    else
    {
      // if the user has signed in
      // router.push('/feed');
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

  const handletemplogout = async() => {
    // console.log("This is the user",await AsyncStorage.getItem('@user'));
    // console.log("This is just supposed to be the userId",await AsyncStorage.getItem('@userId'));
    await AsyncStorage.removeItem('@user');
    await AsyncStorage.removeItem('userId');  
  }

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
        {/* <TouchableOpacity onPress={()=> handletemplogout()}>
          <Text>logout any async storage user</Text>
        </TouchableOpacity> */}
        {/* Google Button */}
        {Component}
        <View style={styles.link}>
          <Text>or</Text>
        </View>
        <View style={styles.link}>
          <TouchableOpacity style={styles.guestButton} onPress={() => router.push('/feed')}>
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
  );
};

export default SignUp;

const errorStyle = StyleSheet.create({

  message: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: "bold",
  },
});