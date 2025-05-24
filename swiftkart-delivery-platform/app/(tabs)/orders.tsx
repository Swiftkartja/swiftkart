import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { 
  Search, 
  ShoppingBag, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  XCircle,
  Store
} from 'lucide-react-native';
import { getStatusColor, formatStatus, formatDate } from '@/utils/status-utils';

// Mock orders data for customer
const mockCustomerOrders = [
  {
    id: 'order-101',
    vendor: {
      id: 'vendor-1',
      name: 'Fresh Eats',
      logo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    items: 3,
    total: 38.97,
    status: 'delivered',
    createdAt: '2023-05-16T14:30:00.000Z',
  },
  {
    id: 'order-102',
    vendor: {
      id: 'vendor-2',
      name: 'Quick Mart',
      logo: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    items: 2,
    total: 24.98,
    status: 'out_for_delivery',
    createdAt: '2023-05-16T15:00:00.000Z',
  },
  {
    id: 'order-103',
    vendor: {
      id: 'vendor-3',
      name: 'MediCare Pharmacy',
      logo: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    items: 1,
    total: 12.99,
    status: 'preparing',
    createdAt: '2023-05-16T15:30:00.000Z',
  },
  {
    id: 'order-104',
    vendor: {
      id: 'vendor-4',
      name: 'Tech Store',
      logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    items: 4,
    total: 52.96,
    status: 'confirmed',
    createdAt: '2023-05-16T16:00:00.000Z',
  },
  {
    id: 'order-105',
    vendor: {
      id: 'vendor-1',
      name: 'Fresh Eats',
      logo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    items: 2,
    total: 27.50,
    status: 'pending',
    createdAt: '2023-05-16T16:30:00.000Z',
  },
  {
    id: 'order-106',
    vendor: {
      id: 'vendor-2',
      name: 'Quick Mart',
      logo: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    items: 5,
    total: 63.75,
    status: 'cancelled',
    createdAt: '2023-05-16T17:00:00.000Z',
  },
];

export default function CustomerOrdersScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  // Filter orders based on search query and selected status
  const filteredOrders = mockCustomerOrders.filter(order => {
    const matchesSearch = 
      order.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === null || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleOrderPress = (orderId: string) => {
    router.push(`/order/${orderId}`);
  };
  
  const handleTrackOrder = (orderId: string) => {
    router.push(`/track-order/${orderId}`);
  };
  
  const getStatusIcon = (status: string, colors: any) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} color={getStatusColor(status, colors)} />;
      case 'confirmed':
        return <CheckCircle size={16} color={getStatusColor(status, colors)} />;
      case 'preparing':
        return <Package size={16} color={getStatusColor(status, colors)} />;
      case 'ready_for_pickup':
        return <Package size={16} color={getStatusColor(status, colors)} />;
      case 'out_for_delivery':
        return <Truck size={16} color={getStatusColor(status, colors)} />;
      case 'delivered':
        return <CheckCircle size={16} color={getStatusColor(status, colors)} />;
      case 'cancelled':
        return <XCircle size={16} color={getStatusColor(status, colors)} />;
      default:
        return <Clock size={16} color={getStatusColor(status, colors)} />;
    }
  };
  
  const renderOrderItem = ({ item }: { item: any }) => (
    <Card
      style={styles.orderCard}
      onPress={() => handleOrderPress(item.id)}
      elevation={1}
    >
      <View style={styles.orderHeader}>
        <View style={styles.vendorInfo}>
          <Store size={20} color={colors.primary} />
          <Text style={[styles.vendorName, { color: colors.text }]}>
            {item.vendor.name}
          </Text>
        </View>
        
        <View style={styles.statusContainer}>
          {getStatusIcon(item.status, colors)}
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.status, colors) },
            ]}
          >
            {formatStatus(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      
      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.muted }]}>
            Order ID:
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            #{item.id.split('-')[1]}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.muted }]}>
            Date:
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.muted }]}>
            Items:
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {item.items} {item.items === 1 ? 'item' : 'items'}
          </Text>
        </View>
        
        <View style={styles.orderTotal}>
          <Text style={[styles.totalLabel, { color: colors.muted }]}>
            Total:
          </Text>
          <Text style={[styles.totalValue, { color: colors.primary }]}>
            ${item.total.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderActions}>
        {(item.status === 'out_for_delivery' || item.status === 'preparing') && (
          <TouchableOpacity
            style={[styles.trackButton, { backgroundColor: colors.primary }]}
            onPress={() => handleTrackOrder(item.id)}
          >
            <Truck size={16} color="#FFFFFF" />
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.detailsButton, { borderColor: colors.border }]}
          onPress={() => handleOrderPress(item.id)}
        >
          <Text style={[styles.detailsButtonText, { color: colors.text }]}>
            View Details
          </Text>
          <ChevronRight size={16} color={colors.text} />
        </TouchableOpacity>
      </View>
    </Card>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'My Orders' }} />
      
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Search size={20} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search orders..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <Text style={[styles.filterLabel, { color: colors.text }]}>
          Filter by status:
        </Text>
        <ScrollableFilters 
          selectedStatus={selectedStatus} 
          setSelectedStatus={setSelectedStatus}
          colors={colors}
        />
      </View>
      
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ShoppingBag size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No orders found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.muted }]}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </View>
  );
}

function ScrollableFilters({ selectedStatus, setSelectedStatus, colors }: any) {
  const filters = [
    { id: null, label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'ready_for_pickup', label: 'Ready for Pickup' },
    { id: 'out_for_delivery', label: 'Out for Delivery' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];
  
  return (
    <FlatList
      data={filters}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.filterOption,
            selectedStatus === item.id && { 
              backgroundColor: item.id 
                ? getStatusColor(item.id, colors) + '20' 
                : colors.primary + '20' 
            },
          ]}
          onPress={() => setSelectedStatus(item.id)}
        >
          <Text
            style={[
              styles.filterText,
              { 
                color: selectedStatus === item.id 
                  ? (item.id ? getStatusColor(item.id, colors) : colors.primary) 
                  : colors.text 
              },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersScrollContent}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  filtersScrollContent: {
    paddingRight: 16,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginRight: 8,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  orderCard: {
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vendorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  orderDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    width: 70,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  orderTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 14,
    marginRight: 4,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});