import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { Heart, Star, MapPin, Trash2 } from 'lucide-react-native';
import { Product, Vendor } from '@/types';
import { mockProducts } from '@/mocks/products';
import { mockVendors } from '@/mocks/vendors';

// Mock favorites
const mockFavoriteProducts = [mockProducts[0], mockProducts[3], mockProducts[7]];
const mockFavoriteVendors = [mockVendors[0], mockVendors[4]];

export default function FavoritesScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'vendors' | 'products'>('vendors');
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>(mockFavoriteProducts);
  const [favoriteVendors, setFavoriteVendors] = useState<Vendor[]>(mockFavoriteVendors);
  
  const handleRemoveProduct = (productId: string) => {
    setFavoriteProducts(favoriteProducts.filter(product => product.id !== productId));
  };
  
  const handleRemoveVendor = (vendorId: string) => {
    setFavoriteVendors(favoriteVendors.filter(vendor => vendor.id !== vendorId));
  };
  
  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };
  
  const handleVendorPress = (vendor: Vendor) => {
    router.push(`/vendor/${vendor.id}`);
  };
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ title: 'Favorites' }} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Your Favorites
        </Text>
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
      
      <View style={styles.content}>
        {activeTab === 'vendors' ? (
          favoriteVendors.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Heart size={60} color={colors.primary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No favorite vendors
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
                Add vendors to your favorites to see them here
              </Text>
            </View>
          ) : (
            favoriteVendors.map((vendor) => (
              <Card
                key={vendor.id}
                style={styles.vendorCard}
                onPress={() => handleVendorPress(vendor)}
                elevation={2}
              >
                <View style={styles.vendorHeader}>
                  <Image
                    source={{ uri: vendor.coverImage }}
                    style={styles.vendorCover}
                    resizeMode="cover"
                  />
                  <View style={styles.vendorLogoContainer}>
                    <Image
                      source={{ uri: vendor.logo }}
                      style={styles.vendorLogo}
                      resizeMode="cover"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveVendor(vendor.id)}
                  >
                    <Trash2 size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.vendorContent}>
                  <Text style={[styles.vendorName, { color: colors.text }]}>
                    {vendor.name}
                  </Text>
                  
                  <View style={styles.vendorInfo}>
                    <View style={styles.ratingContainer}>
                      <Star size={16} color={colors.warning} fill={colors.warning} />
                      <Text style={[styles.rating, { color: colors.text }]}>
                        {vendor.rating.toFixed(1)} ({vendor.reviewCount})
                      </Text>
                    </View>
                    
                    <View style={styles.locationContainer}>
                      <MapPin size={16} color={colors.muted} />
                      <Text style={[styles.location, { color: colors.muted }]}>
                        {vendor.city}, {vendor.state}
                      </Text>
                    </View>
                  </View>
                  
                  <Text
                    style={[styles.vendorDescription, { color: colors.muted }]}
                    numberOfLines={2}
                  >
                    {vendor.description}
                  </Text>
                </View>
              </Card>
            ))
          )
        ) : favoriteProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Heart size={60} color={colors.primary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No favorite products
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
              Add products to your favorites to see them here
            </Text>
          </View>
        ) : (
          favoriteProducts.map((product) => (
            <Card
              key={product.id}
              style={styles.productCard}
              onPress={() => handleProductPress(product)}
              elevation={2}
            >
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveProduct(product.id)}
              >
                <Trash2 size={18} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.productContent}>
                <Text style={[styles.productName, { color: colors.text }]}>
                  {product.name}
                </Text>
                
                <View style={styles.productInfo}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color={colors.warning} fill={colors.warning} />
                    <Text style={[styles.rating, { color: colors.text }]}>
                      {product.rating.toFixed(1)}
                    </Text>
                  </View>
                  
                  <View style={styles.priceContainer}>
                    {product.discountPrice ? (
                      <>
                        <Text
                          style={[styles.originalPrice, { color: colors.muted }]}
                        >
                          ${product.price.toFixed(2)}
                        </Text>
                        <Text
                          style={[styles.discountPrice, { color: colors.primary }]}
                        >
                          ${product.discountPrice.toFixed(2)}
                        </Text>
                      </>
                    ) : (
                      <Text style={[styles.price, { color: colors.primary }]}>
                        ${product.price.toFixed(2)}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    marginBottom: 16,
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
  content: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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
  vendorCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  vendorHeader: {
    height: 120,
    position: 'relative',
  },
  vendorCover: {
    width: '100%',
    height: '100%',
  },
  vendorLogoContainer: {
    position: 'absolute',
    bottom: -20,
    left: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  vendorLogo: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorContent: {
    padding: 16,
    paddingTop: 24,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  vendorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
  },
  vendorDescription: {
    fontSize: 14,
  },
  productCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 180,
  },
  productContent: {
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
});