import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert, Button } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { Button as CustomButton } from '@/components/ui/Button';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  XCircle 
} from 'lucide-react-native';
import { getStatusColor, formatStatus, formatDate } from '@/utils/status-utils';

// Mock orders data for vendor
const mockVendorOrders = [
  {
    id: 'order-101',
    customer: {
      id: 'user-1',
      name: 'John Doe',
    },
    items: 3,
    total: 38.97,
    status: 'pending',
    createdAt: '2023-05-16T14:30:00.000Z',
  },
  {
    id: 'order-102',
    customer: {
      id: 'user-2',
      name: 'Jane Smith',
    },
    items: 2,
    total: 24.98,
    status: 'confirmed',
    createdAt: '2023-05-16T15:00:00.000Z',
  },
  {
    id: 'order-103',
    customer: {
      id: 'user-3',
      name: 'Mike Johnson',
    },
    items: 1,
    total: 12.99,
    status: 'preparing',
    createdAt: '2023-05-16T15:30:00.000Z',
  },
  {
    id: 'order-104',
    customer: {
      id: 'user-4',
      name: 'Sarah Williams',
    },
    items: 4,
    total: 52.96,
    status: 'ready_for_pickup',
    createdAt: '2023-05-16T16:00:00.000Z',
  },
  {
    id: 'order-105',
    customer: {
      id: 'user-5',
      name: 'David Brown',
    },
    items: 2,
    total: 27.50,
    status: 'out_for_delivery',
    createdAt: '2023-05-16T16:30:00.000Z',
  },
  {
    id: 'order-106',
    customer: {
      id: 'user-6',
      name: 'Emily Davis',
    },
    items: 5,
    total: 63.75,
    status: 'delivered',
    createdAt: '2023-05-16T17:00:00.000Z',
  },
  {
    id: 'order-107',
    customer: {
      id: 'user-7',
      name: 'Robert Wilson',
    },
    items: 3,
    total: 42.25,
    status: 'cancelled',
    createdAt: '2023-05-16T17:30:00.000Z',
  },
];

interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
  };
  items: number;
  total: number;
  status: string;
  createdAt: string;
}

const getVendorOrders = async (vendorId: string) => {
  // Replace with actual API call
  return mockVendorOrders;
};

const fetchOrderDetails = async (orderId: string) => {
  // Replace with actual API call
  return mockVendorOrders.find(order => order.id === orderId);
};

const updateOrderStatusAPI = async (orderId: string, newStatus: string) => {
  // Replace with actual API call
  return { id: orderId, status: newStatus };
};

export default function VendorOrdersScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const vendorOrders = await getVendorOrders('vendor-1');
      
      if (!vendorOrders || vendorOrders.length === 0) {
        setError('No orders found for this vendor');
        setOrders([]);
        return;
      }
      
      const filteredOrders = vendorOrders.filter(order => 
        order.status !== 'cancelled'
      );
      
      setOrders(filteredOrders);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    router.push(`/vendor-dashboard/order/${order.id}`);
  };

  const getOrderDetails = async (orderId: string) => {
    try {
      const order = await fetchOrderDetails(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrder = await updateOrderStatusAPI(orderId, newStatus);
      if (updatedOrder) {
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        
        Alert.alert('Success', 'Order status updated successfully');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading orders...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
        <CustomButton
          title="Retry"
          onPress={loadOrders}
          style={styles.retryButton}
        />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.muted }]}>
          No orders found
        </Text>
        <CustomButton
          title="Refresh"
          onPress={handleRefresh}
          style={styles.refreshButton}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Orders' }} />
      
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderItem}
            onPress={() => handleOrderClick(item)}
          >
            <View style={styles.orderHeader}>
              <Text style={[styles.orderNumber, { color: colors.text }]}>
                Order #{item.id}
              </Text>
              <Text style={[styles.orderStatus, { color: getStatusColor(item.status, colors) }]}>
                {formatStatus(item.status)}
              </Text>
            </View>
            
            <View style={styles.orderDetails}>
              <Text style={[styles.orderDate, { color: colors.muted }]}>
                {formatDate(item.createdAt)}
              </Text>
              <Text style={[styles.orderTotal, { color: colors.text }]}>
                ${item.total.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.orderActions}>
              {item.status === 'pending' && (
                <CustomButton
                  title="Confirm"
                  onPress={() => updateOrderStatus(item.id, 'confirmed')}
                  style={styles.acceptButton}
                />
              )}
              {item.status === 'confirmed' && (
                <CustomButton
                  title="Start Preparing"
                  onPress={() => updateOrderStatus(item.id, 'preparing')}
                  style={styles.readyButton}
                />
              )}
              {item.status === 'preparing' && (
                <CustomButton
                  title="Mark as Ready"
                  onPress={() => updateOrderStatus(item.id, 'ready_for_pickup')}
                  style={styles.readyButton}
                />
              )}
            </View>
          </TouchableOpacity>
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 120,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
  },
  refreshButton: {
    minWidth: 120,
  },
  orderItem: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 14,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.success + '20',
  },
  readyButton: {
    flex: 1,
    backgroundColor: colors.primary + '20',
  },
});