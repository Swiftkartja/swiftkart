import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Wallet as WalletIcon, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle, 
  XCircle,
  CreditCard,
  DollarSign,
  X,
  ChevronRight
} from 'lucide-react-native';
import { Transaction } from '@/types';
import { formatDate } from '@/utils/status-utils';
import PaymentService from '@/services/payment-service';

// Mock wallet data
const mockWalletData = {
  id: 'wallet-1',
  balance: 250.75,
  currency: 'JMD',
  transactions: [
    {
      id: 'tx-1',
      amount: 50.00,
      type: 'credit',
      description: 'Top-up from Credit Card',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      status: 'completed',
    },
    {
      id: 'tx-2',
      amount: 25.50,
      type: 'debit',
      description: 'Payment for Order #12345',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      status: 'completed',
    },
    {
      id: 'tx-3',
      amount: 100.00,
      type: 'credit',
      description: 'Top-up from Bank Transfer',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      status: 'completed',
    },
    {
      id: 'tx-4',
      amount: 75.25,
      type: 'debit',
      description: 'Payment for Order #12346',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      status: 'completed',
    },
    {
      id: 'tx-5',
      amount: 200.00,
      type: 'credit',
      description: 'Top-up from Credit Card',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      status: 'completed',
    },
  ] as Transaction[],
};

