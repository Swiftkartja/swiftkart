import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { CartItem } from '@/types';
import type { CartState } from '@/types/cart';

const CART_STORAGE_KEY = 'swiftkart_cart';

const saveCartToStorage = async (items: CartItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: async (item: CartItem) => {
    set((state) => {
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(
        (i: CartItem) => i.id === item.id
      );
      
      let updatedItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + (item.quantity || 1),
        };
      } else {
        // Add new item with default quantity if not provided
        updatedItems = [...state.items, { ...item, quantity: item.quantity || 1 }];
      }
      
      // Save to storage
      saveCartToStorage(updatedItems);
      
      return { items: updatedItems };
    });
  },
  
  removeItem: async (id: string) => {
    set((state) => {
      const updatedItems = state.items.filter((item: CartItem) => item.id !== id);
      // Save to storage
      saveCartToStorage(updatedItems);
      return { items: updatedItems };
    });
  },
  
  updateQuantity: async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await get().removeItem(id);
      return;
    }
    
    set((state) => {
      const updatedItems = state.items.map((item: CartItem) =>
        item.id === id ? { ...item, quantity } : item
      );
      // Save to storage
      saveCartToStorage(updatedItems);
      return { items: updatedItems };
    });
  },
  
  clearCart: async () => {
    await AsyncStorage.removeItem(CART_STORAGE_KEY);
    set({ items: [] });
  },
  
  getSubtotal: () => {
    return get().items.reduce((total: number, item: CartItem) => {
      const itemPrice = 'salePrice' in item && item.salePrice !== undefined 
        ? Number(item.salePrice) 
        : Number(item.price);
      const itemQuantity = item.quantity || 1;
      return total + (itemPrice * itemQuantity);
    }, 0);
  },
  
  loadCart: async () => {
    try {
      const cartString = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartString) {
        const cartItems = JSON.parse(cartString) as CartItem[];
        // Ensure all items have a quantity
        const validatedItems = cartItems.map(item => ({
          ...item,
          quantity: item.quantity || 1
        }));
        set({ items: validatedItems });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  },
}));

// Initialize cart when the app starts
useCartStore.getState().loadCart();