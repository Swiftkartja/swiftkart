import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  X,
  Home,
  Briefcase,
  MapPinOff
} from 'lucide-react-native';
import { Address } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for addresses
const ADDRESSES_STORAGE_KEY = 'swiftkart_addresses';

// Mock addresses (initial data)
const initialAddresses: Address[] = [
  {
    id: '1',
    title: 'Home',
    address: '123 Main Street, Apt 4B',
    city: 'Kingston',
    state: 'St. Andrew',
    zipCode: '10001',
    isDefault: true,
    type: 'home',
  },
  {
    id: '2',
    title: 'Work',
    address: '456 Business Ave, Floor 12',
    city: 'Montego Bay',
    state: 'St. James',
    zipCode: '10022',
    isDefault: false,
    type: 'work',
  },
];

export default function AddressesScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [type, setType] = useState<'home' | 'work' | 'other'>('home');
  const [isDefault, setIsDefault] = useState(false);
  
  // Load addresses from storage
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const storedAddresses = await AsyncStorage.getItem(ADDRESSES_STORAGE_KEY);
        
        if (storedAddresses) {
          setAddresses(JSON.parse(storedAddresses));
        } else {
          // Use initial data if no stored addresses
          setAddresses(initialAddresses);
          // Save initial data to storage
          await AsyncStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(initialAddresses));
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
        Alert.alert('Error', 'Failed to load addresses. Using default data.');
        setAddresses(initialAddresses);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAddresses();
  }, []);
  
  // Save addresses to storage
  const saveAddresses = async (newAddresses: Address[]) => {
    try {
      await AsyncStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(newAddresses));
    } catch (error) {
      console.error('Error saving addresses:', error);
      Alert.alert('Error', 'Failed to save addresses.');
    }
  };
  
  const handleAddAddress = async () => {
    // Validate form
    if (!title || !address || !city || !state || !zipCode) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create new address
      const newAddress: Address = {
        id: Date.now().toString(),
        title,
        address,
        city,
        state,
        zipCode,
        isDefault,
        type,
      };
      
      // If this is the first address or set as default, update other addresses
      let updatedAddresses: Address[];
      
      if (isDefault || addresses.length === 0) {
        updatedAddresses = addresses.map(addr => ({
          ...addr,
          isDefault: false,
        }));
        newAddress.isDefault = true;
      } else {
        updatedAddresses = [...addresses];
      }
      
      // Add new address
      updatedAddresses.push(newAddress);
      
      // Update state
      setAddresses(updatedAddresses);
      
      // Save to storage
      await saveAddresses(updatedAddresses);
      
      // Reset form and close modal
      resetForm();
      setShowAddModal(false);
      
      // Show success message
      Alert.alert('Success', 'Address added successfully.');
    } catch (error) {
      console.error('Error adding address:', error);
      Alert.alert('Error', 'Failed to add address. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleEditAddress = async () => {
    // Validate form
    if (!title || !address || !city || !state || !zipCode || !selectedAddress) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Update address
      const updatedAddress: Address = {
        ...selectedAddress,
        title,
        address,
        city,
        state,
        zipCode,
        isDefault,
        type,
      };
      
      // If set as default, update other addresses
      let updatedAddresses: Address[];
      
      if (isDefault) {
        updatedAddresses = addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === selectedAddress.id,
        }));
      } else if (selectedAddress.isDefault) {
        // If this was the default address but is no longer, make the first address default
        updatedAddresses = addresses.map((addr, index) => ({
          ...addr,
          isDefault: addr.id === selectedAddress.id ? false : addr.isDefault || (index === 0 && addr.id !== selectedAddress.id),
        }));
      } else {
        updatedAddresses = addresses.map(addr => 
          addr.id === selectedAddress.id ? updatedAddress : addr
        );
      }
      
      // Update state
      setAddresses(updatedAddresses);
      
      // Save to storage
      await saveAddresses(updatedAddresses);
      
      // Reset form and close modal
      resetForm();
      setShowEditModal(false);
      setSelectedAddress(null);
      
      // Show success message
      Alert.alert('Success', 'Address updated successfully.');
    } catch (error) {
      console.error('Error updating address:', error);
      Alert.alert('Error', 'Failed to update address. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDeleteAddress = async (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Get address to delete
              const addressToDelete = addresses.find(addr => addr.id === addressId);
              
              if (!addressToDelete) return;
              
              // Filter out the address
              let updatedAddresses = addresses.filter(addr => addr.id !== addressId);
              
              // If the deleted address was the default, make the first address default
              if (addressToDelete.isDefault && updatedAddresses.length > 0) {
                updatedAddresses = updatedAddresses.map((addr, index) => ({
                  ...addr,
                  isDefault: index === 0,
                }));
              }
              
              // Update state
              setAddresses(updatedAddresses);
              
              // Save to storage
              await saveAddresses(updatedAddresses);
              
              // Show success message
              Alert.alert('Success', 'Address deleted successfully.');
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Error', 'Failed to delete address. Please try again.');
            }
          },
        },
      ]
    );
  };
  
  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      // Update addresses
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));
      
      // Update state
      setAddresses(updatedAddresses);
      
      // Save to storage
      await saveAddresses(updatedAddresses);
      
      // Show success message
      Alert.alert('Success', 'Default address updated successfully.');
    } catch (error) {
      console.error('Error setting default address:', error);
      Alert.alert('Error', 'Failed to set default address. Please try again.');
    }
  };
  
  const handleEditButtonPress = (address: Address) => {
    setSelectedAddress(address);
    setTitle(address.title);
    setAddress(address.address);
    setCity(address.city);
    setState(address.state);
    setZipCode(address.zipCode);
    setType(address.type);
    setIsDefault(address.isDefault);
    setShowEditModal(true);
  };
  
  const resetForm = () => {
    setTitle('');
    setAddress('');
    setCity('');
    setState('');
    setZipCode('');
    setType('home');
    setIsDefault(false);
  };
  
  // Add Address Modal
  const AddAddressModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        resetForm();
        setShowAddModal(false);
      }}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add New Address
            </Text>
            <TouchableOpacity 
              onPress={() => {
                resetForm();
                setShowAddModal(false);
              }}
              disabled={isProcessing}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Address Title
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.subtle, color: colors.text, borderColor: colors.border }
              ]}
              placeholder="E.g., Home, Work, etc."
              placeholderTextColor={colors.muted}
              value={title}
              onChangeText={setTitle}
              editable={!isProcessing}
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Address Type
            </Text>
            <View style={styles.addressTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.addressTypeButton,
                  type === 'home' && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                  { borderColor: colors.border }
                ]}
                onPress={() => setType('home')}
                disabled={isProcessing}
              >
                <Home size={20} color={type === 'home' ? colors.primary : colors.muted} />
                <Text
                  style={[
                    styles.addressTypeText,
                    { color: type === 'home' ? colors.primary : colors.text }
                  ]}
                >
                  Home
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.addressTypeButton,
                  type === 'work' && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                  { borderColor: colors.border }
                ]}
                onPress={() => setType('work')}
                disabled={isProcessing}
              >
                <Briefcase size={20} color={type === 'work' ? colors.primary : colors.muted} />
                <Text
                  style={[
                    styles.addressTypeText,
                    { color: type === 'work' ? colors.primary : colors.text }
                  ]}
                >
                  Work
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.addressTypeButton,
                  type === 'other' && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                  { borderColor: colors.border }
                ]}
                onPress={() => setType('other')}
                disabled={isProcessing}
              >
                <MapPin size={20} color={type === 'other' ? colors.primary : colors.muted} />
                <Text
                  style={[
                    styles.addressTypeText,
                    { color: type === 'other' ? colors.primary : colors.text }
                  ]}
                >
                  Other
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Street Address
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.subtle, color: colors.text, borderColor: colors.border }
              ]}
              placeholder="Street address, house number, etc."
              placeholderTextColor={colors.muted}
              value={address}
              onChangeText={setAddress}
              editable={!isProcessing}
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              City
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.subtle, color: colors.text, borderColor: colors.border }
              ]}
              placeholder="City"
              placeholderTextColor={colors.muted}
              value={city}
              onChangeText={setCity}
              editable={!isProcessing}
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Parish/State
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.subtle, color: colors.text, borderColor: colors.border }
              ]}
              placeholder="Parish or State"
              placeholderTextColor={colors.muted}
              value={state}
              onChangeText={setState}
              editable={!isProcessing}
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Postal/ZIP Code
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.subtle, color: colors.text, borderColor: colors.border }
              ]}
              placeholder="Postal or ZIP code"
              placeholderTextColor={colors.muted}
              value={zipCode}
              onChangeText={setZipCode}
              editable={!isProcessing}
            />
            
            <View style={styles.defaultAddressContainer}>
              <Text style={[styles.defaultAddressText, { color: colors.text }]}>
                Set as default address
              </Text>
              <TouchableOpacity
                style={[
                  styles.checkboxContainer,
                  isDefault && { backgroundColor: colors.primary },
                  { borderColor: isDefault ? colors.primary : colors.border }
                ]}
                onPress={() => setIsDefault(!isDefault)}
                disabled={isProcessing}
              >
                {isDefault && <CheckCircle size={16} color="#FFFFFF" />}
              </TouchableOpacity>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <Button
              title={isProcessing ? 'Adding...' : 'Add Address'}
              onPress={handleAddAddress}
              fullWidth
              disabled={isProcessing}
              leftIcon={isProcessing ? <ActivityIndicator size="small" color="#FFFFFF" /> : undefined}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
  
  // Edit Address Modal
  const EditAddressModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        resetForm();
        setSelectedAddress(null);
        setShowEditModal(false);
      }}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Edit Address
            </Text>
            <TouchableOpacity 
              onPress={() => {
                resetForm();
                setSelectedAddress(null);
                setShowEditModal(false);
              }}
              disabled={isProcessing}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Address Title
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.subtle, color: colors.text, borderColor: colors.border }
              ]}
              placeholder="E.g., Home, Work, etc."
              placeholderTextColor={colors.muted}
              value={title}
              onChangeText={setTitle}
              editable={!isProcessing}
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Address Type
            </Text>
            <View style={styles.addressTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.addressTypeButton,
                  type === 'home' && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                  { borderColor: colors.border }
                ]}
                onPress={() => setType('home')}
                disabled={isProcessing}
              >
                <Home size={20} color={type === 'home' ? colors.primary : colors.muted} />
                <Text
                  style={[
                    styles.addressTypeText,
                    { color: type === 'home' ? colors.primary : colors.text }
                  ]}
                >
                  Home
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.addressTypeButton,
                  type === 'work' && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                  { borderColor: colors.border }
                ]}
                onPress={() => setType('work')}
                disabled={isProcessing}
              >
                <Briefcase size={20} color={type === 'work' ? colors.primary : colors.muted} />
                <Text
                  style={[
                    styles.addressTypeText,
                    { color: type === 'work' ? colors.primary : colors.text }
                  ]}
                >
                  Work
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.addressTypeButton,
                  type === 'other' && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                  { borderColor: colors.border }
                ]}
                onPress={() => setType('other')}
                disabled={isProcessing}
              >
                <MapPin size={20} color={type === 'other' ? colors.primary : colors.muted} />
                <Text
                  style={[
                    styles.addressTypeText,
                    { color: type === 'other' ? colors.primary : colors.text }
                  ]}
                >
                  Other
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Street Address
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.subtle, color: colors.text, borderColor: colors.border }
              ]}
              placeholder="Street address, house number, etc."
              placeholderTextColor={colors.muted}
              value={address}
              onChangeText={setAddress}
              editable={!isProcessing}
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              City
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.subtle, color: colors.text, borderColor: colors.border }
              ]}
              placeholder="City"
              placeholderTextColor={colors.muted}
              value={city}
              onChangeText={setCity}
              editable={!isProcessing}
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Parish/State
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.subtle, color: colors.text, borderColor: colors.border }
              ]}
              placeholder="Parish or State"
              placeholderTextColor={colors.muted}
              value={state}
              onChangeText={setState}
              editable={!isProcessing}
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Postal/ZIP Code
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.subtle, color: colors.text, borderColor: colors.border }
              ]}
              placeholder="Postal or ZIP code"
              placeholderTextColor={colors.muted}
              value={zipCode}
              onChangeText={setZipCode}
              editable={!isProcessing}
            />
            
            <View style={styles.defaultAddressContainer}>
              <Text style={[styles.defaultAddressText, { color: colors.text }]}>
                Set as default address
              </Text>
              <TouchableOpacity
                style={[
                  styles.checkboxContainer,
                  isDefault && { backgroundColor: colors.primary },
                  { borderColor: isDefault ? colors.primary : colors.border }
                ]}
                onPress={() => setIsDefault(!isDefault)}
                disabled={isProcessing}
              >
                {isDefault && <CheckCircle size={16} color="#FFFFFF" />}
              </TouchableOpacity>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <Button
              title={isProcessing ? 'Updating...' : 'Update Address'}
              onPress={handleEditAddress}
              fullWidth
              disabled={isProcessing}
              leftIcon={isProcessing ? <ActivityIndicator size="small" color="#FFFFFF" /> : undefined}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'My Addresses' }} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading addresses...
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'My Addresses' }} />
      
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Button
          title="Add New Address"
          leftIcon={<Plus size={18} color="#FFFFFF" />}
          onPress={() => {
            resetForm();
            setShowAddModal(true);
          }}
          style={styles.addButton}
        />
        
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MapPinOff size={64} color={colors.muted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Addresses Found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
              Add your first address to get started.
            </Text>
          </View>
        ) : (
          addresses.map(address => (
            <Card key={address.id} style={styles.addressCard} elevation={1}>
              <View style={styles.addressHeader}>
                <View style={styles.addressTitleContainer}>
                  {address.type === 'home' ? (
                    <Home size={16} color={colors.primary} />
                  ) : address.type === 'work' ? (
                    <Briefcase size={16} color={colors.primary} />
                  ) : (
                    <MapPin size={16} color={colors.primary} />
                  )}
                  <Text style={[styles.addressTitle, { color: colors.text }]}>
                    {address.title}
                  </Text>
                  {address.isDefault && (
                    <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.addressActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
                    onPress={() => handleEditButtonPress(address)}
                  >
                    <Edit size={16} color={colors.primary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.error + '20' }]}
                    onPress={() => handleDeleteAddress(address.id)}
                  >
                    <Trash2 size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              
              <View style={styles.addressDetails}>
                <Text style={[styles.addressText, { color: colors.text }]}>
                  {address.address}
                </Text>
                <Text style={[styles.addressText, { color: colors.text }]}>
                  {address.city}, {address.state} {address.zipCode}
                </Text>
              </View>
              
              {!address.isDefault && (
                <TouchableOpacity
                  style={[styles.setDefaultButton, { borderColor: colors.primary }]}
                  onPress={() => handleSetDefaultAddress(address.id)}
                >
                  <Text style={[styles.setDefaultText, { color: colors.primary }]}>
                    Set as Default
                  </Text>
                </TouchableOpacity>
              )}
            </Card>
          ))
        )}
      </ScrollView>
      
      <AddAddressModal />
      <EditAddressModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  addButton: {
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  addressCard: {
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  addressDetails: {
    marginBottom: 12,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 4,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: '500',
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
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 16,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addressTypeButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  addressTypeText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  defaultAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  defaultAddressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});