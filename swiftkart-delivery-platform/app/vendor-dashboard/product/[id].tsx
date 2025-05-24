import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Switch, Image, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { 
  Image as ImageIcon, 
  DollarSign, 
  Package, 
  Tag, 
  Info, 
  Check, 
  X, 
  Plus, 
  Minus,
  ArrowLeft,
  Save
} from 'lucide-react-native';

// Mock categories
const mockCategories = [
  'fruits',
  'vegetables',
  'dairy',
  'bakery',
  'meat',
  'seafood',
  'frozen',
  'beverages',
  'snacks',
  'organic',
  'gluten-free',
  'vegan',
];

// Mock products data
const mockProducts = [
  {
    id: 'product-101',
    name: 'Fresh Organic Apples',
    description: 'Delicious organic apples from local farms',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    price: 4.99,
    salePrice: null,
    unit: 'kg',
    stock: 50,
    categories: ['fruits', 'organic'],
    isAvailable: true,
    isPopular: true,
    isFeatured: false,
    createdAt: '2023-05-10T10:00:00.000Z',
  },
  {
    id: 'product-102',
    name: 'Whole Grain Bread',
    description: 'Freshly baked whole grain bread',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    price: 3.49,
    salePrice: 2.99,
    unit: 'loaf',
    stock: 20,
    categories: ['bakery', 'healthy'],
    isAvailable: true,
    isPopular: false,
    isFeatured: true,
    createdAt: '2023-05-11T09:30:00.000Z',
  },
  {
    id: 'product-103',
    name: 'Organic Milk',
    description: 'Fresh organic milk from grass-fed cows',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    price: 2.99,
    salePrice: null,
    unit: 'liter',
    stock: 30,
    categories: ['dairy', 'organic'],
    isAvailable: true,
    isPopular: true,
    isFeatured: false,
    createdAt: '2023-05-12T11:15:00.000Z',
  },
  {
    id: 'product-104',
    name: 'Free-Range Eggs',
    description: 'Farm fresh free-range eggs',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    price: 5.49,
    salePrice: null,
    unit: 'dozen',
    stock: 25,
    categories: ['dairy', 'organic'],
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    createdAt: '2023-05-13T08:45:00.000Z',
  },
  {
    id: 'product-105',
    name: 'Organic Spinach',
    description: 'Fresh organic spinach leaves',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    price: 2.49,
    salePrice: null,
    unit: 'bunch',
    stock: 15,
    categories: ['vegetables', 'organic'],
    isAvailable: false,
    isPopular: false,
    isFeatured: false,
    createdAt: '2023-05-14T10:30:00.000Z',
  },
];

