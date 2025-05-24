import React from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';

export default function RiderDashboardLayout() {
  const { checkAccess } = useAuthStore();
  
  // Verify that the user has rider access
  if (!checkAccess(['rider', 'admin'])) {
    return null;
  }
  
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Rider Dashboard",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="deliveries" 
        options={{ 
          title: "My Deliveries",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="delivery/[id]" 
        options={{ 
          title: "Delivery Details",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="map" 
        options={{ 
          title: "Delivery Map",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="earnings" 
        options={{ 
          title: "My Earnings",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="profile" 
        options={{ 
          title: "My Profile",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: "Settings",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
    </Stack>
  );
}