import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  MapPin, 
  CreditCard, 
  Wallet, 
  Clock, 
  ChevronRight, 
  DollarSign,
  Truck,
  Calendar,
  CheckCircle,
  ShoppingBag as ShoppingBagIcon,
  FileText as FileTextIcon
} from 'lucide-react-native';
import { Figaro } from '@figaro-payments/react-native';

// Initialize Figaro with your API key
const figaro = new Figaro({
  apiKey: 'YOUR_FIGARO_API_KEY', // Replace with actual API key
  environment: 'production', // or 'sandbox' for testing
});

// Mock addresses for the user
const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    name: 'Home',
    line1: '123 Main Street',
    line2: 'Apt 4B',
    city: 'Kingston',
    state: 'St. Andrew',
    postalCode: 'JMAKN09',
    country: 'Jamaica',
    isDefault: true,
    coordinates: {
      latitude: 18.0179,
      longitude: -76.8099
    }
  },
  {
    id: 'addr-2',
    name: 'Work',
    line1: '45 Business Avenue',
    line2: 'Floor 3',
    city: 'Montego Bay',
    state: 'St. James',
    postalCode: 'JMMOB12',
    country: 'Jamaica',
    isDefault: false,
    coordinates: {
      latitude: 18.4762,
      longitude: -77.8938
    }
  }
];

// Mock payment methods for the user
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    userId: 'user-1',
    type: 'card',
    isDefault: true,
    details: {
      last4: '4242',
      brand: 'visa',
      expiryMonth: '12',
      expiryYear: '2025'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'pm-2',
    userId: 'user-1',
    type: 'card',
    isDefault: false,
    details: {
      last4: '5555',
      brand: 'mastercard',
      expiryMonth: '10',
      expiryYear: '2024'
    },
    createdAt: new Date().toISOString()
  }
];

// Mock delivery time slots
const mockTimeSlots = [
  { id: 'ts-1', time: 'Today, 2:00 PM - 4:00 PM' },
  { id: 'ts-2', time: 'Today, 4:00 PM - 6:00 PM' },
  { id: 'ts-3', time: 'Today, 6:00 PM - 8:00 PM' },
  { id: 'ts-4', time: 'Tomorrow, 10:00 AM - 12:00 PM' },
  { id: 'ts-5', time: 'Tomorrow, 12:00 PM - 2:00 PM' },
];

