import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import { Product } from '@/types';
import { Card } from './Card';
import { Star, Plus } from 'lucide-react-native';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
}) => {
  const { colors } = useThemeStore();
  
  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };
  
  return (
    <Card
      style={styles.container}
      onPress={() => onPress(product)}
      elevation={2}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {product.discountPrice && (
          <View style={[styles.discountBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.discountText}>
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Star size={12} color={colors.warning} fill={colors.warning} />
          <Text style={[styles.rating, { color: colors.muted }]}>
            {product.rating.toFixed(1)}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <View>
            {product.discountPrice ? (
              <View style={styles.priceContainer}>
                <Text style={[styles.originalPrice, { color: colors.muted }]}>
                  ${product.price.toFixed(2)}
                </Text>
                <Text style={[styles.price, { color: colors.primary }]}>
                  ${product.discountPrice.toFixed(2)}
                </Text>
              </View>
            ) : (
              <Text style={[styles.price, { color: colors.primary }]}>
                ${product.price.toFixed(2)}
              </Text>
            )}
          </View>
          
          {onAddToCart && product.inStock && (
            <View
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onTouchEnd={handleAddToCart}
            >
              <Plus size={16} color="#FFFFFF" />
            </View>
          )}
        </View>
      </View>
      
      {!product.inStock && (
        <View style={styles.outOfStockOverlay}>
          <Text style={styles.outOfStockText}>Out of Stock</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    padding: 0,
    overflow: 'hidden',
    marginRight: 12,
  },
  imageContainer: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    height: 40,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'column',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});