import React from 'react';
import { Redirect } from 'expo-router';
import TabLayout from './(tabs)/_layout';
import { NavigationContainer } from '@react-navigation/native';


export default function Index() {
  return (
    <Redirect href="/home" />
  );
}