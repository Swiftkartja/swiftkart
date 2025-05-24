import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  RefreshControl,
  Dimensions,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  DollarSign, 
  Package, 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  Users, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Bell,
  Settings,
  MessageSquare,
  Truck,
  Wrench
} from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';

// Mock data for the dashboard
const mockRevenueData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [5000, 7500, 6000, 8100, 5600, 9800, 8200],
      color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Green color
      strokeWidth: 2
    }
  ],
};

const mockOrdersData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [12, 18, 15, 22, 17, 25, 20],
      color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // Blue color
      strokeWidth: 2
    }
  ],
};

const mockRecentOrders = [
  {
    id: 'order-1',
    customer: 'John Smith',
    items: 3,
    total: 78.50,
    status: 'pending',
    date: '2023-06-15T14:30:00Z'
  },
  {
    id: 'order-2',
    customer: 'Sarah Johnson',
    items: 1,
    total: 25.99,
    status: 'confirmed',
    date: '2023-06-15T12:15:00Z'
  },
  {
    id: 'order-3',
    customer: 'Michael Brown',
    items: 5,
    total: 124.75,
    status: 'preparing',
    date: '2023-06-15T10:45:00Z'
  },
  {
    id: 'order-4',
    customer: 'Emily Davis',
    items: 2,
    total: 45.00,
    status: 'delivered',
    date: '2023-06-14T16:20:00Z'
  }
];

const mockPopularProducts = [
  {
    id: 'product-1',
    name: 'Jerk Chicken Meal',
    price: 15.99,
    sold: 48,
    image: 'https://images.unsplash.com/photo-1585703900468-13c7a978ad86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'product-2',
    name: 'Ackee and Saltfish',
    price: 12.50,
    sold: 36,
    image: 'https://images.unsplash.com/photo-1578861256457-dfcfb6d8e592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'product-3',
    name: 'Curry Goat with Rice',
    price: 18.75,
    sold: 29,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  }
];

