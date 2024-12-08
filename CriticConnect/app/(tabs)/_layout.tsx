import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {

  return (
    <Tabs>

        <Tabs.Screen name="Home" options={{ headerShown: false }} />
        <Tabs.Screen name="Login" options={{ headerShown: false }} />
        <Tabs.Screen name="Signup" options={{ headerShown: false }} />
        <Tabs.Screen 
        name="post" 
        options={{ 
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="create-outline" color={color} size={size} />
          ),
        }} 
      />
        <Tabs.Screen 
        name="feed" 
        options={{ 
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size} />
          ),
        }} 
      />
         <Tabs.Screen 
        name="favorites" 
        options={{ 
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }} 
      />
        <Tabs.Screen name="Profile" options={{ headerShown: false }} />


    </Tabs>
  );
}