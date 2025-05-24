import React from 'react';
import { Tabs } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Home, Search, ShoppingBag, MessageSquare, User, LogOut } from 'lucide-react-native';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';

export default function TabLayout() {
  const { colors } = useThemeStore();
  const { checkAccess, logout, isAuthenticated } = useAuthStore();
  
  // Add error handling and logging
  try {
    console.log("Tab layout rendering, auth state:", { isAuthenticated });
    
    // Verify that the user has customer access
    if (!isAuthenticated || !checkAccess('customer')) {
      console.log("User doesn't have customer access, rendering fallback");
      // Return a minimal fallback instead of null to prevent white screen
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      );
    }
    
    const handleLogout = () => {
      try {
        console.log("Logout initiated");
        logout();
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
    
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            borderTopColor: colors.border,
            backgroundColor: colors.card,
          },
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <LogOut size={20} color={colors.error} />
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: 'Orders',
            tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    );
  } catch (error) {
    console.error("Error in TabLayout:", error);
    // Return a fallback UI if there's an error
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Something went wrong with the navigation.</Text>
        <Text>Please restart the app.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 16,
    padding: 8,
  },
});