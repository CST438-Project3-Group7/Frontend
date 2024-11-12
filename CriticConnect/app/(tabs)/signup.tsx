import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,TextInput, ScrollView } from 'react-native';
import styles from '@/hooks/aMStyles';
import { router } from "expo-router";
import { GoogleSignin } from '@react-native-google-signin/google-signin';


const signUp = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '340362220149-479mqi43ef9no1cmk88op3d08v10m0vp.apps.googleusercontent.com',
    });
  }, []);

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();
  
    // Try the new style of google-sign in result, from v13+ of that module
    idToken = signInResult.data?.idToken;
    if (!idToken) {
      // if you are using older versions of google-signin, try old style result
      idToken = signInResult.idToken;
    }
    if (!idToken) {
      throw new Error('No ID token found');
    }
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data.token);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
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
      </View>
      </View>
  );
};

export default signUp;