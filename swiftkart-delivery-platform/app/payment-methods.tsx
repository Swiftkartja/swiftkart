import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  CreditCard, 
  Wallet, 
  Trash, 
  Plus, 
  X,
  Check,
  Edit
} from 'lucide-react-native';
import { PaymentMethod } from '@/types';

// Mock payment methods
const initialPaymentMethods = [
  {
    id: 'card-1',
    type: 'card',
    cardNumber: '•••• •••• •••• 4242',
    cardHolder: 'John Doe',
    expiryDate: '12/25',
    isDefault: true,
  },
  {
    id: 'wallet-1',
    type: 'wallet',
    balance: 250.75,
    isDefault: false,
  },
];

export default function PaymentMethodsScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState<any | null>(null);
  
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  
  const handleAddCard = () => {
    // Reset form fields
    setCardNumber('');
    setCardHolder('');
    setExpiryDate('');
    setCvv('');
    setIsDefault(false);
    setEditingCard(null);
    
    // Show modal
    setShowAddCardModal(true);
  };
  
  const handleEditCard = (card: any) => {
    // Populate form with card data
    setCardNumber(card.cardNumber.replace(/[•\s]/g, ''));
    setCardHolder(card.cardHolder);
    setExpiryDate(card.expiryDate);
    setCvv('');
    setIsDefault(card.isDefault);
    setEditingCard(card);
    
    // Show modal
    setShowAddCardModal(true);
  };
  
  const handleDeleteCard = (id: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Check if we're deleting the default payment method
            const methodToDelete = paymentMethods.find(method => method.id === id);
            
            if (methodToDelete && methodToDelete.isDefault && paymentMethods.length > 1) {
              // If deleting the default method, make another method the default
              const newMethods = paymentMethods.filter(method => method.id !== id);
              newMethods[0].isDefault = true;
              setPaymentMethods(newMethods);
            } else {
              // Otherwise just delete the method
              setPaymentMethods(paymentMethods.filter(method => method.id !== id));
            }
            
            // Show success message
            Alert.alert('Success', 'Payment method deleted successfully');
          },
        },
      ]
    );
  };
  
  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    
    // Show success message
    Alert.alert('Success', 'Default payment method updated');
  };
  
  const handleSaveCard = () => {
    // Validate form
    if (!cardNumber.trim() || !cardHolder.trim() || !expiryDate.trim() || !cvv.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    // Format card number for display
    const formattedCardNumber = '•••• •••• •••• ' + cardNumber.slice(-4);
    
    // Create new card object
    const newCard = {
      id: editingCard ? editingCard.id : `card-${Date.now()}`,
      type: 'card',
      cardNumber: formattedCardNumber,
      cardHolder,
      expiryDate,
      isDefault,
    };
    
    if (editingCard) {
      // Update existing card
      const updatedMethods = paymentMethods.map(method => 
        method.id === editingCard.id ? newCard : method
      );
      
      // If this card is being set as default, update other methods
      if (isDefault) {
        updatedMethods.forEach(method => {
          if (method.id !== newCard.id) {
            method.isDefault = false;
          }
        });
      }
      
      setPaymentMethods(updatedMethods);
      Alert.alert('Success', 'Payment method updated successfully');
    } else {
      // Add new card
      const newMethods = [...paymentMethods, newCard];
      
      // If this is the first card or is being set as default, update other methods
      if (isDefault || paymentMethods.length === 0) {
        newMethods.forEach(method => {
          method.isDefault = method.id === newCard.id;
        });
      }
      
      setPaymentMethods(newMethods);
      Alert.alert('Success', 'Payment method added successfully');
    }
    
    // Close modal
    setShowAddCardModal(false);
  };
  
  const handleTopUpWallet = () => {
    router.push('/wallet');
  };
  
  // Format card number input
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limit = 16;
    
    if (cleaned.length > limit) {
      return cleaned.slice(0, limit);
    }
    
    return cleaned;
  };
  
  // Format expiry date input (MM/YY)
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length > 4) {
      return cleaned.slice(0, 4);
    }
    
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    
    return cleaned;
  };
  
  // Add Card Modal
  const AddCardModal = () => (
    <Modal
      visible={showAddCardModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddCardModal(false)}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingCard ? 'Edit Card' : 'Add New Card'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddCardModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.cardPreview}>
                <View style={[styles.cardPreviewInner, { backgroundColor: colors.primary }]}>
                  <CreditCard size={32} color="#FFFFFF" />
                  <Text style={styles.cardPreviewNumber}>
                    {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                  </Text>
                  <View style={styles.cardPreviewDetails}>
                    <View>
                      <Text style={styles.cardPreviewLabel}>CARD HOLDER</Text>
                      <Text style={styles.cardPreviewValue}>
                        {cardHolder || 'YOUR NAME'}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.cardPreviewLabel}>EXPIRES</Text>
                      <Text style={styles.cardPreviewValue}>
                        {expiryDate || 'MM/YY'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <Text style={[styles.inputLabel, { color: colors.text }]}>Card Number</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.subtle, color: colors.text, borderColor: colors.border }
                ]}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={colors.muted}
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                keyboardType="number-pad"
                maxLength={16}
              />
              
              <Text style={[styles.inputLabel, { color: colors.text }]}>Card Holder Name</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.subtle, color: colors.text, borderColor: colors.border }
                ]}
                placeholder="John Doe"
                placeholderTextColor={colors.muted}
                value={cardHolder}
                onChangeText={setCardHolder}
                autoCapitalize="words"
              />
              
              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Expiry Date</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: colors.subtle, color: colors.text, borderColor: colors.border }
                    ]}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.muted}
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
                
                <View style={styles.halfInput}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>CVV</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: colors.subtle, color: colors.text, borderColor: colors.border }
                    ]}
                    placeholder="123"
                    placeholderTextColor={colors.muted}
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.defaultCheckbox}
                onPress={() => setIsDefault(!isDefault)}
              >
                <View
                  style={[
                    styles.checkbox,
                    isDefault
                      ? { backgroundColor: colors.primary, borderColor: colors.primary }
                      : { backgroundColor: 'transparent', borderColor: colors.border }
                  ]}
                >
                  {isDefault && <Check size={16} color="#FFFFFF" />}
                </View>
                <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                  Set as default payment method
                </Text>
              </TouchableOpacity>
              
              <Text style={[styles.securePaymentText, { color: colors.muted }]}>
                Your payment information is encrypted and secure. Powered by Fygaro.
              </Text>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowAddCardModal(false)}
                style={[styles.modalButton, { borderColor: colors.border }]}
                textStyle={{ color: colors.text }}
              />
              <Button
                title="Save Card"
                onPress={handleSaveCard}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Payment Methods' }} />
      
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {paymentMethods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <CreditCard size={64} color={colors.muted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Payment Methods
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.muted }]}>
              You haven't added any payment methods yet. Add a card to make checkout faster.
            </Text>
          </View>
        ) : (
          paymentMethods.map(method => (
            <Card key={method.id} style={styles.methodCard} elevation={1}>
              {method.type === 'card' ? (
                <View style={styles.cardMethod}>
                  <View style={styles.methodHeader}>
                    <View style={styles.methodTitleContainer}>
                      <CreditCard size={24} color={colors.primary} />
                      <View style={styles.methodTitleContent}>
                        <Text style={[styles.methodTitle, { color: colors.text }]}>
                          {method.cardNumber}
                        </Text>
                        {method.isDefault && (
                          <View
                            style={[
                              styles.defaultBadge,
                              { backgroundColor: colors.primary + '20' },
                            ]}
                          >
                            <Text
                              style={[
                                styles.defaultText,
                                { color: colors.primary },
                              ]}
                            >
                              Default
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.methodActions}>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: colors.subtle },
                        ]}
                        onPress={() => handleEditCard(method)}
                      >
                        <Edit size={16} color={colors.primary} />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: colors.subtle },
                        ]}
                        onPress={() => handleDeleteCard(method.id)}
                      >
                        <Trash size={16} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.cardDetails}>
                    <Text style={[styles.cardDetailText, { color: colors.muted }]}>
                      {method.cardHolder} • Expires {method.expiryDate}
                    </Text>
                  </View>
                  
                  {!method.isDefault && (
                    <Button
                      title="Set as Default"
                      variant="outline"
                      size="sm"
                      onPress={() => handleSetDefault(method.id)}
                      style={styles.defaultButton}
                    />
                  )}
                </View>
              ) : (
                <View style={styles.walletMethod}>
                  <View style={styles.methodHeader}>
                    <View style={styles.methodTitleContainer}>
                      <Wallet size={24} color={colors.primary} />
                      <View style={styles.methodTitleContent}>
                        <Text style={[styles.methodTitle, { color: colors.text }]}>
                          SwiftKart Wallet
                        </Text>
                        {method.isDefault && (
                          <View
                            style={[
                              styles.defaultBadge,
                              { backgroundColor: colors.primary + '20' },
                            ]}
                          >
                            <Text
                              style={[
                                styles.defaultText,
                                { color: colors.primary },
                              ]}
                            >
                              Default
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.methodActions}>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: colors.subtle },
                        ]}
                        onPress={() => handleDeleteCard(method.id)}
                      >
                        <Trash size={16} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.walletBalance}>
                    <Text style={[styles.balanceLabel, { color: colors.muted }]}>
                      Available Balance
                    </Text>
                    <Text style={[styles.balanceAmount, { color: colors.text }]}>
                      ${method.balance.toFixed(2)}
                    </Text>
                  </View>
                  
                  <View style={styles.walletActions}>
                    {!method.isDefault && (
                      <Button
                        title="Set as Default"
                        variant="outline"
                        size="sm"
                        onPress={() => handleSetDefault(method.id)}
                        style={styles.walletButton}
                      />
                    )}
                    
                    <Button
                      title="Top Up"
                      size="sm"
                      onPress={handleTopUpWallet}
                      style={styles.walletButton}
                    />
                  </View>
                </View>
              )}
            </Card>
          ))
        )}
        
        <Button
          title="Add New Card"
          leftIcon={<Plus size={18} color="#FFFFFF" />}
          onPress={handleAddCard}
          style={styles.addButton}
        />
        
        {!paymentMethods.some(method => method.type === 'wallet') && (
          <Button
            title="Setup Wallet"
            leftIcon={<Wallet size={18} color="#FFFFFF" />}
            onPress={() => router.push('/wallet')}
            style={styles.addButton}
            variant="outline"
          />
        )}
      </ScrollView>
      
      <AddCardModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  methodCard: {
    marginBottom: 16,
  },
  cardMethod: {
    padding: 16,
  },
  walletMethod: {
    padding: 16,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  methodTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodTitleContent: {
    marginLeft: 12,
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '500',
  },
  methodActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDetails: {
    marginBottom: 16,
  },
  cardDetailText: {
    fontSize: 14,
  },
  defaultButton: {
    alignSelf: 'flex-start',
  },
  walletBalance: {
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '600',
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
  },
  walletButton: {
    flex: 1,
  },
  addButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalBody: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  cardPreview: {
    marginBottom: 24,
    alignItems: 'center',
  },
  cardPreviewInner: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: 12,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardPreviewNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  cardPreviewDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardPreviewLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  cardPreviewValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  defaultCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  securePaymentText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});