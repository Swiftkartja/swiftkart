import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cart-store';
import { Star, Minus, Plus, Heart, ChevronRight } from 'lucide-react-native';
import { mockProducts } from '@/mocks/products';
import { mockVendors } from '@/mocks/vendors';

export default function ProductDetailsScreen() {
  const { colors } = useThemeStore();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  
  const product = mockProducts.find(p => p.id === id);
  const vendor = product ? mockVendors.find(v => v.id === product.vendorId) : null;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  if (!product || !vendor) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Product Details' }} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Product not found
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.errorButton}
          />
        </View>
      </View>
    );
  }
  
  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    addItem(product, quantity);
    // Show success message or navigate to cart
  };
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const handleVendorPress = () => {
    router.push(`/vendor/${vendor.id}`);
  };
  
  // Product images (use the main image and mock additional images)
  const productImages = [
    product.image,
    ...(product.images || []),
  ];
  
  // If there are no additional images, add the main image again
  if (productImages.length === 1) {
    productImages.push(product.image);
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: product.name }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: productImages[selectedImage] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              isFavorite && { backgroundColor: colors.primary },
            ]}
            onPress={handleToggleFavorite}
          >
            <Heart
              size={20}
              color={isFavorite ? '#FFFFFF' : colors.primary}
              fill={isFavorite ? '#FFFFFF' : 'transparent'}
            />
          </TouchableOpacity>
          
          {productImages.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailsContainer}
            >
              {productImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImage(index)}
                  style={[
                    styles.thumbnailButton,
                    selectedImage === index && {
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.name, { color: colors.text }]}>
                {product.name}
              </Text>
              
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Text style={[styles.rating, { color: colors.text }]}>
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </Text>
              </View>
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
          
          <TouchableOpacity
            style={[styles.vendorContainer, { borderColor: colors.border }]}
            onPress={handleVendorPress}
          >
            <Image
              source={{ uri: vendor.logo }}
              style={styles.vendorLogo}
              resizeMode="cover"
            />
            
            <View style={styles.vendorInfo}>
              <Text style={[styles.vendorName, { color: colors.text }]}>
                {vendor.name}
              </Text>
              <Text style={[styles.vendorLocation, { color: colors.muted }]}>
                {vendor.city}, {vendor.state}
              </Text>
            </View>
            
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: colors.muted }]}>
              {product.description}
            </Text>
          </View>
          
          {product.options && product.options.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Options
              </Text>
              
              {product.options.map((option) => (
                <View key={option.id} style={styles.optionContainer}>
                  <Text style={[styles.optionName, { color: colors.text }]}>
                    {option.name}
                    {option.required && (
                      <Text style={{ color: colors.error }}> *</Text>
                    )}
                  </Text>
                  
                  <View style={styles.choicesContainer}>
                    {option.choices.map((choice) => (
                      <TouchableOpacity
                        key={choice.id}
                        style={[
                          styles.choiceButton,
                          { borderColor: colors.border },
                        ]}
                      >
                        <Text style={[styles.choiceName, { color: colors.text }]}>
                          {choice.name}
                        </Text>
                        {choice.price > 0 && (
                          <Text
                            style={[styles.choicePrice, { color: colors.primary }]}
                          >
                            +${choice.price.toFixed(2)}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colors.card, borderTopColor: colors.border },
        ]}
      >
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              { backgroundColor: colors.subtle, borderColor: colors.border },
            ]}
            onPress={handleDecreaseQuantity}
          >
            <Minus size={16} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.quantity, { color: colors.text }]}>
            {quantity}
          </Text>
          
          <TouchableOpacity
            style={[
              styles.quantityButton,
              { backgroundColor: colors.subtle, borderColor: colors.border },
            ]}
            onPress={handleIncreaseQuantity}
          >
            <Plus size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          style={styles.addToCartButton}
          disabled={!product.inStock}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailsContainer: {
    padding: 16,
    gap: 12,
  },
  thumbnailButton: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  discountPrice: {
    fontSize: 24,
    fontWeight: '600',
  },
  vendorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 24,
  },
  vendorLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  vendorLocation: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  optionContainer: {
    marginBottom: 16,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  choicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 80,
  },
  choiceName: {
    fontSize: 14,
    fontWeight: '500',
  },
  choicePrice: {
    fontSize: 12,
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 12,
  },
  addToCartButton: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  errorButton: {
    width: 200,
  },
});