export default function CheckoutScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    mockAddresses.find(addr => addr.isDefault) || null
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(
    mockPaymentMethods.find(pm => pm.isDefault) || null
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(5.99);
  const [tip, setTip] = useState(0);
  const [tipPercentage, setTipPercentage] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [useSavedCard, setUseSavedCard] = useState(false);
  
  // Calculate totals
  const subtotal = getSubtotal();
  const tax = subtotal * 0.15; // 15% tax
  const total = subtotal + tax + deliveryFee + tip - discount;
  
  useEffect(() => {
    // Calculate tip based on percentage
    setTip(Number((subtotal * (tipPercentage / 100)).toFixed(2)));
  }, [subtotal, tipPercentage]);
  
  const handleSelectAddress = () => {
    // In a real app, navigate to address selection screen
    // For now, just toggle between the mock addresses
    if (selectedAddress?.id === mockAddresses[0].id) {
      setSelectedAddress(mockAddresses[1]);
    } else {
      setSelectedAddress(mockAddresses[0]);
    }
  };
  
  const handleSelectPaymentMethod = () => {
    // In a real app, show a proper payment method selector
    // For now, use an Alert to simulate selection
    Alert.alert(
      'Select Payment Method',
      'Choose your payment method',
      [
        {
          text: 'Visa ending in 4242',
          onPress: () => setSelectedPaymentMethod(mockPaymentMethods[0])
        },
        {
          text: 'Mastercard ending in 5555',
          onPress: () => setSelectedPaymentMethod(mockPaymentMethods[1])
        },
        {
          text: 'Wallet ($25.50)',
          onPress: () => {
            // Set to a wallet payment method
            setSelectedPaymentMethod({
              id: 'wallet',
              userId: user?.id || '',
              type: 'wallet',
              isDefault: false,
              details: {
                brand: 'wallet',
              },
              createdAt: new Date().toISOString()
            });
          }
        },
        {
          text: 'Cancel',
          onPress: () => {} // No action needed for cancel
        }
      ]
    );
  };
  
  const handleSelectTimeSlot = () => {
    // Show time slot selection
    Alert.alert(
      'Select Delivery Time',
      'Choose your preferred delivery time',
      mockTimeSlots.map(slot => ({
        text: slot.time,
        onPress: () => setSelectedTimeSlot(slot.time)
      })).concat([
        {
          text: 'Cancel',
          onPress: () => {}
        }
      ])
    );
  };
  
  const handleApplyPromoCode = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') {
      const discountAmount = subtotal * 0.1; // 10% discount
      setDiscount(Number(discountAmount.toFixed(2)));
      Alert.alert('Success', 'Promo code applied successfully!');
    } else {
      Alert.alert('Invalid Code', 'This promo code is invalid or expired.');
      setDiscount(0);
    }
  };
  
  const handlePlaceOrder = async () => {
    try {
      // Validate required fields
      if (!selectedAddress) {
        Alert.alert('Error', 'Please select a delivery address.');
        return;
      }
      
      if (!selectedPaymentMethod) {
        Alert.alert('Error', 'Please select a payment method.');
        return;
      }
      
      if (!selectedTimeSlot) {
        Alert.alert('Error', 'Please select a delivery time.');
        return;
      }
      
      setIsProcessing(true);
      
      // Process payment with Fygaro
      const paymentResult = await PaymentService.createPayment({
        amount: total,
        currency: 'JMD',
        description: `SwiftKart Order - ${items.length} items`,
        metadata: {
          customerId: user?.id,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity
          }))
        }
      });
      
      console.log('Payment processed:', paymentResult);
      
      // Simulate order creation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to order confirmation
      router.replace({
        pathname: '/order/[id]',
        params: { id: `order-${Date.now()}` }
      });
    } catch (error) {
      console.error('Error processing order:', error);
      Alert.alert(
        'Payment Failed',
        'There was an error processing your payment. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Calculate total amount
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Create payment request
      const paymentRequest = {
        amount: total,
        currency: 'JMD',
        description: 'SwiftKart Order',
        customer: {
          id: user?.id,
          email: user?.email,
          name: user?.name,
        },
        metadata: {
          orderId: Date.now().toString(),
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      };
      
      // Initialize payment
      const payment = await figaro.createPayment(paymentRequest);
      
      // Handle payment response
      if (payment.status === 'succeeded') {
        // Process successful payment
        await processOrder(payment.id);
        
        // Clear cart
        clearCart();
        
        // Navigate to order confirmation
        router.push('/order-confirmation');
      } else {
        throw new Error('Payment failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processOrder = async (paymentId: string) => {
    try {
      // Create order in your backend
      const orderData = {
        paymentId,
        userId: user?.id,
        items: items,
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, this would call your backend API
      // For now, we'll just simulate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { id: Date.now().toString(), ...orderData };
    } catch (error) {
      console.error('Error processing order:', error);
      throw error;
    }
  };

  const handleSavedCard = async () => {
    try {
      // Get saved cards for user
      const cards = await figaro.getSavedCards(user?.id);
      
      if (cards.length > 0) {
        // Use the first saved card
        setCardNumber(cards[0].last4);
        setExpiryDate(`${cards[0].expiryMonth}/${cards[0].expiryYear}`);
        setUseSavedCard(true);
      }
    } catch (error) {
      console.error('Error fetching saved cards:', error);
      Alert.alert('Error', 'Failed to load saved cards');
    }
  };

  if (items.length === 0 && !isProcessing) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Checkout' }} />
        <Text style={[styles.emptyText, { color: colors.text }]}>
          Your cart is empty
        </Text>
        <Button
          title="Browse Products"
          onPress={() => router.replace('/(tabs)')}
          style={styles.browseButton}
        />
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Checkout' }} />
      
      {isProcessing ? (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.processingText, { color: colors.text }]}>
            Processing your order...
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Delivery Address */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <MapPin size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Delivery Address
                </Text>
              </View>
              <TouchableOpacity onPress={handleSelectAddress}>
                <Text style={[styles.changeText, { color: colors.primary }]}>
                  Change
                </Text>
              </TouchableOpacity>
            </View>
            
            {selectedAddress ? (
              <View style={styles.addressContainer}>
                <Text style={[styles.addressName, { color: colors.text }]}>
                  {selectedAddress.name}
                </Text>
                <Text style={[styles.addressLine, { color: colors.muted }]}>
                  {selectedAddress.line1}
                  {selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''}
                </Text>
                <Text style={[styles.addressLine, { color: colors.muted }]}>
                  {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                </Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.addButton, { borderColor: colors.border }]}
                onPress={handleSelectAddress}
              >
                <Text style={[styles.addButtonText, { color: colors.primary }]}>
                  Add Delivery Address
                </Text>
              </TouchableOpacity>
            )}
          </Card>
          
          {/* Payment Method */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <CreditCard size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Payment Method
                </Text>
              </View>
              <TouchableOpacity onPress={handleSelectPaymentMethod}>
                <Text style={[styles.changeText, { color: colors.primary }]}>
                  Change
                </Text>
              </TouchableOpacity>
            </View>
            
            {selectedPaymentMethod ? (
              <View style={styles.paymentMethodContainer}>
                {selectedPaymentMethod.type === 'wallet' ? (
                  <View style={styles.paymentMethod}>
                    <Wallet size={24} color={colors.success} />
                    <Text style={[styles.paymentMethodText, { color: colors.text }]}>
                      Wallet Balance: $25.50
                    </Text>
                  </View>
                ) : (
                  <View style={styles.paymentMethod}>
                    <Text style={[styles.paymentMethodText, { color: colors.text }]}>
                      {selectedPaymentMethod.details.brand === 'visa' ? 'Visa' : 'Mastercard'} •••• {selectedPaymentMethod.details.last4}
                    </Text>
                    <Text style={[styles.paymentMethodExpiry, { color: colors.muted }]}>
                      Expires {selectedPaymentMethod.details.expiryMonth}/{selectedPaymentMethod.details.expiryYear}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.addButton, { borderColor: colors.border }]}
                onPress={handleSelectPaymentMethod}
              >
                <Text style={[styles.addButtonText, { color: colors.primary }]}>
                  Add Payment Method
                </Text>
              </TouchableOpacity>
            )}
          </Card>
          
          {/* Delivery Time */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Clock size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Delivery Time
                </Text>
              </View>
              <TouchableOpacity onPress={handleSelectTimeSlot}>
                <Text style={[styles.changeText, { color: colors.primary }]}>
                  Change
                </Text>
              </TouchableOpacity>
            </View>
            
            {selectedTimeSlot ? (
              <View style={styles.timeSlotContainer}>
                <Calendar size={20} color={colors.muted} />
                <Text style={[styles.timeSlotText, { color: colors.text }]}>
                  {selectedTimeSlot}
                </Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.addButton, { borderColor: colors.border }]}
                onPress={handleSelectTimeSlot}
              >
                <Text style={[styles.addButtonText, { color: colors.primary }]}>
                  Select Delivery Time
                </Text>
              </TouchableOpacity>
            )}
          </Card>
          
          {/* Order Summary */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <ShoppingBagIcon size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Order Summary
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/cart')}>
                <Text style={[styles.changeText, { color: colors.primary }]}>
                  Edit Cart
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.orderItems}>
              {items.map((item) => (
                <View key={item.id} style={styles.orderItem}>
                  <View style={styles.orderItemInfo}>
                    <Text style={[styles.orderItemName, { color: colors.text }]}>
                      {item.name} x {item.quantity}
                    </Text>
                    {item.options && item.options.length > 0 && (
                      <Text style={[styles.orderItemOptions, { color: colors.muted }]}>
                        {item.options.map(opt => `${opt.choice}`).join(', ')}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.orderItemPrice, { color: colors.text }]}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.orderTotals}>
              <View style={styles.orderTotalRow}>
                <Text style={[styles.orderTotalLabel, { color: colors.muted }]}>
                  Subtotal
                </Text>
                <Text style={[styles.orderTotalValue, { color: colors.text }]}>
                  ${subtotal.toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.orderTotalRow}>
                <Text style={[styles.orderTotalLabel, { color: colors.muted }]}>
                  Tax (15%)
                </Text>
                <Text style={[styles.orderTotalValue, { color: colors.text }]}>
                  ${tax.toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.orderTotalRow}>
                <Text style={[styles.orderTotalLabel, { color: colors.muted }]}>
                  Delivery Fee
                </Text>
                <Text style={[styles.orderTotalValue, { color: colors.text }]}>
                  ${deliveryFee.toFixed(2)}
                </Text>
              </View>
              
              {tip > 0 && (
                <View style={styles.orderTotalRow}>
                  <Text style={[styles.orderTotalLabel, { color: colors.muted }]}>
                    Tip ({tipPercentage}%)
                  </Text>
                  <Text style={[styles.orderTotalValue, { color: colors.text }]}>
                    ${tip.toFixed(2)}
                  </Text>
                </View>
              )}
              
              {discount > 0 && (
                <View style={styles.orderTotalRow}>
                  <Text style={[styles.orderTotalLabel, { color: colors.success }]}>
                    Discount
                  </Text>
                  <Text style={[styles.orderTotalValue, { color: colors.success }]}>
                    -${discount.toFixed(2)}
                  </Text>
                </View>
              )}
              
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              
              <View style={styles.orderTotalRow}>
                <Text style={[styles.orderTotalFinalLabel, { color: colors.text }]}>
                  Total
                </Text>
                <Text style={[styles.orderTotalFinalValue, { color: colors.primary }]}>
                  ${total.toFixed(2)}
                </Text>
              </View>
            </View>
          </Card>
          
          {/* Driver Tip */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <DollarSign size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Driver Tip
                </Text>
              </View>
            </View>
            
            <Text style={[styles.tipDescription, { color: colors.muted }]}>
              Show your appreciation to your delivery driver
            </Text>
            
            <View style={styles.tipOptions}>
              {[0, 10, 15, 20, 25].map((percentage) => (
                <TouchableOpacity
                  key={`tip-${percentage}`}
                  style={[
                    styles.tipOption,
                    tipPercentage === percentage && { 
                      backgroundColor: colors.primary + '20',
                      borderColor: colors.primary 
                    },
                    { borderColor: colors.border }
                  ]}
                  onPress={() => handleTipSelection(percentage)}
                >
                  <Text
                    style={[
                      styles.tipOptionText,
                      { color: tipPercentage === percentage ? colors.primary : colors.text }
                    ]}
                  >
                    {percentage === 0 ? 'No Tip' : `${percentage}%`}
                  </Text>
                  {percentage > 0 && (
                    <Text
                      style={[
                        styles.tipOptionAmount,
                        { color: tipPercentage === percentage ? colors.primary : colors.muted }
                      ]}
                    >
                      ${(subtotal * (percentage / 100)).toFixed(2)}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Card>
          
          {/* Promo Code */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <CheckCircle size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Promo Code
                </Text>
              </View>
            </View>
            
            <View style={styles.promoContainer}>
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChangeText={setPromoCode}
                containerStyle={styles.promoInput}
              />
              <Button
                title="Apply"
                onPress={handleApplyPromoCode}
                variant={promoCode ? 'primary' : 'outline'}
                size="sm"
                disabled={!promoCode}
              />
            </View>
            
            <Text style={[styles.promoHint, { color: colors.muted }]}>
              Try "WELCOME10" for 10% off your first order
            </Text>
          </Card>
          
          {/* Special Instructions */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <FileTextIcon size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Special Instructions
                </Text>
              </View>
            </View>
            
            <Input
              placeholder="Add any special delivery instructions..."
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={styles.instructionsInput}
            />
          </Card>
          
          {/* Payment */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <CreditCard size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Payment
                </Text>
              </View>
            </View>
            
            <View style={styles.paymentMethodContainer}>
              <TouchableOpacity
                style={[styles.paymentOption, paymentMethod === 'card' && styles.selectedOption]}
                onPress={() => setPaymentMethod('card')}
              >
                <CreditCard size={20} color={colors.text} />
                <Text style={[styles.paymentOptionText, { color: colors.text }]}>
                  Credit/Debit Card
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.paymentOption, paymentMethod === 'cash' && styles.selectedOption]}
                onPress={() => setPaymentMethod('cash')}
              >
                <Cash size={20} color={colors.text} />
                <Text style={[styles.paymentOptionText, { color: colors.text }]}>
                  Cash on Delivery
                </Text>
              </TouchableOpacity>
            </View>
            
            {paymentMethod === 'card' && (
              <View style={styles.cardDetailsSection}>
                <Input
                  style={styles.input}
                  placeholder="Card Number"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                  secureTextEntry
                />
                
                <View style={styles.expiryCvvContainer}>
                  <Input
                    style={styles.expiryInput}
                    placeholder="Expiry Date (MM/YY)"
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    keyboardType="numeric"
                  />
                  <Input
                    style={styles.cvvInput}
                    placeholder="CVV"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    secureTextEntry
                  />
                </View>
                
                <TouchableOpacity
                  style={styles.savedCardButton}
                  onPress={handleSavedCard}
                >
                  <Text style={[styles.savedCardButtonText, { color: colors.primary }]}>
                    Use Saved Card
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {error}
                </Text>
              </View>
            )}
            
            {/* Payment Button */}
            <Button
              title="Pay Now"
              onPress={handlePayment}
              loading={loading}
              style={styles.paymentButton}
            />
          </Card>
          
          {/* Place Order Button */}
          <Button
            title="Place Order"
            onPress={handlePlaceOrder}
            fullWidth
            style={styles.placeOrderButton}
            rightIcon={<ChevronRight size={20} color="#FFFFFF" />}
            disabled={!selectedAddress || !selectedPaymentMethod || !selectedTimeSlot}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addressContainer: {
    marginTop: 4,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 14,
    marginBottom: 2,
  },
  addButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  paymentMethodContainer: {
    marginTop: 4,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  paymentMethodExpiry: {
    fontSize: 14,
    marginLeft: 8,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeSlotText: {
    fontSize: 16,
    marginLeft: 8,
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderItemOptions: {
    fontSize: 12,
    marginTop: 2,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  orderTotals: {
    marginTop: 4,
  },
  orderTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderTotalLabel: {
    fontSize: 14,
  },
  orderTotalValue: {
    fontSize: 14,
  },
  orderTotalFinalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderTotalFinalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  tipDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  tipOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tipOption: {
    width: '18%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  tipOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tipOptionAmount: {
    fontSize: 12,
    marginTop: 4,
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  promoHint: {
    fontSize: 12,
    marginTop: 8,
  },
  instructionsInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  placeOrderButton: {
    marginBottom: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
  },
  browseButton: {
    width: 200,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    fontSize: 18,
    marginTop: 16,
  },
  paymentMethodContainer: {
    marginTop: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: colors.primary + '10',
  },
  paymentOptionText: {
    marginLeft: 12,
    fontSize: 16,
  },
  cardDetailsSection: {
    marginTop: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  expiryCvvContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expiryInput: {
    flex: 1,
    marginRight: 8,
  },
  cvvInput: {
    flex: 1,
  },
  savedCardButton: {
    alignItems: 'center',
    padding: 12,
  },
  savedCardButtonText: {
    fontSize: 16,
  },
  errorContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.error + '20',
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
  },
  paymentButton: {
    marginTop: 24,
  },
});