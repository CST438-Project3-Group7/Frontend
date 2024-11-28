import React from 'react';
import { Tabs } from 'expo-router';

export default function RootLayout() {

  return (
    <Tabs>
        <Tabs.Screen name="home" options={{ headerShown: false }} />
        <Tabs.Screen name="login" options={{ headerShown: false }} />
        <Tabs.Screen name="signup" options={{ headerShown: false }} />
        <Tabs.Screen name="cmovies" options={{ headerShown: false }} />
        <Tabs.Screen name="cgames" options={{ headerShown: false }} />
        <Tabs.Screen name="cmusic" options={{ headerShown: false }} />
        <Tabs.Screen name="feed" options={{ headerShown: false }} />
        <Tabs.Screen name="EditProfile" options={{ headerShown: false }} />
    </Tabs>
  );
}