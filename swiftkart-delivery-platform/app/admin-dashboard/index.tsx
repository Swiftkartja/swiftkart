import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Store, 
  Truck, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  Settings,
  BarChart,
  AlertTriangle,
  Shield,
  DollarSign,
  Calendar,
  Layers,
  Tag
} from 'lucide-react-native';

// Mock data for admin dashboard
const mockStats = {
  revenue: 12456.78,
  orders: 324,
  users: 189,
  vendors: 42,
  riders: 28,
  pendingApprovals: 3,
  activeDeliveries: 18,
  completedToday: 56,
};

const mockPendingApprovals = [
  {
    id: 'vendor-101',
    name: 'Healthy Bites',
    type: 'vendor',
    email: 'healthybites@example.com',
    phone: '+1234567890',
    status: 'pending',
    time: '2 hours ago',
  },
  {
    id: 'rider-102',
    name: 'Alex Johnson',
    type: 'rider',
    email: 'alex.j@example.com',
    phone: '+1987654321',
    status: 'pending',
    time: '3 hours ago',
  },
  {
    id: 'vendor-103',
    name: 'Quick Pharmacy',
    type: 'vendor',
    email: 'quickpharm@example.com',
    phone: '+1122334455',
    status: 'pending',
    time: '5 hours ago',
  },
];

const mockRecentOrders = [
  {
    id: 'order-101',
    customer: 'John Doe',
    vendor: 'Fresh Eats',
    total: 38.97,
    status: 'delivered',
    time: '1 hour ago',
  },
  {
    id: 'order-102',
    customer: 'Jane Smith',
    vendor: 'Quick Mart',
    total: 24.98,
    status: 'out_for_delivery',
    time: '2 hours ago',
  },
];

