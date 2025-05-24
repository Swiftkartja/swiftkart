import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import { 
  Package, 
  Clock, 
  User, 
  BarChart, 
  Settings,
  ShoppingBag,
  MessageSquare,
  Users
} from 'lucide-react-native';

export default function VendorDashboardLayout() {
  const { checkAccess } = useAuthStore();
  const { colors } = useThemeStore();
  const router = useRouter();
  const pathname = usePathname();
  
  // Verify that the user has vendor access
  if (!checkAccess(['vendor', 'admin'])) {
    return null;
  }
  
  // Determine if we're in the products or services section
  const isProductsSection = pathname.includes('/products') || pathname.includes('/product/') || pathname.includes('/add-product');
  const isServicesSection = pathname.includes('/services') || pathname.includes('/service/') || pathname.includes('/add-service');
  
  // Render tab switcher if we're on the main dashboard, products, or services pages
  const shouldShowTabs = pathname === '/vendor-dashboard' || 
                         pathname === '/vendor-dashboard/products' || 
                         pathname === '/vendor-dashboard/services';
  
  const handleTabPress = (tab: string) => {
    router.push(`/vendor-dashboard/${tab}`);
  };
  
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackTitle: "Back",
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: "Vendor Dashboard",
            headerTitleStyle: { fontWeight: '600' }
          }} 
        />
        <Stack.Screen 
          name="orders" 
          options={{ 
            title: "Orders",
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
          name="products" 
          options={{ 
            title: "Products",
            headerTitleStyle: { fontWeight: '600' }
          }} 
        />
        <Stack.Screen 
          name="product/[id]" 
          options={{ 
            title: "Product Details",
            headerTitleStyle: { fontWeight: '600' }
          }} 
        />
        <Stack.Screen 
          name="add-product" 
          options={{ 
            title: "Add Product",
            headerTitleStyle: { fontWeight: '600' }
          }} 
        />
        <Stack.Screen 
          name="services" 
          options={{ 
            title: "Services",
            headerTitleStyle: { fontWeight: '600' }
          }} 
        />
        <Stack.Screen 
          name="service/[id]" 
          options={{ 
            title: "Service Details",
            headerTitleStyle: { fontWeight: '600' }
          }} 
        />
        <Stack.Screen 
          name="add-service" 
          options={{ 
            title: "Add Service",
            headerTitleStyle: { fontWeight: '600' }
          }} 
        />
        <Stack.Screen 
          name="profile" 
          options={{ 
            title: "Store Profile",
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
          name="settings" 
          options={{ 
            title: "Store Settings",
            headerTitleStyle: { fontWeight: '600' }
          }} 
        />
        <Stack.Screen 
          name="customers" 
          options={{ 
            title: "Customers",
            headerTitleStyle: { fontWeight: '600' }
          }} 
        />
        <Stack.Screen 
          name="messages" 
          options={{ 
            title: "Messages",
            headerTitleStyle: { fontWeight: '600' }
          }} 
        />
      </Stack>
      
      {shouldShowTabs && (
        <View style={[styles.tabContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              pathname === '/vendor-dashboard' && styles.activeTab,
              pathname === '/vendor-dashboard' && { borderBottomColor: colors.primary }
            ]}
            onPress={() => router.push('/vendor-dashboard')}
          >
            <BarChart 
              size={20} 
              color={pathname === '/vendor-dashboard' ? colors.primary : colors.muted} 
            />
            <Text 
              style={[
                styles.tabText, 
                { color: pathname === '/vendor-dashboard' ? colors.primary : colors.muted }
              ]}
            >
              Dashboard
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              isProductsSection && styles.activeTab,
              isProductsSection && { borderBottomColor: colors.primary }
            ]}
            onPress={() => router.push('/vendor-dashboard/products')}
          >
            <Package 
              size={20} 
              color={isProductsSection ? colors.primary : colors.muted} 
            />
            <Text 
              style={[
                styles.tabText, 
                { color: isProductsSection ? colors.primary : colors.muted }
              ]}
            >
              Products
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              isServicesSection && styles.activeTab,
              isServicesSection && { borderBottomColor: colors.primary }
            ]}
            onPress={() => router.push('/vendor-dashboard/services')}
          >
            <Clock 
              size={20} 
              color={isServicesSection ? colors.primary : colors.muted} 
            />
            <Text 
              style={[
                styles.tabText, 
                { color: isServicesSection ? colors.primary : colors.muted }
              ]}
            >
              Services
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});