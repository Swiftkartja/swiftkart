import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Category, Vendor, Product, Service } from '@/types';
import { mockCategories } from '@/mocks/categories';
import { mockVendors } from '@/mocks/vendors';
import { mockProducts } from '@/mocks/products';
import { mockServices } from '@/mocks/services';
import { CategoryItem } from '@/components/ui/CategoryItem';
import { VendorCard } from '@/components/ui/VendorCard';
import { ProductCard } from '@/components/ui/ProductCard';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { CartButton } from '@/components/ui/CartButton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useCartStore } from '@/store/cart-store';
import { MapPin, Bell, Search } from 'lucide-react-native';

export default function HomeScreen() {
  const { colors } = useThemeStore();
  const { user, userRole } = useAuthStore();
  const { addItem } = useCartStore();
  const router = useRouter();
  
  // Redirect non-customers to their respective dashboards
  useEffect(() => {
    if (userRole && userRole !== 'customer') {
      switch (userRole) {
        case 'vendor':
          router.replace('/vendor-dashboard');
          break;
        case 'rider':
          router.replace('/rider-dashboard');
          break;
        case 'admin':
          router.replace('/admin-dashboard');
          break;
      }
    }
  }, [userRole]);
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [filteredVendors, setFilteredVendors] = useState(mockVendors.filter(vendor => vendor.isFeatured));
  
  // Filter vendors by category
  useEffect(() => {
    if (selectedCategory) {
      setFilteredVendors(mockVendors.filter(vendor => 
        vendor.categories.includes(selectedCategory.id)
      ));
    } else {
      setFilteredVendors(mockVendors.filter(vendor => vendor.isFeatured));
    }
  }, [selectedCategory]);
  
  const popularProducts = mockProducts.filter(product => product.isPopular);
  const featuredServices = mockServices.filter(service => service.isFeatured);
  
  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(selectedCategory?.id === category.id ? null : category);
  };
  
  const handleVendorPress = (vendor: Vendor) => {
    // Navigate to vendor details
    router.push(`/vendor/${vendor.id}`);
  };
  
  const handleProductPress = (product: Product) => {
    // Navigate to product details
    router.push(`/product/${product.id}`);
  };
  
  const handleServicePress = (service: Service) => {
    // Navigate to service details
    router.push(`/service/${service.id}`);
  };
  
  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };
  
  const handleCartPress = () => {
    router.push('/cart');
  };
  
  const handleNotificationsPress = () => {
    router.push('/notifications');
  };
  
  const handleSearchPress = () => {
    router.push('/(tabs)/search');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Hello, {user?.name?.split(' ')[0] || 'Guest'}
            </Text>
            <TouchableOpacity style={styles.locationContainer}>
              <MapPin size={14} color={colors.primary} />
              <Text style={[styles.location, { color: colors.muted }]}>
                Old Harbor, CA
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.subtle }]}
              onPress={handleSearchPress}
            >
              <Search size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.subtle }]}
              onPress={handleNotificationsPress}
            >
              <Bell size={20} color={colors.text} />
            </TouchableOpacity>
            
            <ThemeToggle size={20} />
          </View>
        </View>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner */}
        <View style={[styles.banner, { backgroundColor: colors.primary }]}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Free Delivery</Text>
              <Text style={styles.bannerSubtitle}>
                On your first order over $15
              </Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Order Now</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' }}
              style={styles.bannerImage}
              resizeMode="contain"
            />
          </View>
        </View>
        
        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Categories
          </Text>
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
        
        {/* Vendors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedCategory ? `${selectedCategory.name} Vendors` : 'Featured Vendors'}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onPress={handleVendorPress}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.muted }]}>
                No vendors found in this category
              </Text>
            </View>
          )}
        </View>
        
        {/* Popular Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Popular Products
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={popularProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={handleProductPress}
                onAddToCart={handleAddToCart}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>
        
        {/* Featured Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Featured Services
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredServices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ServiceCard
                service={item}
                onPress={handleServicePress}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesList}
          />
        </View>
      </ScrollView>
      
      <CartButton onPress={handleCartPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  banner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 12,
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 12,
  },
  bannerImage: {
    width: 80,
    height: 80,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesList: {
    paddingVertical: 8,
  },
  productsList: {
    paddingVertical: 8,
  },
  servicesList: {
    paddingVertical: 8,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  emptyStateText: {
    fontSize: 14,
  },
});