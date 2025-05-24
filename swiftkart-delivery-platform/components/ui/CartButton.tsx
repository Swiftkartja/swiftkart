import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import { ShoppingCart } from 'lucide-react-native';
import { useCartStore } from '@/store/cart-store';

interface CartButtonProps {
  onPress: () => void;
}

export const CartButton: React.FC<CartButtonProps> = ({ onPress }) => {
  const { colors } = useThemeStore();
  const { getCartCount } = useCartStore();
  
  const cartCount = getCartCount();
  
  if (cartCount === 0) {
    return null;
  }
  
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.primary }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ShoppingCart size={24} color="#FFFFFF" />
      <View style={styles.countContainer}>
        <Text style={styles.countText}>{cartCount}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  countContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF4500',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});