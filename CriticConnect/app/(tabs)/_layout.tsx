import React from 'react';
import { Tabs } from 'expo-router';

export default function RootLayout() {

  return (
    <Tabs>

        <Tabs.Screen name="Home" options={{ headerShown: false }} />
        <Tabs.Screen name="Login" options={{ headerShown: false }} />
        <Tabs.Screen name="Signup" options={{ headerShown: false }} />
        <Tabs.Screen name="Favorites" options={{ headerShown: false }} />
        <Tabs.Screen name="Feed" options={{ headerShown: false }} />
        <Tabs.Screen name="Profile" options={{ headerShown: false }} />
        <Tabs.Screen name="post" options={{ headerShown: false }} />

    </Tabs>
  );
}