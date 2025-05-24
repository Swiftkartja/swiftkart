import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Switch, Image, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { 
  Image as ImageIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  DollarSign, 
  Save, 
  ArrowLeft,
  Camera,
  User,
  Store as StoreIcon
} from 'lucide-react-native';

export default function VendorProfileScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Store information
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [minOrder, setMinOrder] = useState('');
  
  // Personal information
  const [name, setName] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [personalPhone, setPersonalPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Load user and vendor information
    if (user) {
      setName(user.name || '');
      setPersonalEmail(user.email || '');
      setPersonalPhone(user.phone || '');
      setAvatarUrl(user.avatar || '');
      
      if (user.vendorInfo) {
        setStoreName(user.vendorInfo.name || '');
        setDescription(user.vendorInfo.description || '');
        setEmail(user.vendorInfo.email || '');
        setPhone(user.vendorInfo.phone || '');
        setAddress(user.vendorInfo.address || '');
        setCity(user.vendorInfo.city || '');
        setState(user.vendorInfo.state || '');
        setZipCode(user.vendorInfo.zipCode || '');
        setLogoUrl(user.vendorInfo.logo || '');
        setCoverImageUrl(user.vendorInfo.coverImage || '');
        setDeliveryTime(user.vendorInfo.deliveryTime || '');
        setDeliveryFee(user.vendorInfo.deliveryFee?.toString() || '');
        setMinOrder(user.vendorInfo.minOrder?.toString() || '');
      }
      
      setLoading(false);
    }
  }, [user]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate store information
    if (!storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    
    if (!logoUrl.trim()) {
      newErrors.logoUrl = 'Logo URL is required';
    }
    
    if (!coverImageUrl.trim()) {
      newErrors.coverImageUrl = 'Cover image URL is required';
    }
    
    if (!deliveryTime.trim()) {
      newErrors.deliveryTime = 'Delivery time is required';
    }
    
    if (!deliveryFee.trim()) {
      newErrors.deliveryFee = 'Delivery fee is required';
    } else if (isNaN(parseFloat(deliveryFee)) || parseFloat(deliveryFee) < 0) {
      newErrors.deliveryFee = 'Delivery fee must be a non-negative number';
    }
    
    if (!minOrder.trim()) {
      newErrors.minOrder = 'Minimum order is required';
    } else if (isNaN(parseFloat(minOrder)) || parseFloat(minOrder) < 0) {
      newErrors.minOrder = 'Minimum order must be a non-negative number';
    }
    
    // Validate personal information
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!personalEmail.trim()) {
      newErrors.personalEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(personalEmail)) {
      newErrors.personalEmail = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = async () => {
    if (validateForm()) {
      try {
        setSaving(true);
        
        // In a real app, this would call an API to update the user and vendor information
        if (user && user.vendorInfo) {
          const updatedVendorInfo = {
            ...user.vendorInfo,
            name: storeName,
            description,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            logo: logoUrl,
            coverImage: coverImageUrl,
            deliveryTime,
            deliveryFee: parseFloat(deliveryFee),
            minOrder: parseFloat(minOrder),
          };
          
          const updatedUser = {
            ...user,
            name,
            email: personalEmail,
            phone: personalPhone,
            avatar: avatarUrl,
            vendorInfo: updatedVendorInfo,
          };
          
          // Update user in store
          updateUser(updatedUser);
          
          Alert.alert(
            "Success",
            "Profile updated successfully!",
            [{ text: "OK" }]
          );
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        Alert.alert(
          "Error",
          "Failed to update profile. Please try again."
        );
      } finally {
        setSaving(false);
      }
    } else {
      Alert.alert(
        "Validation Error",
        "Please fix the errors in the form before saving."
      );
    }
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading profile...
        </Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Stack.Screen 
        options={{ 
          title: 'Store Profile',
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image */}
        <View style={styles.coverImageContainer}>
          {coverImageUrl ? (
            <Image
              source={{ uri: coverImageUrl }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <View 
              style={[
                styles.coverImagePlaceholder,
                { backgroundColor: colors.card },
              ]}
            >
              <Camera size={40} color={colors.muted} />
              <Text style={[styles.placeholderText, { color: colors.muted }]}>
                Add Cover Image
              </Text>
            </View>
          )}
          
          <View style={styles.logoContainer}>
            {logoUrl ? (
              <Image
                source={{ uri: logoUrl }}
                style={styles.logo}
                resizeMode="cover"
              />
            ) : (
              <View 
                style={[
                  styles.logoPlaceholder,
                  { backgroundColor: colors.card },
                ]}
              >
                <StoreIcon size={30} color={colors.muted} />
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Store Information
          </Text>
          
          <Input
            label="Store Name"
            placeholder="Enter store name"
            value={storeName}
            onChangeText={setStoreName}
            leftIcon={<StoreIcon size={20} color={colors.muted} />}
            error={errors.storeName}
            required
          />
          
          <View style={styles.textAreaContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Description <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textArea,
                { 
                  color: colors.text,
                  borderColor: errors.description ? colors.error : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              placeholder="Enter store description"
              placeholderTextColor={colors.muted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>
          
          <Input
            label="Email"
            placeholder="Enter store email"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Mail size={20} color={colors.muted} />}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            required
          />
          
          <Input
            label="Phone"
            placeholder="Enter store phone number"
            value={phone}
            onChangeText={setPhone}
            leftIcon={<Phone size={20} color={colors.muted} />}
            keyboardType="phone-pad"
            error={errors.phone}
            required
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Store Address
          </Text>
          
          <Input
            label="Address"
            placeholder="Enter street address"
            value={address}
            onChangeText={setAddress}
            leftIcon={<MapPin size={20} color={colors.muted} />}
            error={errors.address}
            required
          />
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Input
                label="City"
                placeholder="Enter city"
                value={city}
                onChangeText={setCity}
                error={errors.city}
                required
              />
            </View>
            
            <View style={styles.halfWidth}>
              <Input
                label="State"
                placeholder="Enter state"
                value={state}
                onChangeText={setState}
                error={errors.state}
                required
              />
            </View>
          </View>
          
          <Input
            label="ZIP Code"
            placeholder="Enter ZIP code"
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="number-pad"
            error={errors.zipCode}
            required
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Store Images
          </Text>
          
          <Input
            label="Logo URL"
            placeholder="Enter logo image URL"
            value={logoUrl}
            onChangeText={setLogoUrl}
            leftIcon={<ImageIcon size={20} color={colors.muted} />}
            error={errors.logoUrl}
            required
          />
          
          <Input
            label="Cover Image URL"
            placeholder="Enter cover image URL"
            value={coverImageUrl}
            onChangeText={setCoverImageUrl}
            leftIcon={<ImageIcon size={20} color={colors.muted} />}
            error={errors.coverImageUrl}
            required
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Delivery Settings
          </Text>
          
          <Input
            label="Delivery Time"
            placeholder="e.g., 30-45 min"
            value={deliveryTime}
            onChangeText={setDeliveryTime}
            leftIcon={<Clock size={20} color={colors.muted} />}
            error={errors.deliveryTime}
            required
          />
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Input
                label="Delivery Fee"
                placeholder="0.00"
                value={deliveryFee}
                onChangeText={setDeliveryFee}
                leftIcon={<DollarSign size={20} color={colors.muted} />}
                keyboardType="decimal-pad"
                error={errors.deliveryFee}
                required
              />
            </View>
            
            <View style={styles.halfWidth}>
              <Input
                label="Minimum Order"
                placeholder="0.00"
                value={minOrder}
                onChangeText={setMinOrder}
                leftIcon={<DollarSign size={20} color={colors.muted} />}
                keyboardType="decimal-pad"
                error={errors.minOrder}
                required
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Personal Information
          </Text>
          
          <Input
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            leftIcon={<User size={20} color={colors.muted} />}
            error={errors.name}
            required
          />
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={personalEmail}
            onChangeText={setPersonalEmail}
            leftIcon={<Mail size={20} color={colors.muted} />}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.personalEmail}
            required
          />
          
          <Input
            label="Phone"
            placeholder="Enter your phone number"
            value={personalPhone}
            onChangeText={setPersonalPhone}
            leftIcon={<Phone size={20} color={colors.muted} />}
            keyboardType="phone-pad"
            error={errors.personalPhone}
          />
          
          <Input
            label="Avatar URL"
            placeholder="Enter avatar image URL"
            value={avatarUrl}
            onChangeText={setAvatarUrl}
            leftIcon={<ImageIcon size={20} color={colors.muted} />}
            error={errors.avatarUrl}
          />
          
          {avatarUrl && (
            <View style={styles.avatarPreviewContainer}>
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatarPreview}
                resizeMode="cover"
              />
            </View>
          )}
        </View>
        
        <View style={styles.actionButtons}>
          <Button
            title="Cancel"
            onPress={handleCancel}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={saving}
            style={styles.saveButton}
            leftIcon={<Save size={18} color="#FFFFFF" />}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
  },
  backButton: {
    marginLeft: 16,
  },
  coverImageContainer: {
    position: 'relative',
    marginBottom: 60,
  },
  coverImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  coverImagePlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
  },
  logoContainer: {
    position: 'absolute',
    bottom: -50,
    alignSelf: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  textAreaContainer: {
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfWidth: {
    width: '48%',
  },
  avatarPreviewContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
  errorText: {
    color: '#F56565',
    fontSize: 12,
    marginTop: 4,
  },
});