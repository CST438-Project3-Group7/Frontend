import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const user = await AsyncStorage.getItem('@user');
      const userId = await AsyncStorage.getItem('userId');
      if (user || userId) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          display: Platform.OS === 'web' ? 'none' : 'flex',
        },
      }}
    >
      <Tabs.Screen name="home" href={isAuthenticated ? null : undefined} options={{ headerShown: false }} />
      <Tabs.Screen name="login" href={isAuthenticated ? null : undefined} options={{ headerShown: false }} />
      <Tabs.Screen name="signup" href={isAuthenticated ? null : undefined} options={{ headerShown: false }} />
      <Tabs.Screen name="cmovies" options={{ headerShown: false }} />
      <Tabs.Screen name="cgames" options={{ headerShown: false }} />
      <Tabs.Screen name="cmusic" options={{ headerShown: false }} />
      <Tabs.Screen name="feed" options={{ headerShown: false }} />
      <Tabs.Screen name="Profile" options={{ href: null }} />
      <Tabs.Screen name="WebNavBar" options={{ href: null }} />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
};

export default TabLayout;