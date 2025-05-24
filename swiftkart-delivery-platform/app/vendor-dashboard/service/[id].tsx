import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  Switch,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { 
  Camera, 
  DollarSign, 
  Clock, 
  Tag, 
  MapPin, 
  Calendar, 
  Plus, 
  Trash, 
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  ArrowLeft
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Service } from '@/types';

// Mock categories for services
const mockCategories = [
  { id: 'cat-1', name: 'Cleaning' },
  { id: 'cat-2', name: 'Repair' },
  { id: 'cat-3', name: 'Installation' },
  { id: 'cat-4', name: 'Delivery' },
  { id: 'cat-5', name: 'Consultation' },
  { id: 'cat-6', name: 'Beauty & Wellness' },
  { id: 'cat-7', name: 'Education' },
  { id: 'cat-8', name: 'Event Planning' },
];

// Mock service areas
const mockServiceAreas = [
  { id: 'area-1', name: 'Kingston' },
  { id: 'area-2', name: 'Montego Bay' },
  { id: 'area-3', name: 'Ocho Rios' },
  { id: 'area-4', name: 'Negril' },
  { id: 'area-5', name: 'Portmore' },
  { id: 'area-6', name: 'Spanish Town' },
  { id: 'area-7', name: 'May Pen' },
  { id: 'area-8', name: 'Mandeville' },
];

// Days of the week for availability
const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// Time slots for availability
const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
];

// Mock service data
const mockService: Service = {
  id: 'service-123',
  vendorId: 'vendor-1',
  name: 'Home Cleaning Service',
  description: 'Professional home cleaning service for all your needs. We provide thorough cleaning of all rooms, bathrooms, kitchen, and more.',
  price: 75.00,
  priceType: 'fixed',
  images: [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  ],
  category: 'Cleaning',
  tags: ['home', 'cleaning', 'professional'],
  duration: 120,
  isAvailable: true,
  isFeatured: false,
  serviceAreas: ['Kingston', 'Portmore'],
  availabilitySchedule: [
    {
      day: 'Monday',
      slots: [
        { start: '9:00 AM', end: '5:00 PM' }
      ]
    },
    {
      day: 'Tuesday',
      slots: [
        { start: '9:00 AM', end: '5:00 PM' }
      ]
    },
    {
      day: 'Wednesday',
      slots: [
        { start: '9:00 AM', end: '5:00 PM' }
      ]
    },
    {
      day: 'Thursday',
      slots: [
        { start: '9:00 AM', end: '5:00 PM' }
      ]
    },
    {
      day: 'Friday',
      slots: [
        { start: '9:00 AM', end: '5:00 PM' }
      ]
    },
    {
      day: 'Saturday',
      slots: [
        { start: '10:00 AM', end: '2:00 PM' }
      ]
    },
    {
      day: 'Sunday',
      slots: []
    }
  ],
  createdAt: '2023-01-15T12:00:00Z',
  updatedAt: '2023-01-15T12:00:00Z'
};

