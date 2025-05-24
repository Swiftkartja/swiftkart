import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Switch, 
  TouchableOpacity, 
  Alert,
  Modal,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Card } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { 
  Bell, 
  Globe, 
  Lock, 
  Shield, 
  HelpCircle, 
  Info, 
  LogOut,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  X
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Available languages
const languages = [
  { id: 'en', name: 'English', code: 'en-US' },
  { id: 'es', name: 'Spanish', code: 'es' },
  { id: 'fr', name: 'French', code: 'fr' },
  { id: 'de', name: 'German', code: 'de' },
  { id: 'pt', name: 'Portuguese', code: 'pt' },
  { id: 'ja', name: 'Japanese', code: 'ja' },
];

// Notification settings storage key
const NOTIFICATION_SETTINGS_KEY = 'swiftkart_notification_settings';
const LANGUAGE_SETTINGS_KEY = 'swiftkart_language_settings';

export default function SettingsScreen() {
  const { colors, mode, setMode } = useThemeStore();
  const { logout } = useAuthStore();
  const router = useRouter();
  
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);
  
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);
  
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  
  // Load notification settings from storage
  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        const settingsJson = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
        if (settingsJson) {
          const settings = JSON.parse(settingsJson);
          setPushNotifications(settings.push ?? true);
          setEmailNotifications(settings.email ?? true);
          setOrderUpdates(settings.orders ?? true);
          setPromotions(settings.promotions ?? false);
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    };
    
    const loadLanguageSettings = async () => {
      try {
        const languageJson = await AsyncStorage.getItem(LANGUAGE_SETTINGS_KEY);
        if (languageJson) {
          const langId = JSON.parse(languageJson);
          const language = languages.find(lang => lang.id === langId);
          if (language) {
            setSelectedLanguage(language);
          }
        }
      } catch (error) {
        console.error('Error loading language settings:', error);
      }
    };
    
    loadNotificationSettings();
    loadLanguageSettings();
  }, []);
  
  // Save notification settings when they change
  useEffect(() => {
    const saveNotificationSettings = async () => {
      try {
        const settings = {
          push: pushNotifications,
          email: emailNotifications,
          orders: orderUpdates,
          promotions: promotions
        };
        await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving notification settings:', error);
      }
    };
    
    saveNotificationSettings();
  }, [pushNotifications, emailNotifications, orderUpdates, promotions]);
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: () => logout(),
          style: 'destructive'
        }
      ]
    );
  };
  
  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    
    // Show confirmation
    Alert.alert(
      'Theme Updated',
      `The app theme has been set to ${newMode.charAt(0).toUpperCase() + newMode.slice(1)} mode.`,
      [{ text: 'OK' }]
    );
  };
  
  const handleLanguageSelect = async (language: typeof languages[0]) => {
    setIsLanguageLoading(true);
    
    try {
      // Save language preference
      await AsyncStorage.setItem(LANGUAGE_SETTINGS_KEY, JSON.stringify(language.id));
      
      // Update state
      setSelectedLanguage(language);
      
      // Simulate language change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close modal and show success message
      setShowLanguageModal(false);
      Alert.alert(
        'Language Updated',
        `The app language has been set to ${language.name}.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update language. Please try again.');
    } finally {
      setIsLanguageLoading(false);
    }
  };
  
  const handleHelpSupport = () => {
    router.push('/help');
  };
  
  // Privacy Settings Modal
  const PrivacySettingsModal = () => (
    <Modal
      visible={showPrivacyModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowPrivacyModal(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Privacy Settings</Text>
            <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Data Collection
                </Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  Allow SwiftKart to collect usage data to improve services
                </Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {
                  Alert.alert('Data Collection', 'This setting has been updated.');
                }}
                trackColor={{ false: colors.muted + '50', true: colors.primary + '50' }}
                thumbColor={true ? colors.primary : colors.muted}
              />
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Location Services
                </Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  Allow SwiftKart to access your location
                </Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {
                  Alert.alert('Location Services', 'This setting has been updated.');
                }}
                trackColor={{ false: colors.muted + '50', true: colors.primary + '50' }}
                thumbColor={true ? colors.primary : colors.muted}
              />
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Personalized Ads
                </Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  Allow SwiftKart to show personalized ads
                </Text>
              </View>
              <Switch
                value={false}
                onValueChange={() => {
                  Alert.alert('Personalized Ads', 'This setting has been updated.');
                }}
                trackColor={{ false: colors.muted + '50', true: colors.primary + '50' }}
                thumbColor={false ? colors.primary : colors.muted}
              />
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                Alert.alert(
                  'Delete Account',
                  'Are you sure you want to delete your account? This action cannot be undone.',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel'
                    },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => {
                        Alert.alert('Account Deletion', 'Your account deletion request has been submitted. Our team will process it within 24 hours.');
                        setShowPrivacyModal(false);
                      }
                    }
                  ]
                );
              }}
            >
              <Text style={[styles.actionButtonText, { color: colors.error }]}>
                Delete My Account
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                Alert.alert('Data Download', 'Your data download request has been submitted. You will receive an email with your data within 24 hours.');
              }}
            >
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                Download My Data
              </Text>
            </TouchableOpacity>
            
            <Text style={[styles.privacyText, { color: colors.muted }]}>
              By using SwiftKart, you agree to our Privacy Policy and Terms of Service. We collect and process your data as described in our Privacy Policy.
            </Text>
          </ScrollView>
          
          <Button
            title="Save Changes"
            onPress={() => {
              setShowPrivacyModal(false);
              Alert.alert('Privacy Settings', 'Your privacy settings have been updated.');
            }}
            style={styles.modalButton}
          />
        </View>
      </View>
    </Modal>
  );
  
  // Security Settings Modal
  const SecuritySettingsModal = () => (
    <Modal
      visible={showSecurityModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSecurityModal(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Security Settings</Text>
            <TouchableOpacity onPress={() => setShowSecurityModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <TouchableOpacity 
              style={styles.securityItem}
              onPress={() => {
                Alert.alert('Change Password', 'This feature will be available soon.');
              }}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Change Password
                </Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  Update your account password
                </Text>
              </View>
              <ChevronRight size={20} color={colors.muted} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Two-Factor Authentication
                </Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  Add an extra layer of security
                </Text>
              </View>
              <Switch
                value={false}
                onValueChange={() => {
                  Alert.alert('Two-Factor Authentication', 'This feature will be available soon.');
                }}
                trackColor={{ false: colors.muted + '50', true: colors.primary + '50' }}
                thumbColor={false ? colors.primary : colors.muted}
              />
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Biometric Login
                </Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  Use fingerprint or face recognition
                </Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {
                  Alert.alert('Biometric Login', 'This setting has been updated.');
                }}
                trackColor={{ false: colors.muted + '50', true: colors.primary + '50' }}
                thumbColor={true ? colors.primary : colors.muted}
              />
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity 
              style={styles.securityItem}
              onPress={() => {
                Alert.alert('Manage Devices', 'This feature will be available soon.');
              }}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Manage Devices
                </Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  See devices logged into your account
                </Text>
              </View>
              <ChevronRight size={20} color={colors.muted} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity 
              style={styles.securityItem}
              onPress={() => {
                Alert.alert('Login Activity', 'This feature will be available soon.');
              }}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Login Activity
                </Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  Review recent login activity
                </Text>
              </View>
              <ChevronRight size={20} color={colors.muted} />
            </TouchableOpacity>
          </ScrollView>
          
          <Button
            title="Save Changes"
            onPress={() => {
              setShowSecurityModal(false);
              Alert.alert('Security Settings', 'Your security settings have been updated.');
            }}
            style={styles.modalButton}
          />
        </View>
      </View>
    </Modal>
  );
  
  // About Modal
  const AboutModal = () => (
    <Modal
      visible={showAboutModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAboutModal(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>About SwiftKart</Text>
            <TouchableOpacity onPress={() => setShowAboutModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <View style={styles.aboutLogoContainer}>
              <Text style={[styles.logoText, { color: colors.primary }]}>SwiftKart</Text>
              <Text style={[styles.versionText, { color: colors.muted }]}>Version 1.0.0</Text>
            </View>
            
            <Text style={[styles.aboutSectionTitle, { color: colors.text }]}>
              About Us
            </Text>
            <Text style={[styles.aboutText, { color: colors.text }]}>
              SwiftKart is an all-in-one mobile-first ordering and service platform tailored for Jamaica. We connect customers with local vendors and service providers, making it easy to order food, groceries, and other products, as well as book services like house cleaning and car washing.
            </Text>
            
            <Text style={[styles.aboutSectionTitle, { color: colors.text }]}>
              Our Mission
            </Text>
            <Text style={[styles.aboutText, { color: colors.text }]}>
              Our mission is to empower local businesses and provide convenient, reliable services to customers across Jamaica. We aim to create a seamless experience that benefits everyone in our ecosystem.
            </Text>
            
            <TouchableOpacity 
              style={styles.aboutLink}
              onPress={() => {
                Alert.alert('Terms of Service', 'This feature will be available soon.');
              }}
            >
              <Text style={[styles.aboutLinkText, { color: colors.primary }]}>
                Terms of Service
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.aboutLink}
              onPress={() => {
                Alert.alert('Privacy Policy', 'This feature will be available soon.');
              }}
            >
              <Text style={[styles.aboutLinkText, { color: colors.primary }]}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.aboutLink}
              onPress={() => {
                router.push('/help');
                setShowAboutModal(false);
              }}
            >
              <Text style={[styles.aboutLinkText, { color: colors.primary }]}>
                Contact Us
              </Text>
            </TouchableOpacity>
            
            <Text style={[styles.copyrightText, { color: colors.muted }]}>
              © 2023 SwiftKart LLC. All rights reserved.
            </Text>
          </ScrollView>
          
          <Button
            title="Close"
            onPress={() => setShowAboutModal(false)}
            style={styles.modalButton}
          />
        </View>
      </View>
    </Modal>
  );
  
  // Language Selection Modal
  const LanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Language</Text>
            <TouchableOpacity 
              onPress={() => setShowLanguageModal(false)}
              disabled={isLanguageLoading}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          {isLanguageLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.text }]}>
                Changing language...
              </Text>
            </View>
          ) : (
            <FlatList
              data={languages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageItem,
                    selectedLanguage.id === item.id && { backgroundColor: colors.primary + '20' }
                  ]}
                  onPress={() => handleLanguageSelect(item)}
                >
                  <Text 
                    style={[
                      styles.languageName, 
                      { 
                        color: selectedLanguage.id === item.id ? colors.primary : colors.text,
                        fontWeight: selectedLanguage.id === item.id ? '600' : '400'
                      }
                    ]}
                  >
                    {item.name}
                  </Text>
                  {selectedLanguage.id === item.id && (
                    <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
              style={styles.languageList}
            />
          )}
        </View>
      </View>
    </Modal>
  );
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ title: 'Settings' }} />
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Appearance
        </Text>
        
        <Card style={styles.card} elevation={1}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Theme
              </Text>
              <Text style={[styles.settingDescription, { color: colors.muted }]}>
                Choose your preferred theme
              </Text>
            </View>
            <ThemeToggle />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity
            style={[
              styles.themeOption,
              mode === 'light' && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => handleThemeChange('light')}
          >
            <Sun size={20} color={mode === 'light' ? colors.primary : colors.muted} />
            <Text
              style={[
                styles.themeText,
                {
                  color: mode === 'light' ? colors.primary : colors.text,
                  fontWeight: mode === 'light' ? '600' : '400',
                },
              ]}
            >
              Light
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.themeOption,
              mode === 'dark' && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => handleThemeChange('dark')}
          >
            <Moon size={20} color={mode === 'dark' ? colors.primary : colors.muted} />
            <Text
              style={[
                styles.themeText,
                {
                  color: mode === 'dark' ? colors.primary : colors.text,
                  fontWeight: mode === 'dark' ? '600' : '400',
                },
              ]}
            >
              Dark
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.themeOption,
              mode === 'system' && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => handleThemeChange('system')}
          >
            <Monitor size={20} color={mode === 'system' ? colors.primary : colors.muted} />
            <Text
              style={[
                styles.themeText,
                {
                  color: mode === 'system' ? colors.primary : colors.text,
                  fontWeight: mode === 'system' ? '600' : '400',
                },
              ]}
            >
              System
            </Text>
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Notifications
        </Text>
        
        <Card style={styles.card} elevation={1}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Push Notifications
              </Text>
              <Text style={[styles.settingDescription, { color: colors.muted }]}>
                Receive push notifications
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={(value) => {
                setPushNotifications(value);
                Alert.alert('Notifications', `Push notifications ${value ? 'enabled' : 'disabled'}.`);
              }}
              trackColor={{ false: colors.muted + '50', true: colors.primary + '50' }}
              thumbColor={pushNotifications ? colors.primary : colors.muted}
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Email Notifications
              </Text>
              <Text style={[styles.settingDescription, { color: colors.muted }]}>
                Receive email notifications
              </Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={(value) => {
                setEmailNotifications(value);
                Alert.alert('Notifications', `Email notifications ${value ? 'enabled' : 'disabled'}.`);
              }}
              trackColor={{ false: colors.muted + '50', true: colors.primary + '50' }}
              thumbColor={emailNotifications ? colors.primary : colors.muted}
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Order Updates
              </Text>
              <Text style={[styles.settingDescription, { color: colors.muted }]}>
                Receive updates about your orders
              </Text>
            </View>
            <Switch
              value={orderUpdates}
              onValueChange={(value) => {
                setOrderUpdates(value);
                Alert.alert('Notifications', `Order updates ${value ? 'enabled' : 'disabled'}.`);
              }}
              trackColor={{ false: colors.muted + '50', true: colors.primary + '50' }}
              thumbColor={orderUpdates ? colors.primary : colors.muted}
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Promotions & Offers
              </Text>
              <Text style={[styles.settingDescription, { color: colors.muted }]}>
                Receive promotions and special offers
              </Text>
            </View>
            <Switch
              value={promotions}
              onValueChange={(value) => {
                setPromotions(value);
                Alert.alert('Notifications', `Promotions and offers ${value ? 'enabled' : 'disabled'}.`);
              }}
              trackColor={{ false: colors.muted + '50', true: colors.primary + '50' }}
              thumbColor={promotions ? colors.primary : colors.muted}
            />
          </View>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          General
        </Text>
        
        <Card style={styles.card} elevation={1}>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.settingIconContainer}>
              <Globe size={20} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Language
              </Text>
              <Text style={[styles.settingValue, { color: colors.muted }]}>
                {selectedLanguage.name}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowPrivacyModal(true)}
          >
            <View style={styles.settingIconContainer}>
              <Lock size={20} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Privacy Settings
              </Text>
              <Text style={[styles.settingDescription, { color: colors.muted }]}>
                Manage your privacy preferences
              </Text>
            </View>
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowSecurityModal(true)}
          >
            <View style={styles.settingIconContainer}>
              <Shield size={20} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Security
              </Text>
              <Text style={[styles.settingDescription, { color: colors.muted }]}>
                Manage your security settings
              </Text>
            </View>
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleHelpSupport}
          >
            <View style={styles.settingIconContainer}>
              <HelpCircle size={20} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Help & Support
              </Text>
              <Text style={[styles.settingDescription, { color: colors.muted }]}>
                Get help and contact support
              </Text>
            </View>
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowAboutModal(true)}
          >
            <View style={styles.settingIconContainer}>
              <Info size={20} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                About
              </Text>
              <Text style={[styles.settingDescription, { color: colors.muted }]}>
                App version, terms, and policies
              </Text>
            </View>
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.logoutContainer}>
        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="outline"
          leftIcon={<LogOut size={18} color={colors.error} />}
          style={[styles.logoutButton, { borderColor: colors.error }]}
          textStyle={{ color: colors.error }}
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.muted }]}>
          SwiftKart v1.0.0
        </Text>
      </View>
      
      {/* Modals */}
      <LanguageModal />
      <PrivacySettingsModal />
      <SecuritySettingsModal />
      <AboutModal />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  themeText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutContainer: {
    padding: 16,
    paddingTop: 8,
  },
  logoutButton: {
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 12,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalBody: {
    padding: 16,
  },
  modalButton: {
    margin: 16,
  },
  // Language Modal Styles
  languageList: {
    maxHeight: 300,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  languageName: {
    fontSize: 16,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Security Modal Styles
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  // Privacy Modal Styles
  actionButton: {
    padding: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  privacyText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
    textAlign: 'center',
  },
  // About Modal Styles
  aboutLogoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  versionText: {
    fontSize: 14,
  },
  aboutSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  aboutLink: {
    padding: 12,
    marginVertical: 4,
  },
  aboutLinkText: {
    fontSize: 16,
    fontWeight: '500',
  },
  copyrightText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  // Loading styles
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});