import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  Lock, 
  Shield, 
  Globe, 
  DollarSign, 
  Truck, 
  Store, 
  ChevronRight,
  Smartphone,
  Mail,
  AlertTriangle
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  
  const [isStoreOpen, setIsStoreOpen] = useState(user?.vendorInfo?.isOpen || false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => {
            logout();
            router.replace('/auth/login');
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleChangePassword = () => {
    // In a real app, this would navigate to a change password screen
    Alert.alert(
      "Change Password",
      "This feature is not implemented in the demo."
    );
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            // In a real app, this would call an API to delete the account
            Alert.alert(
              "Account Deleted",
              "Your account has been deleted successfully.",
              [
                { 
                  text: "OK", 
                  onPress: () => {
                    logout();
                    router.replace('/auth/login');
                  }
                }
              ]
            );
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const toggleStoreOpen = () => {
    setIsStoreOpen(!isStoreOpen);
    // In a real app, this would update the store status in the backend
  };
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ title: 'Settings' }} />
      
      <View style={styles.header}>
        <Settings size={24} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Store Settings
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Store Status
        </Text>
        
        <Card
          style={[styles.card, { backgroundColor: colors.card }]}
          elevation={1}
        >
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Store size={20} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Store Open
              </Text>
            </View>
            
            <Switch
              value={isStoreOpen}
              onValueChange={toggleStoreOpen}
              trackColor={{ false: colors.border, true: colors.primary + '70' }}
              thumbColor={isStoreOpen ? colors.primary : colors.muted}
            />
          </View>
          
          <Text style={[styles.settingDescription, { color: colors.muted }]}>
            When turned off, customers won't be able to place new orders
          </Text>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Appearance
        </Text>
        
        <Card
          style={[styles.card, { backgroundColor: colors.card }]}
          elevation={1}
        >
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              {isDark ? (
                <Moon size={20} color={colors.primary} />
              ) : (
                <Sun size={20} color={colors.primary} />
              )}
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Dark Mode
              </Text>
            </View>
            
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary + '70' }}
              thumbColor={isDark ? colors.primary : colors.muted}
            />
          </View>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Notifications
        </Text>
        
        <Card
          style={[styles.card, { backgroundColor: colors.card }]}
          elevation={1}
        >
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                All Notifications
              </Text>
            </View>
            
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary + '70' }}
              thumbColor={notificationsEnabled ? colors.primary : colors.muted}
            />
          </View>
          
          <View 
            style={[
              styles.divider, 
              { backgroundColor: colors.border },
            ]} 
          />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Mail size={20} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Email Notifications
              </Text>
            </View>
            
            <Switch
              value={emailNotificationsEnabled}
              onValueChange={setEmailNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary + '70' }}
              thumbColor={emailNotificationsEnabled ? colors.primary : colors.muted}
              disabled={!notificationsEnabled}
            />
          </View>
          
          <View 
            style={[
              styles.divider, 
              { backgroundColor: colors.border },
            ]} 
          />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Smartphone size={20} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Push Notifications
              </Text>
            </View>
            
            <Switch
              value={pushNotificationsEnabled}
              onValueChange={setPushNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary + '70' }}
              thumbColor={pushNotificationsEnabled ? colors.primary : colors.muted}
              disabled={!notificationsEnabled}
            />
          </View>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Business Settings
        </Text>
        
        <Card
          style={[styles.card, { backgroundColor: colors.card }]}
          elevation={1}
        >
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/vendor-dashboard/profile')}
          >
            <View style={styles.settingInfo}>
              <Store size={20} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Store Profile
              </Text>
            </View>
            
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
          
          <View 
            style={[
              styles.divider, 
              { backgroundColor: colors.border },
            ]} 
          />
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/vendor-dashboard/products')}
          >
            <View style={styles.settingInfo}>
              <Globe size={20} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Products
              </Text>
            </View>
            
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
          
          <View 
            style={[
              styles.divider, 
              { backgroundColor: colors.border },
            ]} 
          />
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert("Payment Settings", "This feature is not implemented in the demo.")}
          >
            <View style={styles.settingInfo}>
              <DollarSign size={20} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Payment Settings
              </Text>
            </View>
            
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
          
          <View 
            style={[
              styles.divider, 
              { backgroundColor: colors.border },
            ]} 
          />
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert("Delivery Settings", "This feature is not implemented in the demo.")}
          >
            <View style={styles.settingInfo}>
              <Truck size={20} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Delivery Settings
              </Text>
            </View>
            
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Account
        </Text>
        
        <Card
          style={[styles.card, { backgroundColor: colors.card }]}
          elevation={1}
        >
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangePassword}
          >
            <View style={styles.settingInfo}>
              <Lock size={20} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Change Password
              </Text>
            </View>
            
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
          
          <View 
            style={[
              styles.divider, 
              { backgroundColor: colors.border },
            ]} 
          />
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert("Privacy Policy", "This feature is not implemented in the demo.")}
          >
            <View style={styles.settingInfo}>
              <Shield size={20} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Privacy Policy
              </Text>
            </View>
            
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
          
          <View 
            style={[
              styles.divider, 
              { backgroundColor: colors.border },
            ]} 
          />
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleLogout}
          >
            <View style={styles.settingInfo}>
              <LogOut size={20} color={colors.error} />
              <Text style={[styles.settingLabel, { color: colors.error }]}>
                Logout
              </Text>
            </View>
            
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.dangerSection}>
        <Card
          style={[styles.dangerCard, { backgroundColor: colors.error + '10' }]}
          elevation={1}
        >
          <View style={styles.dangerHeader}>
            <AlertTriangle size={20} color={colors.error} />
            <Text style={[styles.dangerTitle, { color: colors.error }]}>
              Danger Zone
            </Text>
          </View>
          
          <Text style={[styles.dangerDescription, { color: colors.muted }]}>
            Once you delete your account, there is no going back. Please be certain.
          </Text>
          
          <Button
            title="Delete Account"
            onPress={handleDeleteAccount}
            variant="danger"
            style={styles.deleteButton}
          />
        </Card>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.muted }]}>
          SwiftKart Vendor v1.0.0
        </Text>
        <Text style={[styles.footerText, { color: colors.muted }]}>
          © 2023 SwiftKart. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  section: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 32,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  dangerSection: {
    padding: 16,
    paddingTop: 8,
  },
  dangerCard: {
    padding: 16,
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  dangerDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  deleteButton: {
    marginTop: 8,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 40 : 16,
  },
  footerText: {
    fontSize: 12,
    marginBottom: 4,
  },
});