export default function EditProductScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [unit, setUnit] = useState('');
  const [stock, setStock] = useState('0');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Fetch product data
    const fetchProduct = async () => {
      try {
        // In a real app, this would be an API call
        const foundProduct = mockProducts.find(p => p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setName(foundProduct.name);
          setDescription(foundProduct.description);
          setPrice(foundProduct.price.toString());
          setSalePrice(foundProduct.salePrice ? foundProduct.salePrice.toString() : '');
          setUnit(foundProduct.unit);
          setStock(foundProduct.stock.toString());
          setImageUrl(foundProduct.image);
          setSelectedCategories(foundProduct.categories);
          setIsAvailable(foundProduct.isAvailable);
          setIsPopular(foundProduct.isPopular);
          setIsFeatured(foundProduct.isFeatured);
        } else {
          Alert.alert(
            "Error",
            "Product not found",
            [
              { 
                text: "OK", 
                onPress: () => router.back()
              }
            ]
          );
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        Alert.alert(
          "Error",
          "Failed to load product details",
          [
            { 
              text: "OK", 
              onPress: () => router.back()
            }
          ]
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleAddCategory = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== category));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (salePrice.trim() && (isNaN(parseFloat(salePrice)) || parseFloat(salePrice) <= 0)) {
      newErrors.salePrice = 'Sale price must be a positive number';
    }
    
    if (salePrice.trim() && parseFloat(salePrice) >= parseFloat(price)) {
      newErrors.salePrice = 'Sale price must be less than regular price';
    }
    
    if (!unit.trim()) {
      newErrors.unit = 'Unit is required';
    }
    
    if (!stock.trim()) {
      newErrors.stock = 'Stock is required';
    } else if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }
    
    if (!imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    }
    
    if (selectedCategories.length === 0) {
      newErrors.categories = 'At least one category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      // In a real app, this would call an API to update the product
      Alert.alert(
        "Success",
        "Product updated successfully!",
        [
          { 
            text: "OK", 
            onPress: () => router.back()
          }
        ]
      );
    } else {
      // Scroll to the first error
      Alert.alert(
        "Validation Error",
        "Please fix the errors in the form before submitting."
      );
    }
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  const incrementStock = () => {
    const currentStock = parseInt(stock) || 0;
    setStock((currentStock + 1).toString());
  };
  
  const decrementStock = () => {
    const currentStock = parseInt(stock) || 0;
    if (currentStock > 0) {
      setStock((currentStock - 1).toString());
    }
  };
  
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading product details...
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
          title: 'Edit Product',
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
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Basic Information
          </Text>
          
          <Input
            label="Product Name"
            placeholder="Enter product name"
            value={name}
            onChangeText={setName}
            error={errors.name}
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
              placeholder="Enter product description"
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
          
          <View style={styles.imageSection}>
            <Text style={[styles.label, { color: colors.text }]}>
              Product Image <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <Input
              placeholder="Enter image URL"
              value={imageUrl}
              onChangeText={setImageUrl}
              leftIcon={<ImageIcon size={20} color={colors.muted} />}
              error={errors.imageUrl}
            />
            
            {imageUrl ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View 
                style={[
                  styles.imagePlaceholder,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <ImageIcon size={40} color={colors.muted} />
                <Text style={[styles.imagePlaceholderText, { color: colors.muted }]}>
                  Image Preview
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Pricing & Inventory
          </Text>
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Input
                label="Price"
                placeholder="0.00"
                value={price}
                onChangeText={setPrice}
                leftIcon={<DollarSign size={20} color={colors.muted} />}
                keyboardType="decimal-pad"
                error={errors.price}
                required
              />
            </View>
            
            <View style={styles.halfWidth}>
              <Input
                label="Sale Price (Optional)"
                placeholder="0.00"
                value={salePrice}
                onChangeText={setSalePrice}
                leftIcon={<DollarSign size={20} color={colors.muted} />}
                keyboardType="decimal-pad"
                error={errors.salePrice}
              />
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Input
                label="Unit"
                placeholder="e.g., kg, piece, dozen"
                value={unit}
                onChangeText={setUnit}
                error={errors.unit}
                required
              />
            </View>
            
            <View style={styles.halfWidth}>
              <Text style={[styles.label, { color: colors.text }]}>
                Stock <Text style={{ color: colors.error }}>*</Text>
              </Text>
              <View 
                style={[
                  styles.stockContainer,
                  { 
                    borderColor: errors.stock ? colors.error : colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
              >
                <TouchableOpacity
                  style={[styles.stockButton, { borderColor: colors.border }]}
                  onPress={decrementStock}
                >
                  <Minus size={16} color={colors.text} />
                </TouchableOpacity>
                
                <TextInput
                  style={[styles.stockInput, { color: colors.text }]}
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="number-pad"
                />
                
                <TouchableOpacity
                  style={[styles.stockButton, { borderColor: colors.border }]}
                  onPress={incrementStock}
                >
                  <Plus size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
              {errors.stock && (
                <Text style={styles.errorText}>{errors.stock}</Text>
              )}
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Categories
          </Text>
          
          <Text style={[styles.label, { color: colors.text }]}>
            Select Categories <Text style={{ color: colors.error }}>*</Text>
          </Text>
          
          <View style={styles.categoriesContainer}>
            {mockCategories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedCategories.includes(category)
                      ? colors.primary
                      : 'transparent',
                    borderColor: selectedCategories.includes(category)
                      ? colors.primary
                      : colors.border,
                  },
                ]}
                onPress={() => 
                  selectedCategories.includes(category)
                    ? handleRemoveCategory(category)
                    : handleAddCategory(category)
                }
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    {
                      color: selectedCategories.includes(category)
                        ? '#FFFFFF'
                        : colors.text,
                    },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {errors.categories && (
            <Text style={styles.errorText}>{errors.categories}</Text>
          )}
          
          <View style={styles.selectedCategoriesContainer}>
            {selectedCategories.length > 0 && (
              <>
                <Text style={[styles.selectedCategoriesLabel, { color: colors.text }]}>
                  Selected Categories:
                </Text>
                <View style={styles.selectedCategoriesList}>
                  {selectedCategories.map(category => (
                    <View
                      key={category}
                      style={[
                        styles.selectedCategoryChip,
                        { backgroundColor: colors.primary + '20' },
                      ]}
                    >
                      <Text style={[styles.selectedCategoryText, { color: colors.primary }]}>
                        {category}
                      </Text>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveCategory(category)}
                      >
                        <X size={12} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Product Status
          </Text>
          
          <View style={styles.toggleContainer}>
            <View style={styles.toggleItem}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>
                Available for Purchase
              </Text>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                trackColor={{ false: colors.border, true: colors.primary + '70' }}
                thumbColor={isAvailable ? colors.primary : colors.muted}
              />
            </View>
            
            <View style={styles.toggleItem}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>
                Mark as Popular
              </Text>
              <Switch
                value={isPopular}
                onValueChange={setIsPopular}
                trackColor={{ false: colors.border, true: colors.primary + '70' }}
                thumbColor={isPopular ? colors.primary : colors.muted}
              />
            </View>
            
            <View style={styles.toggleItem}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>
                Feature on Homepage
              </Text>
              <Switch
                value={isFeatured}
                onValueChange={setIsFeatured}
                trackColor={{ false: colors.border, true: colors.primary + '70' }}
                thumbColor={isFeatured ? colors.primary : colors.muted}
              />
            </View>
          </View>
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
            onPress={handleSubmit}
            style={styles.submitButton}
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
  imageSection: {
    marginBottom: 16,
  },
  imagePreviewContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfWidth: {
    width: '48%',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  stockButton: {
    width: 40,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  stockInput: {
    flex: 1,
    height: 48,
    textAlign: 'center',
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  selectedCategoriesContainer: {
    marginTop: 16,
  },
  selectedCategoriesLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  selectedCategoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  removeButton: {
    marginLeft: 4,
  },
  toggleContainer: {
    marginBottom: 16,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleLabel: {
    fontSize: 16,
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
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
  errorText: {
    color: '#F56565',
    fontSize: 12,
    marginTop: 4,
  },
});