export default function VendorDashboardScreen() {
  const { colors } = useThemeStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'revenue' | 'orders'>('revenue');
  const [vendorInfo, setVendorInfo] = useState(user?.vendorInfo || {
    storeName: 'Your Store',
    rating: 0,
    reviewCount: 0,
    isOpen: false
  });
  const screenWidth = Dimensions.get('window').width - 40; // Accounting for padding
  
  // Calculate summary stats
  const todayRevenue = 1250.75;
  const weekRevenue = 8750.25;
  const monthRevenue = 32500.50;
  
  const todayOrders = 15;
  const pendingOrders = 8;
  const completedOrders = 7;
  
  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, fetch fresh data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  const handleUpdateStoreStatus = async () => {
    try {
      // Update store status in backend
      const updatedStatus = !vendorInfo.isOpen;
      await updateVendorStatus(updatedStatus);
      
      // Update user in auth store
      const updatedUser = {
        ...user,
        vendorInfo: {
          ...user?.vendorInfo,
          isOpen: updatedStatus
        }
      };
      
      // Update local state
      setVendorInfo(updatedUser.vendorInfo);
      
      // Update auth store
      useAuthStore.getState().updateUser(updatedUser);
      
      Alert.alert(
        'Success',
        `Store status updated to ${updatedStatus ? 'Open' : 'Closed'}`
      );
    } catch (error) {
      console.error('Error updating store status:', error);
      Alert.alert(
        'Error',
        'Failed to update store status. Please try again.'
      );
    }
  };
  
  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'confirmed':
        return colors.info;
      case 'preparing':
        return colors.primary;
      case 'ready_for_pickup':
        return colors.success;
      case 'out_for_delivery':
        return colors.info;
      case 'delivered':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.muted;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Stack.Screen 
        options={{ 
          title: 'Vendor Dashboard',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push('/vendor-dashboard/notifications')}
              >
                <Bell size={24} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push('/vendor-dashboard/settings')}
              >
                <Settings size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          )
        }} 
      />
      
      {/* Store Info Card */}
      <Card style={styles.storeInfoCard}>
        <View style={styles.storeInfoHeader}>
          <View style={styles.storeInfoLeft}>
            <Image 
              source={{ 
                uri: vendorInfo.logo || 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' 
              }} 
              style={styles.storeLogo} 
            />
            <View style={styles.storeDetails}>
              <Text style={[styles.storeName, { color: colors.text }]}>
                {vendorInfo.storeName}
              </Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color={colors.warning} fill={colors.warning} />
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {vendorInfo.rating?.toFixed(1) || '0.0'} ({vendorInfo.reviewCount || 0} reviews)
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.storeStatus}>
            <TouchableOpacity
              style={[
                styles.statusToggle,
                { 
                  backgroundColor: vendorInfo.isOpen 
                    ? colors.success + '20' 
                    : colors.error + '20' 
                }
              ]}
              onPress={handleUpdateStoreStatus}
            >
              <View style={[
                styles.statusIndicator,
                { backgroundColor: vendorInfo.isOpen ? colors.success : colors.error }
              ]} />
              <Text style={[
                styles.statusText,
                { 
                  color: vendorInfo.isOpen ? colors.success : colors.error 
                }
              ]}>
                {vendorInfo.isOpen ? 'Open' : 'Closed'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <DollarSign size={20} color={colors.success} />
            <View style={styles.statContent}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                ${todayRevenue.toFixed(2)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Today
              </Text>
            </View>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <ShoppingBag size={20} color={colors.primary} />
            <View style={styles.statContent}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {todayOrders}
              </Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Orders
              </Text>
            </View>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Clock size={20} color={colors.warning} />
            <View style={styles.statContent}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {pendingOrders}
              </Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Pending
              </Text>
            </View>
          </View>
        </View>
      </Card>
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.primary + '10' }]}
          onPress={() => router.push('/vendor-dashboard/orders')}
        >
          <ShoppingBag size={24} color={colors.primary} />
          <Text style={[styles.actionButtonText, { color: colors.text }]}>
            Orders
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.info + '10' }]}
          onPress={() => router.push('/vendor-dashboard/products')}
        >
          <Package size={24} color={colors.info} />
          <Text style={[styles.actionButtonText, { color: colors.text }]}>
            Products
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.success + '10' }]}
          onPress={() => router.push('/vendor-dashboard/services')}
        >
          <Wrench size={24} color={colors.success} />
          <Text style={[styles.actionButtonText, { color: colors.text }]}>
            Services
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.warning + '10' }]}
          onPress={() => router.push('/messages')}
        >
          <MessageSquare size={24} color={colors.warning} />
          <Text style={[styles.actionButtonText, { color: colors.text }]}>
            Messages
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Analytics Card */}
      <Card style={styles.analyticsCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <TrendingUp size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Analytics
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/vendor-dashboard/analytics')}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabButtons}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'revenue' && { 
                backgroundColor: colors.primary + '20',
                borderColor: colors.primary
              },
              { borderColor: colors.border }
            ]}
            onPress={() => setActiveTab('revenue')}
          >
            <Text style={[
              styles.tabButtonText,
              { color: activeTab === 'revenue' ? colors.primary : colors.text }
            ]}>
              Revenue
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'orders' && { 
                backgroundColor: colors.primary + '20',
                borderColor: colors.primary
              },
              { borderColor: colors.border }
            ]}
            onPress={() => setActiveTab('orders')}
          >
            <Text style={[
              styles.tabButtonText,
              { color: activeTab === 'orders' ? colors.primary : colors.text }
            ]}>
              Orders
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.chartContainer}>
          <LineChart
            data={activeTab === 'revenue' ? mockRevenueData : mockOrdersData}
            width={screenWidth}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => 
                activeTab === 'revenue' 
                  ? `rgba(46, 204, 113, ${opacity})` 
                  : `rgba(52, 152, 219, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </View>
        
        <View style={styles.analyticsStats}>
          <View style={styles.analyticStat}>
            <Text style={[styles.analyticStatLabel, { color: colors.muted }]}>
              {activeTab === 'revenue' ? 'Today' : 'Today'}
            </Text>
            <Text style={[styles.analyticStatValue, { color: colors.text }]}>
              {activeTab === 'revenue' ? `$${todayRevenue.toFixed(2)}` : todayOrders}
            </Text>
          </View>
          
          <View style={styles.analyticStat}>
            <Text style={[styles.analyticStatLabel, { color: colors.muted }]}>
              {activeTab === 'revenue' ? 'This Week' : 'Pending'}
            </Text>
            <Text style={[styles.analyticStatValue, { color: colors.text }]}>
              {activeTab === 'revenue' ? `$${weekRevenue.toFixed(2)}` : pendingOrders}
            </Text>
          </View>
          
          <View style={styles.analyticStat}>
            <Text style={[styles.analyticStatLabel, { color: colors.muted }]}>
              {activeTab === 'revenue' ? 'This Month' : 'Completed'}
            </Text>
            <Text style={[styles.analyticStatValue, { color: colors.text }]}>
              {activeTab === 'revenue' ? `$${monthRevenue.toFixed(2)}` : completedOrders}
            </Text>
          </View>
        </View>
      </Card>
      
      {/* Recent Orders */}
      <Card style={styles.recentOrdersCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <ShoppingBag size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Recent Orders
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/vendor-dashboard/orders')}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        {mockRecentOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={[styles.orderItem, { borderBottomColor: colors.border }]}
            onPress={() => router.push({
              pathname: '/order/[id]',
              params: { id: order.id }
            })}
          >
            <View style={styles.orderInfo}>
              <Text style={[styles.orderCustomer, { color: colors.text }]}>
                {order.customer}
              </Text>
              <Text style={[styles.orderMeta, { color: colors.muted }]}>
                {order.items} {order.items === 1 ? 'item' : 'items'} • ${order.total.toFixed(2)}
              </Text>
              <Text style={[styles.orderDate, { color: colors.muted }]}>
                {formatDate(order.date)}
              </Text>
            </View>
            <View style={styles.orderStatus}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(order.status) + '20' }
              ]}>
                <Text style={[
                  styles.statusBadgeText,
                  { color: getStatusColor(order.status) }
                ]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
              <ChevronRight size={16} color={colors.muted} />
            </View>
          </TouchableOpacity>
        ))}
      </Card>
      
      {/* Popular Products */}
      <Card style={styles.popularProductsCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Package size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Popular Products
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/vendor-dashboard/products')}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.productsGrid}>
          {mockPopularProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[styles.productCard, { backgroundColor: colors.card }]}
              onPress={() => router.push({
                pathname: '/product/[id]',
                params: { id: product.id }
              })}
            >
              <Image 
                source={{ uri: product.image }} 
                style={styles.productImage} 
              />
              <View style={styles.productInfo}>
                <Text 
                  style={[styles.productName, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {product.name}
                </Text>
                <View style={styles.productMeta}>
                  <Text style={[styles.productPrice, { color: colors.primary }]}>
                    ${product.price.toFixed(2)}
                  </Text>
                  <Text style={[styles.productSold, { color: colors.muted }]}>
                    {product.sold} sold
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
      
      {/* Quick Actions */}
      <Card style={styles.quickActionsCard}>
        <Text style={[styles.quickActionsTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: colors.primary + '10' }]}
            onPress={() => router.push('/vendor-dashboard/add-product')}
          >
            <Package size={24} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>
              Add Product
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: colors.success + '10' }]}
            onPress={() => router.push('/vendor-dashboard/add-service')}
          >
            <Wrench size={24} color={colors.success} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>
              Add Service
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: colors.info + '10' }]}
            onPress={() => router.push('/vendor-dashboard/profile')}
          >
            <Users size={24} color={colors.info} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: colors.warning + '10' }]}
            onPress={() => router.push('/wallet')}
          >
            <DollarSign size={24} color={colors.warning} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>
              Wallet
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
  storeInfoCard: {
    marginBottom: 16,
  },
  storeInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  storeInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  storeDetails: {
    marginLeft: 12,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  storeStatus: {
    alignItems: 'flex-end',
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    marginLeft: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    width: '23%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 12,
    marginTop: 6,
  },
  analyticsCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  analyticsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  analyticStat: {
    flex: 1,
    alignItems: 'center',
  },
  analyticStatLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  analyticStatValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  recentOrdersCard: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  orderInfo: {
    flex: 1,
  },
  orderCustomer: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  orderMeta: {
    fontSize: 14,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  popularProductsCard: {
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  productSold: {
    fontSize: 12,
  },
  quickActionsCard: {
    marginBottom: 30,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
});