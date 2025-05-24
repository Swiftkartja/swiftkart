import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Camera, User, Mail, Phone, MapPin, Edit2 } from 'lucide-react-native';

export default function EditProfileScreen() {
  const { colors } = useThemeStore();
  const { user, updateUser, isLoading } = useAuthStore();
  const router = useRouter();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  
  const handleSave = async () => {
    try {
      if (!name.trim()) {
        Alert.alert('Error', 'Name is required');
        return;
      }
      
      if (!email.trim()) {
        Alert.alert('Error', 'Email is required');
        return;
      }
      
      await updateUser({
        name,
        email,
        phone,
        bio,
      });
      
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update profile');
    }
  };
  
  const handleChangeAvatar = () => {
    // In a real app, this would open the image picker
    Alert.alert('Change Avatar', 'This would open the image picker in a real app');
  };
  
  const handleManageAddresses = () => {
    router.push('/addresses');
  };
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ title: 'Edit Profile' }} />
      
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : { uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' }
            }
            style={styles.avatar}
          />
          <TouchableOpacity
            style={[styles.editAvatarButton, { backgroundColor: colors.primary }]}
            onPress={handleChangeAvatar}
          >
            <Camera size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.username, { color: colors.text }]}>
          {user?.name}
        </Text>
        <Text style={[styles.userRole, { color: colors.muted }]}>
          {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
        </Text>
      </View>
      
      <View style={styles.form}>
        <Input
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          leftIcon={<User size={20} color={colors.muted} />}
        />
        
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          leftIcon={<Mail size={20} color={colors.muted} />}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Input
          label="Phone"
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          leftIcon={<Phone size={20} color={colors.muted} />}
          keyboardType="phone-pad"
        />
        
        <Input
          label="Bio"
          placeholder="Tell us about yourself"
          value={bio}
          onChangeText={setBio}
          leftIcon={<Edit2 size={20} color={colors.muted} />}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={styles.bioInput}
        />
        
        <TouchableOpacity
          style={[styles.addressButton, { backgroundColor: colors.card }]}
          onPress={handleManageAddresses}
        >
          <MapPin size={20} color={colors.primary} />
          <Text style={[styles.addressButtonText, { color: colors.text }]}>
            Manage Addresses
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.actions}>
        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={isLoading}
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
  },
  form: {
    padding: 20,
  },
  bioInput: {
    height: 100,
    paddingTop: 12,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  addressButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  actions: {
    padding: 20,
    paddingTop: 0,
    marginBottom: 30,
  },
});