export default function AdminDashboardScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  const handleApprovalPress = (id: string, type: string) => {
    router.push(`/admin-dashboard/${type}/${id}`);
  };
  
  const handleOrderPress = (orderId: string) => {
    router.push(`/admin-dashboard/order/${orderId}`);
  };
  
  const handleViewAllApprovals = () => {
    router.push('/admin-dashboard/approvals');
  };
  
  const handleViewAllOrders = () => {
    router.push('/admin-dashboard/orders');
  };
  
  const handleManageUsers = () => {
    router.push('/admin-dashboard/users');
  };
  
  const handleManageVendors = () => {
    router.push('/admin-dashboard/vendors');
  };
  
  const handleManageRiders = () => {
    router.push('/admin-dashboard/riders');
  };
  
  const handleSettings = () => {
    router.push('/admin-dashboard/settings');
  };
  
  const handleAnalytics = () => {
    router.push('/admin-dashboard/analytics');
  };
  
  const handleManageCategories = () => {
    router.push('/admin-dashboard/categories');
  };
  
  const handleManageProducts = () => {
    router.push('/admin-dashboard/products');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return colors.success;
      case 'out_for_delivery':
        return colors.primary;
      case 'pending':
        return colors.warning;
      case 'cancelled':
        return colors.error;
      default:
        return colors.muted;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} color={getStatusColor(status)} />;
      case 'out_for_delivery':
        return <Truck size={16} color={getStatusColor(status)} />;
      case 'pending':
        return <TrendingUp size={16} color={getStatusColor(status)} />;
      case 'cancelled':
        return <XCircle size={16} color={getStatusColor(status)} />;
      default:
        return <TrendingUp size={16} color={getStatusColor(status)} />;
    }
  };
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Stack.Screen options={{ title: 'Admin Dashboard' }} />
      
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text }]}>
          Admin Dashboard
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Platform overview and management
        </Text>
      </View>
      
      {/* Platform Overview */}
      <View style={styles.overviewContainer}>
        <Text style={[styles.overviewTitle, { color: colors.text }]}>
          Platform Overview
        </Text>
        
        <View style={styles.overviewGrid}>
          <View style={[styles.overviewItem, { backgroundColor: colors.primary + '15' }]}>
            <DollarSign size={20} color={colors.primary} />
            <Text style={[styles.overviewValue, { color: colors.text }]}>
              ${mockStats.revenue.toFixed(2)}
            </Text>
            <Text style={[styles.overviewLabel, { color: colors.muted }]}>
              Total Revenue
            </Text>
          </View>
          
          <View style={[styles.overviewItem, { backgroundColor: colors.info + '15' }]}>
            <ShoppingBag size={20} color={colors.info} />
            <Text style={[styles.overviewValue, { color: colors.text }]}>
              {mockStats.orders}
            </Text>
            <Text style={[styles.overviewLabel, { color: colors.muted }]}>
              Total Orders
            </Text>
          </View>
          
          <View style={[styles.overviewItem, { backgroundColor: colors.success + '15' }]}>
            <Users size={20} color={colors.success} />
            <Text style={[styles.overviewValue, { color: colors.text }]}>
              {mockStats.users}
            </Text>
            <Text style={[styles.overviewLabel, { color: colors.muted }]}>
              Users
            </Text>
          </View>
          
          <View style={[styles.overviewItem, { backgroundColor: colors.warning + '15' }]}>
            <Store size={20} color={colors.warning} />
            <Text style={[styles.overviewValue, { color: colors.text }]}>
              {mockStats.vendors}
            </Text>
            <Text style={[styles.overviewLabel, { color: colors.muted }]}>
              Vendors
            </Text>
          </View>
          
          <View style={[styles.overviewItem, { backgroundColor: colors.error + '15' }]}>
            <Truck size={20} color={colors.error} />
            <Text style={[styles.overviewValue, { color: colors.text }]}>
              {mockStats.riders}
            </Text>
            <Text style={[styles.overviewLabel, { color: colors.muted }]}>
              Riders
            </Text>
          </View>
          
          <View style={[styles.overviewItem, { backgroundColor: colors.secondary + '15' }]}>
            <Calendar size={20} color={colors.secondary} />
            <Text style={[styles.overviewValue, { color: colors.text }]}>
              {mockStats.completedToday}
            </Text>
            <Text style={[styles.overviewLabel, { color: colors.muted }]}>
              Completed Today
            </Text>
          </View>
        </View>
      </View>
      
      {/* Alert for pending approvals */}
      {mockStats.pendingApprovals > 0 && (
        <View style={[styles.alertContainer, { backgroundColor: colors.warning + '20' }]}>
          <AlertTriangle size={20} color={colors.warning} />
          <Text style={[styles.alertText, { color: colors.text }]}>
            {mockStats.pendingApprovals} vendor/rider registration{mockStats.pendingApprovals > 1 ? 's' : ''} pending approval
          </Text>
          <TouchableOpacity onPress={handleViewAllApprovals}>
            <Text style={[styles.alertAction, { color: colors.primary }]}>Review</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Pending Approvals
          </Text>
          <TouchableOpacity onPress={handleViewAllApprovals}>
            <Text style={[styles.viewAll, { color: colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        {mockPendingApprovals.map((approval) => (
          <Card
            key={approval.id}
            style={styles.approvalCard}
            onPress={() => handleApprovalPress(approval.id, approval.type)}
            elevation={1}
          >
            <View style={styles.approvalHeader}>
              <View style={styles.approvalInfo}>
                <Text style={[styles.approvalName, { color: colors.text }]}>
                  {approval.name}
                </Text>
                <Text style={[styles.approvalTime, { color: colors.muted }]}>
                  {approval.time}
                </Text>
              </View>
              
              <View
                style={[
                  styles.typeBadge,
                  {
                    backgroundColor:
                      approval.type === 'vendor' ? colors.primary : colors.warning,
                  },
                ]}
              >
                <Text style={styles.typeText}>
                  {approval.type.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.approvalDetails}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.muted }]}>
                  Email:
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {approval.email}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.muted }]}>
                  Phone:
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {approval.phone}
                </Text>
              </View>
            </View>
            
            <View style={styles.approvalActions}>
              <Button
                title="Approve"
                onPress={() => handleApprovalPress(approval.id, approval.type)}
                variant="primary"
                size="sm"
                style={{ marginRight: 8 }}
              />
              
              <Button
                title="Reject"
                onPress={() => handleApprovalPress(approval.id, approval.type)}
                variant="danger"
                size="sm"
              />
            </View>
          </Card>
        ))}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Orders
          </Text>
          <TouchableOpacity onPress={handleViewAllOrders}>
            <Text style={[styles.viewAll, { color: colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        {mockRecentOrders.map((order) => (
          <Card
            key={order.id}
            style={styles.orderCard}
            onPress={() => handleOrderPress(order.id)}
            elevation={1}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={[styles.orderId, { color: colors.text }]}>
                  #{order.id.split('-')[1]}
                </Text>
                <Text style={[styles.orderTime, { color: colors.muted }]}>
                  {order.time}
                </Text>
              </View>
              
              <View style={styles.statusContainer}>
                {getStatusIcon(order.status)}
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(order.status) },
                  ]}
                >
                  {order.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.muted }]}>
                  Customer:
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {order.customer}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.muted }]}>
                  Vendor:
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {order.vendor}
                </Text>
              </View>
              
              <View style={styles.orderTotal}>
                <Text style={[styles.totalLabel, { color: colors.muted }]}>
                  Total:
                </Text>
                <Text style={[styles.totalValue, { color: colors.primary }]}>
                  ${order.total.toFixed(2)}
                </Text>
              </View>
            </View>
            
            <View style={styles.orderActions}>
              <Button
                title="View Details"
                onPress={() => handleOrderPress(order.id)}
                variant="outline"
                size="sm"
                rightIcon={<ChevronRight size={16} color={colors.primary} />}
              />
            </View>
          </Card>
        ))}
      </View>
      
      <View style={styles.quickActions}>
        <Text style={[styles.actionsTitle, { color: colors.text }]}>
          Admin Controls
        </Text>
        
        <View style={styles.actionButtons}>
          <Button
            title="Manage Users"
            onPress={handleManageUsers}
            leftIcon={<Users size={18} color="#FFFFFF" />}
            style={styles.actionButton}
          />
          
          <Button
            title="Manage Vendors"
            onPress={handleManageVendors}
            leftIcon={<Store size={18} color="#FFFFFF" />}
            style={styles.actionButton}
          />
          
          <Button
            title="Manage Riders"
            onPress={handleManageRiders}
            leftIcon={<Truck size={18} color="#FFFFFF" />}
            style={styles.actionButton}
          />
          
          <Button
            title="Analytics"
            onPress={handleAnalytics}
            leftIcon={<BarChart size={18} color="#FFFFFF" />}
            style={styles.actionButton}
          />
          
          <Button
            title="Categories"
            onPress={handleManageCategories}
            leftIcon={<Tag size={18} color="#FFFFFF" />}
            style={styles.actionButton}
          />
          
          <Button
            title="Products"
            onPress={handleManageProducts}
            leftIcon={<Layers size={18} color="#FFFFFF" />}
            style={styles.actionButton}
          />
          
          <Button
            title="Approvals"
            onPress={handleViewAllApprovals}
            leftIcon={<AlertTriangle size={18} color="#FFFFFF" />}
            style={styles.actionButton}
          />
          
          <Button
            title="Settings"
            onPress={handleSettings}
            leftIcon={<Settings size={18} color="#FFFFFF" />}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>
      </View>
      
      <View style={styles.adminFooter}>
        <View style={[styles.adminFooterContent, { backgroundColor: colors.primary + '10' }]}>
          <Shield size={24} color={colors.primary} />
          <Text style={[styles.adminFooterText, { color: colors.text }]}>
            You have full admin privileges
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  overviewContainer: {
    padding: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewItem: {
    width: '31%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 4,
  },
  overviewLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    marginTop: 0,
    marginBottom: 0,
    padding: 12,
    borderRadius: 8,
  },
  alertText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  alertAction: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  approvalCard: {
    marginBottom: 12,
  },
  approvalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  approvalInfo: {
    flex: 1,
  },
  approvalName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  approvalTime: {
    fontSize: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  approvalDetails: {
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
  approvalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 12,
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
  orderDetails: {
    marginBottom: 12,
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
    alignItems: 'flex-end',
  },
  quickActions: {
    padding: 20,
    paddingTop: 0,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    marginBottom: 12,
  },
  adminFooter: {
    padding: 20,
    paddingTop: 0,
    marginBottom: 30,
  },
  adminFooterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  adminFooterText: {
    fontSize: 16,
    fontWeight: '500',
  },
});