export default function EditServiceScreen() {
  const { colors } = useThemeStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<Service | null>(null);
  
  // Service details
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState<'fixed' | 'hourly' | 'starting_at'>('fixed');
  const [duration, setDuration] = useState('60'); // in minutes
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  
  // Service areas
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [showAreasDropdown, setShowAreasDropdown] = useState(false);
  
  // Availability schedule
  const [availabilitySchedule, setAvailabilitySchedule] = useState<{
    day: string;
    slots: { start: string; end: string }[];
    isOpen: boolean;
  }[]>(
    daysOfWeek.map(day => ({
      day,
      slots: [{ start: '9:00 AM', end: '5:00 PM' }],
      isOpen: day !== 'Sunday',
    }))
  );
  
  // Form validation
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [imagesError, setImagesError] = useState('');
  
  // UI state
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriceTypeDropdown, setShowPriceTypeDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAvailabilitySection, setShowAvailabilitySection] = useState(false);
  
  // Load service data
  useEffect(() => {
    const loadService = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, fetch from Firestore
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set service data
        setService(mockService);
        
        // Populate form fields
        setName(mockService.name);
        setDescription(mockService.description);
        setPrice(mockService.price.toString());
        setPriceType(mockService.priceType);
        setDuration(mockService.duration?.toString() || '60');
        setCategory(mockService.category);
        setTags(mockService.tags || []);
        setImages(mockService.images);
        setIsAvailable(mockService.isAvailable);
        setIsFeatured(mockService.isFeatured || false);
        setSelectedAreas(mockService.serviceAreas || []);
        
        // Set availability schedule
        if (mockService.availabilitySchedule) {
          const schedule = daysOfWeek.map(day => {
            const daySchedule = mockService.availabilitySchedule?.find(s => s.day === day);
            return {
              day,
              slots: daySchedule?.slots?.length ? daySchedule.slots : [{ start: '9:00 AM', end: '5:00 PM' }],
              isOpen: daySchedule?.slots?.length ? true : false
            };
          });
          setAvailabilitySchedule(schedule);
        }
      } catch (error) {
        console.error('Error loading service:', error);
        Alert.alert('Error', 'Failed to load service details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadService();
  }, [id]);
  
  // Handle image picking
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImages([...images, result.assets[0].uri]);
        setImagesError('');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };
  
  // Handle removing an image
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  
  // Handle adding a tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  // Handle removing a tag
  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };
  
  // Handle toggling a service area
  const toggleServiceArea = (areaName: string) => {
    if (selectedAreas.includes(areaName)) {
      setSelectedAreas(selectedAreas.filter(area => area !== areaName));
    } else {
      setSelectedAreas([...selectedAreas, areaName]);
    }
  };
  
  // Handle toggling a day's availability
  const toggleDayAvailability = (index: number) => {
    const newSchedule = [...availabilitySchedule];
    newSchedule[index].isOpen = !newSchedule[index].isOpen;
    setAvailabilitySchedule(newSchedule);
  };
  
  // Handle adding a time slot to a day
  const addTimeSlot = (dayIndex: number) => {
    const newSchedule = [...availabilitySchedule];
    newSchedule[dayIndex].slots.push({ start: '9:00 AM', end: '5:00 PM' });
    setAvailabilitySchedule(newSchedule);
  };
  
  // Handle removing a time slot from a day
  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...availabilitySchedule];
    newSchedule[dayIndex].slots.splice(slotIndex, 1);
    setAvailabilitySchedule(newSchedule);
  };
  
  // Handle updating a time slot
  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
    const newSchedule = [...availabilitySchedule];
    newSchedule[dayIndex].slots[slotIndex][field] = value;
    setAvailabilitySchedule(newSchedule);
  };
  
  // Validate form
  const validateForm = () => {
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('Service name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!description.trim()) {
      setDescriptionError('Description is required');
      isValid = false;
    } else {
      setDescriptionError('');
    }
    
    if (!price.trim()) {
      setPriceError('Price is required');
      isValid = false;
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      setPriceError('Price must be a positive number');
      isValid = false;
    } else {
      setPriceError('');
    }
    
    if (!category) {
      setCategoryError('Category is required');
      isValid = false;
    } else {
      setCategoryError('');
    }
    
    if (images.length === 0) {
      setImagesError('At least one image is required');
      isValid = false;
    } else {
      setImagesError('');
    }
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would upload images to Firebase Storage
      // and save service data to Firestore
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create updated service object
      const updatedService: Service = {
        id: id || 'service-123',
        vendorId: user?.id || 'vendor-1',
        name,
        description,
        price: Number(price),
        priceType,
        images,
        category,
        tags,
        duration: Number(duration),
        isAvailable,
        isFeatured,
        serviceAreas: selectedAreas,
        availabilitySchedule: availabilitySchedule
          .filter(day => day.isOpen)
          .map(day => ({
            day: day.day,
            slots: day.slots
          })),
        createdAt: service?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Updated service:', updatedService);
      
      // Show success message
      Alert.alert(
        'Success',
        'Service updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/vendor-dashboard/services')
          }
        ]
      );
    } catch (error) {
      console.error('Error updating service:', error);
      Alert.alert('Error', 'Failed to update service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle service deletion
  const handleDelete = () => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service? This action cannot be undone.',
      [
        {
          text: 'Cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              setIsSubmitting(true);
              
              // In a real app, this would delete the service from Firestore
              // For now, simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              console.log('Deleted service:', id);
              
              // Show success message
              Alert.alert(
                'Success',
                'Service deleted successfully!',
                [
                  {
                    text: 'OK',
                    onPress: () => router.push('/vendor-dashboard/services')
                  }
                ]
              );
            } catch (error) {
              console.error('Error deleting service:', error);
              Alert.alert('Error', 'Failed to delete service. Please try again.');
            } finally {
              setIsSubmitting(false);
            }
          }
        }
      ]
    );
  };
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Edit Service' }} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading service details...
        </Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <Stack.Screen 
          options={{ 
            title: 'Edit Service',
            headerRight: () => (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Trash size={20} color={colors.error} />
              </TouchableOpacity>
            )
          }} 
        />
        
        <View style={styles.form}>
          {/* Service Name */}
          <Input
            label="Service Name"
            placeholder="Enter service name"
            value={name}
            onChangeText={setName}
            error={nameError}
          />
          
          {/* Description */}
          <Input
            label="Description"
            placeholder="Enter service description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textArea}
            error={descriptionError}
          />
          
          {/* Category */}
          <View style={styles.dropdownContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Category <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <TouchableOpacity
              style={[
                styles.dropdownButton,
                { 
                  borderColor: categoryError ? colors.error : colors.border,
                  backgroundColor: colors.card
                }
              ]}
              onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <Text style={[
                styles.dropdownButtonText,
                { color: category ? colors.text : colors.muted }
              ]}>
                {category || 'Select a category'}
              </Text>
              {showCategoryDropdown ? (
                <ChevronUp size={20} color={colors.muted} />
              ) : (
                <ChevronDown size={20} color={colors.muted} />
              )}
            </TouchableOpacity>
            
            {categoryError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {categoryError}
              </Text>
            ) : null}
            
            {showCategoryDropdown && (
              <View style={[
                styles.dropdown,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border
                }
              ]}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {mockCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.dropdownItem,
                        category === cat.name && { 
                          backgroundColor: colors.primary + '20'
                        }
                      ]}
                      onPress={() => {
                        setCategory(cat.name);
                        setCategoryError('');
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        { color: category === cat.name ? colors.primary : colors.text }
                      ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
          
          {/* Price and Price Type */}
          <View style={styles.row}>
            <View style={[styles.column, { flex: 1 }]}>
              <Input
                label="Price"
                placeholder="0.00"
                value={price}
                onChangeText={setPrice}
                leftIcon={<DollarSign size={20} color={colors.muted} />}
                keyboardType="decimal-pad"
                error={priceError}
              />
            </View>
            
            <View style={[styles.column, { flex: 1.2 }]}>
              <View style={styles.dropdownContainer}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Price Type
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownButton,
                    { 
                      borderColor: colors.border,
                      backgroundColor: colors.card
                    }
                  ]}
                  onPress={() => setShowPriceTypeDropdown(!showPriceTypeDropdown)}
                >
                  <Text style={[styles.dropdownButtonText, { color: colors.text }]}>
                    {priceType === 'fixed' ? 'Fixed Price' : 
                     priceType === 'hourly' ? 'Hourly Rate' : 'Starting At'}
                  </Text>
                  {showPriceTypeDropdown ? (
                    <ChevronUp size={20} color={colors.muted} />
                  ) : (
                    <ChevronDown size={20} color={colors.muted} />
                  )}
                </TouchableOpacity>
                
                {showPriceTypeDropdown && (
                  <View style={[
                    styles.dropdown,
                    { 
                      backgroundColor: colors.card,
                      borderColor: colors.border
                    }
                  ]}>
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        priceType === 'fixed' && { 
                          backgroundColor: colors.primary + '20'
                        }
                      ]}
                      onPress={() => {
                        setPriceType('fixed');
                        setShowPriceTypeDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        { color: priceType === 'fixed' ? colors.primary : colors.text }
                      ]}>
                        Fixed Price
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        priceType === 'hourly' && { 
                          backgroundColor: colors.primary + '20'
                        }
                      ]}
                      onPress={() => {
                        setPriceType('hourly');
                        setShowPriceTypeDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        { color: priceType === 'hourly' ? colors.primary : colors.text }
                      ]}>
                        Hourly Rate
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        priceType === 'starting_at' && { 
                          backgroundColor: colors.primary + '20'
                        }
                      ]}
                      onPress={() => {
                        setPriceType('starting_at');
                        setShowPriceTypeDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        { color: priceType === 'starting_at' ? colors.primary : colors.text }
                      ]}>
                        Starting At
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
          
          {/* Duration (if not hourly) */}
          {priceType !== 'hourly' && (
            <Input
              label="Duration (minutes)"
              placeholder="60"
              value={duration}
              onChangeText={setDuration}
              leftIcon={<Clock size={20} color={colors.muted} />}
              keyboardType="number-pad"
            />
          )}
          
          {/* Tags */}
          <View style={styles.tagsContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Tags</Text>
            <View style={styles.tagInputContainer}>
              <Input
                placeholder="Add tags (e.g., home, professional)"
                value={tagInput}
                onChangeText={setTagInput}
                leftIcon={<Tag size={20} color={colors.muted} />}
                containerStyle={styles.tagInput}
                onSubmitEditing={addTag}
              />
              <TouchableOpacity
                style={[
                  styles.addTagButton,
                  { backgroundColor: colors.primary }
                ]}
                onPress={addTag}
              >
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {tags.length > 0 && (
              <View style={styles.tagsWrapper}>
                {tags.map((tag, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tag,
                      { backgroundColor: colors.primary + '20' }
                    ]}
                  >
                    <Text style={[styles.tagText, { color: colors.primary }]}>
                      {tag}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeTagButton}
                      onPress={() => removeTag(index)}
                    >
                      <X size={14} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
          
          {/* Service Areas */}
          <View style={styles.dropdownContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Service Areas</Text>
            <TouchableOpacity
              style={[
                styles.dropdownButton,
                { 
                  borderColor: colors.border,
                  backgroundColor: colors.card
                }
              ]}
              onPress={() => setShowAreasDropdown(!showAreasDropdown)}
            >
              <Text style={[
                styles.dropdownButtonText,
                { color: selectedAreas.length > 0 ? colors.text : colors.muted }
              ]}>
                {selectedAreas.length > 0 
                  ? `${selectedAreas.length} area${selectedAreas.length > 1 ? 's' : ''} selected`
                  : 'Select service areas'}
              </Text>
              {showAreasDropdown ? (
                <ChevronUp size={20} color={colors.muted} />
              ) : (
                <ChevronDown size={20} color={colors.muted} />
              )}
            </TouchableOpacity>
            
            {showAreasDropdown && (
              <View style={[
                styles.dropdown,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border
                }
              ]}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {mockServiceAreas.map((area) => (
                    <TouchableOpacity
                      key={area.id}
                      style={[
                        styles.dropdownItem,
                        selectedAreas.includes(area.name) && { 
                          backgroundColor: colors.primary + '20'
                        }
                      ]}
                      onPress={() => toggleServiceArea(area.name)}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        { color: selectedAreas.includes(area.name) ? colors.primary : colors.text }
                      ]}>
                        {area.name}
                      </Text>
                      {selectedAreas.includes(area.name) && (
                        <CheckCircle size={16} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            
            {selectedAreas.length > 0 && (
              <View style={styles.selectedAreasContainer}>
                <Text style={[styles.selectedAreasTitle, { color: colors.muted }]}>
                  Selected Areas:
                </Text>
                <View style={styles.tagsWrapper}>
                  {selectedAreas.map((area, index) => (
                    <View
                      key={index}
                      style={[
                        styles.tag,
                        { backgroundColor: colors.primary + '20' }
                      ]}
                    >
                      <Text style={[styles.tagText, { color: colors.primary }]}>
                        {area}
                      </Text>
                      <TouchableOpacity
                        style={styles.removeTagButton}
                        onPress={() => toggleServiceArea(area)}
                      >
                        <X size={14} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
          
          {/* Availability Schedule */}
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowAvailabilitySection(!showAvailabilitySection)}
          >
            <View style={styles.sectionTitleContainer}>
              <Calendar size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Availability Schedule
              </Text>
            </View>
            {showAvailabilitySection ? (
              <ChevronUp size={20} color={colors.muted} />
            ) : (
              <ChevronDown size={20} color={colors.muted} />
            )}
          </TouchableOpacity>
          
          {showAvailabilitySection && (
            <View style={styles.availabilityContainer}>
              {availabilitySchedule.map((day, dayIndex) => (
                <View key={day.day} style={styles.dayContainer}>
                  <View style={styles.dayHeader}>
                    <View style={styles.dayTitleContainer}>
                      <Switch
                        value={day.isOpen}
                        onValueChange={() => toggleDayAvailability(dayIndex)}
                        trackColor={{ false: colors.border, true: colors.primary + '70' }}
                        thumbColor={day.isOpen ? colors.primary : colors.muted}
                      />
                      <Text style={[
                        styles.dayTitle,
                        { color: day.isOpen ? colors.text : colors.muted }
                      ]}>
                        {day.day}
                      </Text>
                    </View>
                    
                    {day.isOpen && (
                      <TouchableOpacity
                        style={[
                          styles.addSlotButton,
                          { backgroundColor: colors.primary }
                        ]}
                        onPress={() => addTimeSlot(dayIndex)}
                      >
                        <Plus size={16} color="#FFFFFF" />
                        <Text style={styles.addSlotButtonText}>Add Slot</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  {day.isOpen && day.slots.map((slot, slotIndex) => (
                    <View key={slotIndex} style={styles.timeSlotContainer}>
                      <View style={styles.timeInputContainer}>
                        <Text style={[styles.timeLabel, { color: colors.muted }]}>From</Text>
                        <TouchableOpacity
                          style={[
                            styles.timeInput,
                            { 
                              borderColor: colors.border,
                              backgroundColor: colors.card
                            }
                          ]}
                          onPress={() => {
                            // In a real app, show a time picker
                            Alert.alert(
                              'Select Start Time',
                              '',
                              timeSlots.map(time => ({
                                text: time,
                                onPress: () => updateTimeSlot(dayIndex, slotIndex, 'start', time)
                              }))
                            );
                          }}
                        >
                          <Text style={[styles.timeInputText, { color: colors.text }]}>
                            {slot.start}
                          </Text>
                          <Clock size={16} color={colors.muted} />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.timeInputContainer}>
                        <Text style={[styles.timeLabel, { color: colors.muted }]}>To</Text>
                        <TouchableOpacity
                          style={[
                            styles.timeInput,
                            { 
                              borderColor: colors.border,
                              backgroundColor: colors.card
                            }
                          ]}
                          onPress={() => {
                            // In a real app, show a time picker
                            Alert.alert(
                              'Select End Time',
                              '',
                              timeSlots.map(time => ({
                                text: time,
                                onPress: () => updateTimeSlot(dayIndex, slotIndex, 'end', time)
                              }))
                            );
                          }}
                        >
                          <Text style={[styles.timeInputText, { color: colors.text }]}>
                            {slot.end}
                          </Text>
                          <Clock size={16} color={colors.muted} />
                        </TouchableOpacity>
                      </View>
                      
                      {day.slots.length > 1 && (
                        <TouchableOpacity
                          style={styles.removeSlotButton}
                          onPress={() => removeTimeSlot(dayIndex, slotIndex)}
                        >
                          <Trash size={16} color={colors.error} />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
          
          {/* Images */}
          <View style={styles.imagesContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Service Images <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <Text style={[styles.imagesSubtitle, { color: colors.muted }]}>
              Upload images of your service (max 5)
            </Text>
            
            <View style={styles.imageGrid}>
              {images.map((image, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.imageContainer,
                    { borderColor: colors.border }
                  ]}
                >
                  <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity
                    style={[
                      styles.removeImageButton,
                      { backgroundColor: colors.error }
                    ]}
                    onPress={() => removeImage(index)}
                  >
                    <Trash size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {images.length < 5 && (
                <TouchableOpacity
                  style={[
                    styles.addImageButton,
                    { 
                      borderColor: imagesError ? colors.error : colors.border,
                      borderStyle: imagesError ? 'solid' : 'dashed'
                    }
                  ]}
                  onPress={pickImage}
                >
                  <Camera size={24} color={colors.primary} />
                  <Text style={[styles.addImageText, { color: colors.primary }]}>
                    Add Image
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            {imagesError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {imagesError}
              </Text>
            ) : null}
          </View>
          
          {/* Availability Toggle */}
          <View style={styles.toggleContainer}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>
                Service Available
              </Text>
              <Text style={[styles.toggleDescription, { color: colors.muted }]}>
                Toggle off to hide this service from customers
              </Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: colors.border, true: colors.primary + '70' }}
              thumbColor={isAvailable ? colors.primary : colors.muted}
            />
          </View>
          
          {/* Featured Toggle */}
          <View style={styles.toggleContainer}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>
                Featured Service
              </Text>
              <Text style={[styles.toggleDescription, { color: colors.muted }]}>
                Featured services appear at the top of search results
              </Text>
            </View>
            <Switch
              value={isFeatured}
              onValueChange={setIsFeatured}
              trackColor={{ false: colors.border, true: colors.primary + '70' }}
              thumbColor={isFeatured ? colors.primary : colors.muted}
            />
          </View>
          
          {/* Submit Button */}
          <Button
            title="Update Service"
            onPress={handleSubmit}
            loading={isSubmitting}
            fullWidth
            style={styles.submitButton}
          />
          
          {/* Delete Button */}
          <Button
            title="Delete Service"
            onPress={handleDelete}
            variant="danger"
            fullWidth
            style={styles.deleteServiceButton}
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
  form: {
    padding: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 74,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    marginBottom: 0,
  },
  addTagButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    marginRight: 4,
  },
  removeTagButton: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedAreasContainer: {
    marginTop: 8,
  },
  selectedAreasTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  availabilityContainer: {
    marginBottom: 16,
  },
  dayContainer: {
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  addSlotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addSlotButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 36,
  },
  timeInputContainer: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  timeInputText: {
    fontSize: 14,
  },
  removeSlotButton: {
    padding: 8,
  },
  imagesContainer: {
    marginBottom: 16,
  },
  imagesSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: '2%',
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: '2%',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    fontSize: 12,
    marginTop: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  deleteServiceButton: {
    marginBottom: 30,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
});