export default function WalletScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  
  const [wallet, setWallet] = useState(mockWalletData);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'credits' | 'debits'>('all');
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Initialize payment service
  useEffect(() => {
    PaymentService.initialize();
  }, []);
  
  // Filter transactions based on active tab
  const filteredTransactions = wallet.transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    if (activeTab === 'credits') return transaction.type === 'credit';
    if (activeTab === 'debits') return transaction.type === 'debit';
    return true;
  });
  
  const handleTopUp = async () => {
    // Validate amount
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Process payment with Fygaro
      const result = await PaymentService.topUpWallet({
        amount,
        currency: 'JMD',
        customerId: 'user-1', // In a real app, this would be the actual user ID
        description: 'Wallet top-up',
        paymentMethod: 'card',
      });
      
      if (result.status === 'completed') {
        // Add transaction to wallet
        const newTransaction: Transaction = {
          id: result.id,
          amount,
          type: 'credit',
          description: 'Top-up from Credit Card',
          date: new Date().toISOString(),
          status: 'completed',
        };
        
        // Update wallet balance and transactions
        setWallet({
          ...wallet,
          balance: wallet.balance + amount,
          transactions: [newTransaction, ...wallet.transactions],
        });
        
        // Close modal and show success message
        setShowTopUpModal(false);
        setTopUpAmount('');
        Alert.alert('Success', `Your wallet has been topped up with $${amount.toFixed(2)}.`);
      } else {
        Alert.alert('Top-up Failed', 'There was an error processing your payment. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      console.error('Top-up error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };
  
  // Top-up Modal
  const TopUpModal = () => (
    <Modal
      visible={showTopUpModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowTopUpModal(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Top Up Wallet
            </Text>
            <TouchableOpacity 
              onPress={() => setShowTopUpModal(false)}
              disabled={isProcessing}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBody}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Enter Amount
            </Text>
            
            <View style={styles.amountInputContainer}>
              <Text style={[styles.currencySymbol, { color: colors.text }]}>
                $
              </Text>
              <TextInput
                style={[
                  styles.amountInput,
                  { color: colors.text }
                ]}
                placeholder="0.00"
                placeholderTextColor={colors.muted}
                keyboardType="decimal-pad"
                value={topUpAmount}
                onChangeText={setTopUpAmount}
                editable={!isProcessing}
              />
              <Text style={[styles.currencyCode, { color: colors.muted }]}>
                JMD
              </Text>
            </View>
            
            <View style={styles.quickAmounts}>
              {[50, 100, 200, 500].map(amount => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.quickAmountButton,
                    { backgroundColor: colors.subtle, borderColor: colors.border }
                  ]}
                  onPress={() => setTopUpAmount(amount.toString())}
                  disabled={isProcessing}
                >
                  <Text style={[styles.quickAmountText, { color: colors.text }]}>
                    ${amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={[styles.paymentMethodTitle, { color: colors.text }]}>
              Payment Method
            </Text>
            
            <TouchableOpacity
              style={[styles.paymentMethodButton, { backgroundColor: colors.subtle, borderColor: colors.border }]}
              disabled={isProcessing}
            >
              <CreditCard size={20} color={colors.primary} />
              <Text style={[styles.paymentMethodText, { color: colors.text }]}>
                Credit/Debit Card
              </Text>
              <View style={styles.selectedIndicator}>
                <View style={[styles.selectedDot, { backgroundColor: colors.primary }]} />
              </View>
            </TouchableOpacity>
            
            <Text style={[styles.securePaymentText, { color: colors.muted }]}>
              Secure payments powered by Fygaro. Your payment information is encrypted and secure.
            </Text>
          </View>
          
          <View style={styles.modalFooter}>
            <Button
              title={isProcessing ? 'Processing...' : 'Top Up'}
              onPress={handleTopUp}
              fullWidth
              disabled={isProcessing || !topUpAmount}
              leftIcon={isProcessing ? <ActivityIndicator size="small" color="#FFFFFF" /> : undefined}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
  
  // Transaction Details Modal
  const TransactionDetailsModal = () => {
    if (!selectedTransaction) return null;
    
    const isCredit = selectedTransaction.type === 'credit';
    
    return (
      <Modal
        visible={showTransactionDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTransactionDetails(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Transaction Details
              </Text>
              <TouchableOpacity onPress={() => setShowTransactionDetails(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={[styles.transactionIconLarge, { 
                backgroundColor: isCredit ? colors.success + '20' : colors.error + '20' 
              }]}>
                {isCredit ? (
                  <ArrowDownLeft size={32} color={colors.success} />
                ) : (
                  <ArrowUpRight size={32} color={colors.error} />
                )}
              </View>
              
              <Text style={[styles.transactionAmountLarge, { 
                color: isCredit ? colors.success : colors.error 
              }]}>
                {isCredit ? '+' : '-'} ${selectedTransaction.amount.toFixed(2)}
              </Text>
              
              <Text style={[styles.transactionStatusLarge, { 
                color: selectedTransaction.status === 'completed' ? colors.success : 
                      selectedTransaction.status === 'pending' ? colors.warning : colors.error
              }]}>
                {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
              </Text>
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.muted }]}>
                    Transaction ID
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {selectedTransaction.id}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.muted }]}>
                    Date & Time
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {formatDate(selectedTransaction.date)}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.muted }]}>
                    Description
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {selectedTransaction.description}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.muted }]}>
                    Type
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {isCredit ? 'Credit (Money In)' : 'Debit (Money Out)'}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.muted }]}>
                    Currency
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    JMD (Jamaican Dollar)
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <Button
                title="Close"
                variant="outline"
                onPress={() => setShowTransactionDetails(false)}
                fullWidth
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Wallet' }} />
      
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.balanceCard} elevation={2}>
          <View style={styles.balanceHeader}>
            <WalletIcon size={24} color={colors.primary} />
            <Text style={[styles.balanceTitle, { color: colors.text }]}>
              Wallet Balance
            </Text>
          </View>
          
          <Text style={[styles.balanceAmount, { color: colors.text }]}>
            ${wallet.balance.toFixed(2)}
          </Text>
          <Text style={[styles.balanceCurrency, { color: colors.muted }]}>
            JMD
          </Text>
          
          <View style={styles.balanceActions}>
            <Button
              title="Top Up"
              leftIcon={<Plus size={18} color="#FFFFFF" />}
              onPress={() => setShowTopUpModal(true)}
              style={styles.topUpButton}
            />
            
            <Button
              title="Transaction History"
              variant="outline"
              onPress={() => {
                // Scroll to transactions section
                // In a real app, this would use a ref to scroll
                Alert.alert('Info', 'Transaction history is displayed below.');
              }}
              style={[styles.historyButton, { borderColor: colors.border }]}
              textStyle={{ color: colors.text }}
            />
          </View>
        </Card>
        
        <View style={styles.transactionsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Transaction History
          </Text>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'all' && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                { borderColor: colors.border }
              ]}
              onPress={() => setActiveTab('all')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'all' ? colors.primary : colors.text }
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'credits' && { backgroundColor: colors.success + '20', borderColor: colors.success },
                { borderColor: colors.border }
              ]}
              onPress={() => setActiveTab('credits')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'credits' ? colors.success : colors.text }
                ]}
              >
                Money In
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'debits' && { backgroundColor: colors.error + '20', borderColor: colors.error },
                { borderColor: colors.border }
              ]}
              onPress={() => setActiveTab('debits')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'debits' ? colors.error : colors.text }
                ]}
              >
                Money Out
              </Text>
            </TouchableOpacity>
          </View>
          
          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyTransactions}>
              <Clock size={48} color={colors.muted} />
              <Text style={[styles.emptyTransactionsText, { color: colors.text }]}>
                No transactions found
              </Text>
            </View>
          ) : (
            filteredTransactions.map(transaction => (
              <TouchableOpacity
                key={transaction.id}
                style={[styles.transactionCard, { backgroundColor: colors.card }]}
                onPress={() => handleViewTransaction(transaction)}
              >
                <View style={styles.transactionContent}>
                  <View
                    style={[
                      styles.transactionIcon,
                      {
                        backgroundColor:
                          transaction.type === 'credit'
                            ? colors.success + '20'
                            : colors.error + '20',
                      },
                    ]}
                  >
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft size={20} color={colors.success} />
                    ) : (
                      <ArrowUpRight size={20} color={colors.error} />
                    )}
                  </View>
                  
                  <View style={styles.transactionDetails}>
                    <Text style={[styles.transactionDescription, { color: colors.text }]}>
                      {transaction.description}
                    </Text>
                    <Text style={[styles.transactionDate, { color: colors.muted }]}>
                      {formatDate(transaction.date)}
                    </Text>
                  </View>
                  
                  <View style={styles.transactionAmount}>
                    <Text
                      style={[
                        styles.amountText,
                        {
                          color:
                            transaction.type === 'credit'
                              ? colors.success
                              : colors.error,
                        },
                      ]}
                    >
                      {transaction.type === 'credit' ? '+' : '-'} ${transaction.amount.toFixed(2)}
                    </Text>
                    <View style={styles.statusContainer}>
                      {transaction.status === 'completed' ? (
                        <CheckCircle size={14} color={colors.success} />
                      ) : transaction.status === 'pending' ? (
                        <Clock size={14} color={colors.warning} />
                      ) : (
                        <XCircle size={14} color={colors.error} />
                      )}
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              transaction.status === 'completed'
                                ? colors.success
                                : transaction.status === 'pending'
                                ? colors.warning
                                : colors.error,
                          },
                        ]}
                      >
                        {transaction.status}
                      </Text>
                    </View>
                  </View>
                  
                  <ChevronRight size={16} color={colors.muted} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      
      <TopUpModal />
      <TransactionDetailsModal />
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
  balanceCard: {
    marginBottom: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 4,
  },
  balanceCurrency: {
    fontSize: 14,
    marginBottom: 16,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topUpButton: {
    flex: 1,
    marginRight: 8,
  },
  historyButton: {
    flex: 1,
    marginLeft: 8,
  },
  transactionsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  transactionCard: {
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmount: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
  },
  emptyTransactions: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTransactionsText: {
    fontSize: 16,
    marginTop: 16,
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
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
  },
  currencyCode: {
    fontSize: 16,
    marginLeft: 8,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  quickAmountButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    margin: 4,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '500',
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  securePaymentText: {
    fontSize: 12,
    textAlign: 'center',
  },
  // Transaction Details Modal
  transactionIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  transactionAmountLarge: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  transactionStatusLarge: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  detailsContainer: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    padding: 16,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});