import React from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';

export default function AdminDashboardLayout() {
  const { checkAccess } = useAuthStore();
  
  // Verify that the user has admin access
  if (!checkAccess('admin')) {
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
          title: "Admin Dashboard",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="users" 
        options={{ 
          title: "Manage Users",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="vendors" 
        options={{ 
          title: "Manage Vendors",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="riders" 
        options={{ 
          title: "Manage Riders",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="orders" 
        options={{ 
          title: "All Orders",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="order/[id]" 
        options={{ 
          title: "Order Details",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="analytics" 
        options={{ 
          title: "Analytics",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="categories" 
        options={{ 
          title: "Categories",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="products" 
        options={{ 
          title: "Products",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="approvals" 
        options={{ 
          title: "Pending Approvals",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: "Admin Settings",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="vendor/[id]" 
        options={{ 
          title: "Vendor Details",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="rider/[id]" 
        options={{ 
          title: "Rider Details",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="user/[id]" 
        options={{ 
          title: "User Details",
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
    </Stack>
  );
}