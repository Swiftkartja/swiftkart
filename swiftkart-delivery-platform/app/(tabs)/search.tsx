import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Category, Vendor, Product } from '@/types';
import { mockCategories } from '@/mocks/categories';
import { mockVendors } from '@/mocks/vendors';
import { mockProducts } from '@/mocks/products';
import { CategoryItem } from '@/components/ui/CategoryItem';
import { VendorCard } from '@/components/ui/VendorCard';
import { ProductCard } from '@/components/ui/ProductCard';
import { useCartStore } from '@/store/cart-store';
import { CartButton } from '@/components/ui/CartButton';
import { Search as SearchIcon, X } from 'lucide-react-native';

export default function SearchScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const { addItem } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<'vendors' | 'products'>('vendors');
  
  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = searchQuery === '' || 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      (vendor.categories && vendor.categories.includes(selectedCategory.id));
    
    return matchesSearch && matchesCategory;
  });
  
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      (product.categories && product.categories.includes(selectedCategory.id)) ||
      (product.category && product.category === selectedCategory.id);
    
    return matchesSearch && matchesCategory;
  });
  
  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(selectedCategory?.id === category.id ? null : category);
  };
  
  const handleVendorPress = (vendor: Vendor) => {
    router.push(`/vendor/${vendor.id}`);
  };
  
  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };
  
  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };
  
  const handleCartPress = () => {
    router.push('/cart');
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SearchIcon size={20} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search vendors, products..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={mockCategories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryItem
              category={item}
              onPress={handleCategoryPress}
              isSelected={selectedCategory?.id === item.id}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'vendors' && { borderBottomColor: colors.primary },
          ]}
          onPress={() => setActiveTab('vendors')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'vendors' ? colors.primary : colors.muted },
            ]}
          >
            Vendors
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'products' && { borderBottomColor: colors.primary },
          ]}
          onPress={() => setActiveTab('products')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'products' ? colors.primary : colors.muted },
            ]}
          >
            Products
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'vendors' ? (
        <FlatList
          key="vendors-list"
          data={filteredVendors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VendorCard vendor={item} onPress={handleVendorPress} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.muted }]}>
                No vendors found
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          key="products-grid"
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handleProductPress}
              onAddToCart={handleAddToCart}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.productsRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.muted }]}>
                No products found
              </Text>
            </View>
          }
        />
      )}
      
      <CartButton onPress={handleCartPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingVertical: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 80,
  },
  productsRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});