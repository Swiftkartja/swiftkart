import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useCartStore } from '@/store/cart-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Minus, Plus, Trash2, ChevronRight, ShoppingBag } from 'lucide-react-native';
import PaymentService from '@/services/payment-service';

export default function CartScreen() {
  const { colors } = useThemeStore();
  const { items, removeItem, updateQuantity, clearCart, getCartTotal } = useCartStore();
  const router = useRouter();
  
  const [deliveryFee] = useState(2.99);
  const [tax, setTax] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Initialize payment service
  useEffect(() => {
    PaymentService.initialize();
  }, []);
  
  // Update tax when cart items change
  useEffect(() => {
    const subtotal = getCartTotal();
    setTax(subtotal * 0.08); // 8% tax
  }, [items, getCartTotal]);
  
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee + tax;
  
  const handleIncreaseQuantity = (id: string, currentQuantity: number) => {
    updateQuantity(id, currentQuantity + 1);
  };
  
  const handleDecreaseQuantity = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    } else {
      handleRemoveItem(id);
    }
  };
  
  const handleRemoveItem = (id: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeItem(id),
        },
      ]
    );
  };
  
  const handleCheckout = async () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty. Add items before checking out.');
      return;
    }
    
    try {
      setIsProcessingPayment(true);
      
      // Process payment with Fygaro
      const paymentResult = await PaymentService.createPayment({
        amount: total,
        currency: 'JMD',
        description: `Payment for order with ${items.length} items`,
        metadata: {
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      });
      
      if (paymentResult.status === 'completed') {
        // Payment successful
        Alert.alert(
          'Payment Successful',
          'Your order has been placed successfully!',
          [
            {
              text: 'View Order',
              onPress: () => {
                // Clear cart and navigate to orders
                clearCart();
                router.push('/order/latest');
              },
            },
          ]
        );
      } else {
        // Payment failed
        Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      console.error('Checkout error:', error);
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  const handleContinueShopping = () => {
    router.back();
  };
  
  const handleClearCart = () => {
    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Your cart is already empty.');
      return;
    }
    
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => clearCart(),
        },
      ]
    );
  };
  
  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty. Add items before checking out.');
      return;
    }
    
    router.push('/checkout');
  };
  
  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Cart' }} />
        <ShoppingBag size={80} color={colors.muted} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          Your cart is empty
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
          Looks like you haven't added anything to your cart yet.
        </Text>
        <Button
          title="Continue Shopping"
          onPress={handleContinueShopping}
          style={styles.continueButton}
        />
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Cart' }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <Card key={item.id} style={styles.itemCard} elevation={2}>
              <View style={styles.itemContent}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                
                <View style={styles.itemDetails}>
                  <Text style={[styles.itemName, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  
                  <Text style={[styles.itemPrice, { color: colors.primary }]}>
                    ${item.price.toFixed(2)}
                  </Text>
                  
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        { backgroundColor: colors.subtle, borderColor: colors.border },
                      ]}
                      onPress={() => handleDecreaseQuantity(item.id, item.quantity)}
                    >
                      <Minus size={16} color={colors.text} />
                    </TouchableOpacity>
                    
                    <Text style={[styles.quantity, { color: colors.text }]}>
                      {item.quantity}
                    </Text>
                    
                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        { backgroundColor: colors.subtle, borderColor: colors.border },
                      ]}
                      onPress={() => handleIncreaseQuantity(item.id, item.quantity)}
                    >
                      <Plus size={16} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <Trash2 size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
        
        <Card style={styles.summaryCard} elevation={2}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            Order Summary
          </Text>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>
              Subtotal
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${subtotal.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>
              Delivery Fee
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${deliveryFee.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>
              Tax
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${tax.toFixed(2)}
            </Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              ${total.toFixed(2)}
            </Text>
          </View>
        </Card>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Proceed to Checkout"
            onPress={handleProceedToCheckout}
            fullWidth
            style={styles.checkoutButton}
            disabled={isProcessingPayment}
          />
          
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearCart}
            disabled={isProcessingPayment}
          >
            <Text style={[styles.clearButtonText, { color: colors.error }]}>
              Clear Cart
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.paymentInfoContainer}>
          <Text style={[styles.paymentInfoTitle, { color: colors.text }]}>
            Payment Information
          </Text>
          <Text style={[styles.paymentInfoText, { color: colors.muted }]}>
            • Secure payments powered by Fygaro
          </Text>
          <Text style={[styles.paymentInfoText, { color: colors.muted }]}>
            • We accept credit/debit cards and mobile money
          </Text>
          <Text style={[styles.paymentInfoText, { color: colors.muted }]}>
            • Your payment information is encrypted and secure
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemsContainer: {
    marginBottom: 16,
  },
  itemCard: {
    marginBottom: 12,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 12,
  },
  removeButton: {
    padding: 8,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionsContainer: {
    marginBottom: 20,
  },
  checkoutButton: {
    marginBottom: 12,
  },
  clearButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  continueButton: {
    width: '80%',
  },
  paymentInfoContainer: {
    marginBottom: 30,
    padding: 16,
  },
  paymentInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  paymentInfoText: {
    fontSize: 14,
    marginBottom: 4,
  },
});