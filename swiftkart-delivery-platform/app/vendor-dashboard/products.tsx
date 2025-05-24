import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Switch, Image, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  DollarSign, 
  Package, 
  Filter,
  ChevronRight,
  ArrowUpDown,
  Eye,
  EyeOff
} from 'lucide-react-native';

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
    createdAt: '2023-05-14T10:30:00.000Z',
  },
];

export default function ProductsScreen() {
  const { colors } = useThemeStore();
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [products, setProducts] = useState(mockProducts);
  
  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === null || product.categories.includes(selectedCategory);
    const matchesAvailability = !showAvailableOnly || product.isAvailable;
    
    return matchesSearch && matchesCategory && matchesAvailability;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'price') {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;
      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    } else if (sortBy === 'stock') {
      return sortOrder === 'asc' ? a.stock - b.stock : b.stock - a.stock;
    } else if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });
  
  const handleAddProduct = () => {
    router.push('/vendor-dashboard/add-product');
  };
  
  const handleEditProduct = (productId: string) => {
    router.push(`/vendor-dashboard/product/${productId}`);
  };
  
  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            // In a real app, this would call an API to delete the product
            setProducts(products.filter(product => product.id !== productId));
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const toggleProductAvailability = (productId: string) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, isAvailable: !product.isAvailable }
        : product
    ));
  };
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  const renderProductItem = ({ item }: { item: any }) => (
    <Card
      style={styles.productCard}
      elevation={1}
    >
      <View style={styles.productHeader}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.productImage} 
          resizeMode="cover"
        />
        
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.text }]}>
            {item.name}
          </Text>
          
          <View style={styles.priceContainer}>
            {item.salePrice ? (
              <>
                <Text style={[styles.salePrice, { color: colors.primary }]}>
                  ${item.salePrice.toFixed(2)}
                </Text>
                <Text style={[styles.originalPrice, { color: colors.muted }]}>
                  ${item.price.toFixed(2)}
                </Text>
              </>
            ) : (
              <Text style={[styles.price, { color: colors.primary }]}>
                ${item.price.toFixed(2)}
              </Text>
            )}
            <Text style={[styles.unit, { color: colors.muted }]}>
              /{item.unit}
            </Text>
          </View>
          
          <View style={styles.stockContainer}>
            <Package size={14} color={colors.muted} />
            <Text style={[styles.stock, { color: colors.muted }]}>
              {item.stock} in stock
            </Text>
          </View>
          
          <View style={styles.categoriesContainer}>
            {item.categories.map((category: string) => (
              <View 
                key={category} 
                style={[styles.categoryTag, { backgroundColor: colors.primary + '20' }]}
              >
                <Text style={[styles.categoryText, { color: colors.primary }]}>
                  {category}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      
      <View style={styles.productActions}>
        <View style={styles.availabilityContainer}>
          <Text style={[styles.availabilityLabel, { color: colors.text }]}>
            Available
          </Text>
          <Switch
            value={item.isAvailable}
            onValueChange={() => toggleProductAvailability(item.id)}
            trackColor={{ false: colors.border, true: colors.primary + '70' }}
            thumbColor={item.isAvailable ? colors.primary : colors.muted}
          />
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary + '10' }]}
            onPress={() => handleEditProduct(item.id)}
          >
            <Edit size={18} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error + '10' }]}
            onPress={() => handleDeleteProduct(item.id)}
          >
            <Trash2 size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
  
  // Extract unique categories from products
  const categories = Array.from(
    new Set(products.flatMap(product => product.categories))
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'Products',
          headerRight: () => (
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={handleAddProduct}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Search size={20} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search products..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <Text style={[styles.filterLabel, { color: colors.text }]}>
          Filter by category:
        </Text>
        <ScrollableFilters 
          categories={categories}
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory}
          colors={colors}
        />
      </View>
      
      <View style={styles.sortContainer}>
        <View style={styles.sortOptions}>
          <TouchableOpacity
            style={[
              styles.sortOption,
              sortBy === 'name' && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => setSortBy('name')}
          >
            <Text
              style={[
                styles.sortText,
                { color: sortBy === 'name' ? colors.primary : colors.text },
              ]}
            >
              Name
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sortOption,
              sortBy === 'price' && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => setSortBy('price')}
          >
            <Text
              style={[
                styles.sortText,
                { color: sortBy === 'price' ? colors.primary : colors.text },
              ]}
            >
              Price
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sortOption,
              sortBy === 'stock' && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => setSortBy('stock')}
          >
            <Text
              style={[
                styles.sortText,
                { color: sortBy === 'stock' ? colors.primary : colors.text },
              ]}
            >
              Stock
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sortOption,
              sortBy === 'date' && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => setSortBy('date')}
          >
            <Text
              style={[
                styles.sortText,
                { color: sortBy === 'date' ? colors.primary : colors.text },
              ]}
            >
              Date
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sortActions}>
          <TouchableOpacity
            style={[styles.sortOrderButton, { borderColor: colors.border }]}
            onPress={toggleSortOrder}
          >
            <ArrowUpDown size={16} color={colors.text} />
            <Text style={[styles.sortOrderText, { color: colors.text }]}>
              {sortOrder === 'asc' ? 'Asc' : 'Desc'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.availabilityFilterButton,
              showAvailableOnly && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => setShowAvailableOnly(!showAvailableOnly)}
          >
            {showAvailableOnly ? (
              <Eye size={16} color={colors.primary} />
            ) : (
              <EyeOff size={16} color={colors.text} />
            )}
            <Text
              style={[
                styles.availabilityFilterText,
                { color: showAvailableOnly ? colors.primary : colors.text },
              ]}
            >
              Available Only
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Package size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No products found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.muted }]}>
              Try adjusting your search or filters
            </Text>
            <Button
              title="Add New Product"
              onPress={handleAddProduct}
              style={styles.emptyAddButton}
              leftIcon={<Plus size={18} color="#FFFFFF" />}
            />
          </View>
        }
      />
    </View>
  );
}

function ScrollableFilters({ categories, selectedCategory, setSelectedCategory, colors }: any) {
  const allCategories = [{ id: null, label: 'All' }].concat(
    categories.map((category: string) => ({ id: category, label: category }))
  );
  
  return (
    <FlatList
      data={allCategories}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.filterOption,
            selectedCategory === item.id && { 
              backgroundColor: colors.primary + '20'
            },
          ]}
          onPress={() => setSelectedCategory(item.id)}
        >
          <Text
            style={[
              styles.filterText,
              { 
                color: selectedCategory === item.id 
                  ? colors.primary
                  : colors.text 
              },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersScrollContent}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  filtersScrollContent: {
    paddingRight: 16,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginRight: 8,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  sortContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sortOptions: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginRight: 8,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sortActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  sortOrderText: {
    fontSize: 12,
    fontWeight: '500',
  },
  availabilityFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    gap: 4,
  },
  availabilityFilterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  productCard: {
    marginBottom: 12,
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  salePrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  unit: {
    fontSize: 12,
    marginLeft: 2,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  stock: {
    fontSize: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  categoryTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyAddButton: {
    marginTop: 8,
  },
});