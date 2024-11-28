import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,TextInput, ScrollView,Button } from 'react-native';
import styles from '@/hooks/aMStyles';
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

const webClientId = '973280850643-799591b5eq02v6gcqsp59jneh22atura.apps.googleusercontent.com';

WebBrowser.maybeCompleteAuthSession();

const signUp = () => {
  const config={
    webClientId,
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
            style={styles.input}
            placeholder="Username"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            keyboardType="email-address"
            autoComplete="email"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
          />
        </View>  
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Create Account</Text>
        </TouchableOpacity>
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