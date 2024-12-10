import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const TabLayout = () => {

  return (
    <Tabs
      screenOptions={{
      tabBarStyle: {
      display: Platform.OS === 'web' ? 'none' : 'flex',
      },
      }}
    >
      <Tabs.Screen 
      name="home" 
      options={{ 
        headerShown: false, 
        href: null,
        tabBarIcon: ({ color, size }) => (
        <Ionicons name="home-outline" color={color} size={size} />
        ),
      }} 
      />
      <Tabs.Screen name="login" options={{ headerShown: false, href: null }} />
      <Tabs.Screen name="signup" options={{ headerShown: false, href: null }} />
      <Tabs.Screen name="feed" options={{ headerShown: false }} />
      <Tabs.Screen
        name="feed"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen name="Profile" options={{ headerShown: false, href: null }} />
      <Tabs.Screen name="WebNavBar" options={{ href: null }} />
      <Tabs.Screen name="PhoneNavBar" options={{ href: null }} />
      <Tabs.Screen
      name="post"
      options={{
      headerShown: false,
      tabBarIcon: ({ color, size }) => (
      <Ionicons name="add-circle-outline" color={color} size={size} />
      ),
      }}
      />
      <Tabs.Screen name="favorites" options={{ headerShown: false }} />
      <Tabs.Screen name="comments" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
};

export default TabLayout;