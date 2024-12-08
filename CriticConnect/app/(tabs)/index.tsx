import React from 'react';
import { Redirect } from 'expo-router';
import RootLayout from './(tabs)/_layout';

export default function Index() {
  return (
      <Redirect href="/home" />
  );
}