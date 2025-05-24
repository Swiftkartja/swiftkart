import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Card } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Heart, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Settings
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { colors } = useThemeStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  
  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };
  
  const handleEditProfile = () => {
    router.push('/edit-profile');
  };
  
  const handleAddresses = () => {
    router.push('/addresses');
  };
  
  const handlePaymentMethods = () => {
    router.push('/payment-methods');
  };
  
  const handleFavorites = () => {
    router.push('/favorites');
  };
  
  const handleNotifications = () => {
    router.push('/notifications');
  };
  
  const handleHelp = () => {
    router.push('/help');
  };
  
  const handleSettings = () => {
    router.push('/settings');
  };
  
  const menuItems = [
    {
      icon: <MapPin size={20} color={colors.primary} />,
      title: 'My Addresses',
      onPress: handleAddresses,
    },
    {
      icon: <CreditCard size={20} color={colors.primary} />,
      title: 'Payment Methods',
      onPress: handlePaymentMethods,
    },
    {
      icon: <Heart size={20} color={colors.primary} />,
      title: 'Favorites',
      onPress: handleFavorites,
    },
    {
      icon: <Bell size={20} color={colors.primary} />,
      title: 'Notifications',
      onPress: handleNotifications,
    },
    {
      icon: <HelpCircle size={20} color={colors.primary} />,
      title: 'Help & Support',
      onPress: handleHelp,
    },
    {
      icon: <Settings size={20} color={colors.primary} />,
      title: 'Settings',
      onPress: handleSettings,
    },
  ];
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: colors.primary + '20' },
                ]}
              >
                <User size={40} color={colors.primary} />
              </View>
            )}
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: colors.text }]}>
              {user?.name || 'Guest User'}
            </Text>
            <Text style={[styles.email, { color: colors.muted }]}>
              {user?.email || 'guest@example.com'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary + '20' }]}
            onPress={handleEditProfile}
          >
            <Text style={[styles.editButtonText, { color: colors.primary }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <Card
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            elevation={1}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
              </View>
              <ChevronRight size={20} color={colors.muted} />
            </View>
          </Card>
        ))}
      </View>
      
      <View style={styles.themeContainer}>
        <Text style={[styles.themeTitle, { color: colors.text }]}>
          App Theme
        </Text>
        <ThemeToggle />
      </View>
      
      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: colors.error }]}
        onPress={handleLogout}
      >
        <LogOut size={20} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>
          Log Out
        </Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.muted }]}>
          SwiftKart v1.0.0
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
    padding: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuContainer: {
    padding: 20,
    paddingTop: 0,
  },
  menuItem: {
    marginBottom: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  themeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 12,
  },
});