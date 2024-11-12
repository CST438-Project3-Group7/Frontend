import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,TextInput, ScrollView } from 'react-native';
import styles from '@/hooks/aMStyles';
import { useSession } from "../../utils/DataContext";
import { router } from "expo-router";



const login = () => {
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
        <TouchableOpacity style={styles.submitButton} onPress={()=>router.push()}>
          <Text style={styles.submitButtonText}>Login</Text>
        </TouchableOpacity>
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