import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';
import { Mail, Lock, User, Truck, Store, ShieldCheck, ArrowLeft } from 'lucide-react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_PIN_KEY = 'swiftkart_admin_pin';

export default function LoginScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const { 
    login, 
    register, 
    isLoading, 
    resetPassword, 
    verifyResetCode, 
    updatePassword
  } = useAuthStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [showAdminPin, setShowAdminPin] = useState(false);
  
  // Load admin PIN from storage
  useEffect(() => {
    const loadAdminPin = async () => {
      try {
        const pin = await AsyncStorage.getItem(ADMIN_PIN_KEY);
        if (pin) {
          setAdminPin(pin);
        }
      } catch (error) {
        console.error('Error loading admin PIN:', error);
      }
    };
    loadAdminPin();
  }, []);

  const handleAuth = async () => {
    try {
      setError('');
      
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }
      
      if (isLogin) {
        // For admin login, check PIN first
        if (selectedRole === 'admin' && (!adminPin || adminPin.length !== 4)) {
          setShowAdminPin(true);
          return;
        }
        
        await login(email, password, selectedRole);
      } else {
        if (!name) {
          setError('Name is required');
          return;
        }
        await register(name, email, password, selectedRole);
      }
      
      // Navigation is now handled in the AuthProvider in _layout.tsx
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  const handleAdminPinSubmit = async () => {
    try {
      // Validate PIN format
      if (adminPin.length !== 4) {
        Alert.alert('Invalid PIN', 'PIN must be exactly 4 digits');
        return;
      }
      
      // Save PIN to storage
      await AsyncStorage.setItem(ADMIN_PIN_KEY, adminPin);
      
      // Proceed with login
      await login(email, password, selectedRole);
    } catch (error) {
      console.error('Error saving PIN:', error);
      Alert.alert('Error', 'Failed to save PIN. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    try {
      setError('');
      
      if (!email) {
        setError('Email is required');
        return;
      }
      
      await resetPassword(email);
      Alert.alert(
        "Reset Code Sent",
        "For this demo, the reset code is: 123456",
        [{ text: "OK" }]
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  if (showAdminPin) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Admin PIN' }} />
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>
              Enter Admin PIN
            </Text>
            
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Please enter your 4-digit PIN to continue
            </Text>
            
            <Input
              label="PIN"
              placeholder="Enter PIN"
              value={adminPin}
              onChangeText={setAdminPin}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
              style={styles.input}
            />
            
            <Button
              title="Continue"
              onPress={handleAdminPinSubmit}
              loading={isLoading}
              fullWidth
              style={styles.button}
            />
            
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowAdminPin(false)}
            >
              <Text style={[styles.backButtonText, { color: colors.primary }]}>
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ title: isLogin ? 'Login' : 'Register' }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Login/Register form */}
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Mail size={20} color={colors.muted} />}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          
          {!isLogin && (
            <Input
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              leftIcon={<User size={20} color={colors.muted} />}
              style={styles.input}
            />
          )}
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            leftIcon={<Lock size={20} color={colors.muted} />}
            secureTextEntry
            showPasswordToggle
            style={styles.input}
          />
          
          {error && (
            <Text style={[styles.error, { color: colors.error }]}>
              {error}
            </Text>
          )}
          
          <View style={styles.roleSelector}>
            <Text style={[styles.roleLabel, { color: colors.text }]}>
              Role:
            </Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[styles.roleButton, {
                  backgroundColor: selectedRole === 'customer' ? colors.primary : colors.subtle,
                  borderColor: selectedRole === 'customer' ? colors.primary : colors.border
                }]}
                onPress={() => setSelectedRole('customer')}
              >
                <Text style={[styles.roleButtonText, {
                  color: selectedRole === 'customer' ? colors.background : colors.text
                }]}>
                  Customer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, {
                  backgroundColor: selectedRole === 'vendor' ? colors.primary : colors.subtle,
                  borderColor: selectedRole === 'vendor' ? colors.primary : colors.border
                }]}
                onPress={() => setSelectedRole('vendor')}
              >
                <Text style={[styles.roleButtonText, {
                  color: selectedRole === 'vendor' ? colors.background : colors.text
                }]}>
                  Vendor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, {
                  backgroundColor: selectedRole === 'rider' ? colors.primary : colors.subtle,
                  borderColor: selectedRole === 'rider' ? colors.primary : colors.border
                }]}
                onPress={() => setSelectedRole('rider')}
              >
                <Text style={[styles.roleButtonText, {
                  color: selectedRole === 'rider' ? colors.background : colors.text
                }]}>
                  Rider
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, {
                  backgroundColor: selectedRole === 'admin' ? colors.primary : colors.subtle,
                  borderColor: selectedRole === 'admin' ? colors.primary : colors.border
                }]}
                onPress={() => setSelectedRole('admin')}
              >
                <Text style={[styles.roleButtonText, {
                  color: selectedRole === 'admin' ? colors.background : colors.text
                }]}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Button
            title={isLogin ? 'Login' : 'Register'}
            onPress={handleAuth}
            loading={isLoading}
            fullWidth
            style={styles.button}
          />
          
          {!isLogin && (
            <Button
              title="Login instead"
              onPress={toggleAuthMode}
              variant="outline"
              fullWidth
              style={styles.button}
            />
          )}
          
          {isLogin && (
            <Button
              title="Register instead"
              onPress={toggleAuthMode}
              variant="outline"
              fullWidth
              style={styles.button}
            />
          )}
          
          {isLogin && (
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  roleSelector: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  roleButtonText: {
    fontSize: 14,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
  },
});