import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Platform, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  TrendingUp, 
  ShoppingBag, 
  MapPin, 
  Star, 
  Navigation, 
  Clock, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  User,
  DollarSign,
  Map,
  Bell,
  AlertCircle
} from 'lucide-react-native';

// Mock data for rider dashboard
const mockStats = {
  earnings: 245.67,
  deliveries: 32,
  distance: 48.5,
  rating: 4.8,
};

const mockDeliveries = [
  {
    id: 'delivery-101',
    vendor: 'Fresh Eats',
    customer: 'John Doe',
    address: '123 Main St, Old Harbor, CA',
    distance: 2.4,
    earnings: 8.50,
    status: 'assigned',
    time: '10 mins ago',
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  },
  {
    id: 'delivery-102',
    vendor: 'Quick Mart',
    customer: 'Jane Smith',
    address: '456 Market St, Old Harbor, CA',
    distance: 3.2,
    earnings: 9.25,
    status: 'picked_up',
    time: '25 mins ago',
    coordinates: {
      latitude: 37.7833,
      longitude: -122.4167,
    },
  },
  {
    id: 'delivery-103',
    vendor: 'MediCare Pharmacy',
    customer: 'Mike Johnson',
    address: '789 Health St, Old Harbor, CA',
    distance: 1.8,
    earnings: 7.75,
    status: 'completed',
    time: '45 mins ago',
    coordinates: {
      latitude: 37.7694,
      longitude: -122.4862,
    },
  },
  {
    id: 'delivery-104',
    vendor: 'Tech Store',
    customer: 'Sarah Williams',
    address: '101 Tech Blvd, Old Harbor, CA',
    distance: 4.1,
    earnings: 10.25,
    status: 'assigned',
    time: '5 mins ago',
    coordinates: {
      latitude: 37.7694,
      longitude: -122.4862,
    },
  },
];

export default function RiderDashboardScreen() {
  const { colors } = useThemeStore();
  const { user, updateUser } = useAuthStore();
  const router = useRouter();
  
  const [isOnline, setIsOnline] = useState(user?.riderInfo?.isOnline || false);
  const [refreshing, setRefreshing] = useState(false);
  const [newAssignments, setNewAssignments] = useState(0);
  
  useEffect(() => {
    // Count new assignments
    const assigned = mockDeliveries.filter(delivery => 
      delivery.status === 'assigned'
    ).length;
    setNewAssignments(assigned);
  }, []);
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  const handleDeliveryPress = (deliveryId: string) => {
    router.push(`/rider-dashboard/delivery/${deliveryId}`);
  };
  
  const handleViewAllDeliveries = () => {
    router.push('/rider-dashboard/deliveries');
  };
  
  const handleToggleOnline = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    
    // Update user status
    if (user?.riderInfo) {
      updateUser({
        riderInfo: {
          ...user.riderInfo,
          isOnline: newStatus,
        },
      });
    }
  };
  
  const handleManageProfile = () => {
    router.push('/rider-dashboard/profile');
  };
  
  const handleViewEarnings = () => {
    router.push('/rider-dashboard/earnings');
  };
  
  const handleViewMap = () => {
    router.push('/rider-dashboard/map');
  };
  
  const handleNavigateToDelivery = (delivery: any) => {
    // In a real app, this would open the map with directions
    if (Platform.OS === 'web') {
      // For web, open Google Maps in a new tab
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${delivery.coordinates.latitude},${delivery.coordinates.longitude}`,
        '_blank'
      );
    } else {
      // For mobile, navigate to the map screen with coordinates
      router.push({
        pathname: '/rider-dashboard/map',
        params: {
          latitude: delivery.coordinates.latitude,
          longitude: delivery.coordinates.longitude,
          deliveryId: delivery.id,
        },
      });
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return colors.warning;
      case 'picked_up':
        return colors.primary;
      case 'completed':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.muted;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Clock size={16} color={getStatusColor(status)} />;
      case 'picked_up':
        return <Navigation size={16} color={getStatusColor(status)} />;
      case 'completed':
        return <CheckCircle size={16} color={getStatusColor(status)} />;
      case 'cancelled':
        return <XCircle size={16} color={getStatusColor(status)} />;
      default:
        return <Clock size={16} color={getStatusColor(status)} />;
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
      <Stack.Screen options={{ title: 'Rider Dashboard' }} />
      
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>
            Hello, {user?.name?.split(' ')[0] || 'Rider'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {isOnline ? 'You are online and receiving orders' : 'You are currently offline'}
          </Text>
        </View>
        
        <View style={styles.onlineToggle}>
          <Text style={[styles.onlineText, { color: isOnline ? colors.success : colors.muted }]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
          <Switch
            value={isOnline}
            onValueChange={handleToggleOnline}
            trackColor={{ false: colors.muted + '50', true: colors.success + '50' }}
            thumbColor={isOnline ? colors.success : colors.muted}
          />
        </View>
      </View>
      
      {/* Alert for new assignments */}
      {newAssignments > 0 && isOnline && (
        <View style={[styles.alertContainer, { backgroundColor: colors.warning + '20' }]}>
          <Bell size={20} color={colors.warning} />
          <Text style={[styles.alertText, { color: colors.text }]}>
            You have {newAssignments} new delivery assignment{newAssignments > 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={handleViewAllDeliveries}>
            <Text style={[styles.alertAction, { color: colors.primary }]}>View</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {!isOnline && (
        <View style={[styles.alertContainer, { backgroundColor: colors.error + '20' }]}>
          <AlertCircle size={20} color={colors.error} />
          <Text style={[styles.alertText, { color: colors.text }]}>
            You are offline. Go online to receive delivery assignments.
          </Text>
          <TouchableOpacity onPress={handleToggleOnline}>
            <Text style={[styles.alertAction, { color: colors.primary }]}>Go Online</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <Card
            style={[styles.statCard, { backgroundColor: colors.primary + '10' }]}
            elevation={0}
          >
            <View style={styles.statIconContainer}>
              <TrendingUp size={20} color={colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              ${mockStats.earnings.toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              Today's Earnings
            </Text>
          </Card>
          
          <Card
            style={[styles.statCard, { backgroundColor: colors.info + '10' }]}
            elevation={0}
          >
            <View style={[styles.statIconContainer, { backgroundColor: colors.info + '20' }]}>
              <ShoppingBag size={20} color={colors.info} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {mockStats.deliveries}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              Deliveries
            </Text>
          </Card>
        </View>
        
        <View style={styles.statsRow}>
          <Card
            style={[styles.statCard, { backgroundColor: colors.warning + '10' }]}
            elevation={0}
          >
            <View style={[styles.statIconContainer, { backgroundColor: colors.warning + '20' }]}>
              <MapPin size={20} color={colors.warning} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {mockStats.distance} km
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              Distance
            </Text>
          </Card>
          
          <Card
            style={[styles.statCard, { backgroundColor: colors.success + '10' }]}
            elevation={0}
          >
            <View style={[styles.statIconContainer, { backgroundColor: colors.success + '20' }]}>
              <Star size={20} color={colors.success} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {mockStats.rating}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              Rating
            </Text>
          </Card>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Active Deliveries
          </Text>
          <TouchableOpacity onPress={handleViewAllDeliveries}>
            <Text style={[styles.viewAll, { color: colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        {mockDeliveries
          .filter(delivery => delivery.status !== 'completed')
          .map((delivery) => (
            <Card
              key={delivery.id}
              style={styles.deliveryCard}
              onPress={() => handleDeliveryPress(delivery.id)}
              elevation={1}
            >
              <View style={styles.deliveryHeader}>
                <View style={styles.deliveryInfo}>
                  <Text style={[styles.deliveryId, { color: colors.text }]}>
                    #{delivery.id.split('-')[1]}
                  </Text>
                  <Text style={[styles.deliveryTime, { color: colors.muted }]}>
                    {delivery.time}
                  </Text>
                </View>
                
                <View style={styles.statusContainer}>
                  {getStatusIcon(delivery.status)}
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(delivery.status) },
                    ]}
                  >
                    {delivery.status.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              
              <View style={styles.deliveryDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.muted }]}>
                    Vendor:
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {delivery.vendor}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.muted }]}>
                    Customer:
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {delivery.customer}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.muted }]}>
                    Address:
                  </Text>
                  <Text
                    style={[styles.detailValue, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {delivery.address}
                  </Text>
                </View>
                
                <View style={styles.deliveryFooter}>
                  <View style={styles.footerItem}>
                    <MapPin size={14} color={colors.muted} />
                    <Text style={[styles.footerText, { color: colors.muted }]}>
                      {delivery.distance} km
                    </Text>
                  </View>
                  
                  <View style={styles.footerItem}>
                    <TrendingUp size={14} color={colors.muted} />
                    <Text style={[styles.footerText, { color: colors.primary }]}>
                      ${delivery.earnings.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.deliveryActions}>
                <Button
                  title="Navigate"
                  onPress={() => handleNavigateToDelivery(delivery)}
                  variant="primary"
                  size="sm"
                  leftIcon={<Navigation size={16} color="#FFFFFF" />}
                  style={{ marginRight: 8 }}
                />
                
                <Button
                  title="Details"
                  onPress={() => handleDeliveryPress(delivery.id)}
                  variant="outline"
                  size="sm"
                  rightIcon={<ChevronRight size={16} color={colors.primary} />}
                />
              </View>
            </Card>
          ))}
        
        {mockDeliveries.filter(delivery => delivery.status !== 'completed').length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.muted }]}>
              No active deliveries at the moment
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Completed Deliveries
          </Text>
        </View>
        
        {mockDeliveries
          .filter(delivery => delivery.status === 'completed')
          .map((delivery) => (
            <Card
              key={delivery.id}
              style={[styles.deliveryCard, { opacity: 0.8 }]}
              onPress={() => handleDeliveryPress(delivery.id)}
              elevation={1}
            >
              <View style={styles.deliveryHeader}>
                <View style={styles.deliveryInfo}>
                  <Text style={[styles.deliveryId, { color: colors.text }]}>
                    #{delivery.id.split('-')[1]}
                  </Text>
                  <Text style={[styles.deliveryTime, { color: colors.muted }]}>
                    {delivery.time}
                  </Text>
                </View>
                
                <View style={styles.statusContainer}>
                  {getStatusIcon(delivery.status)}
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(delivery.status) },
                    ]}
                  >
                    {delivery.status.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              
              <View style={styles.deliveryDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.muted }]}>
                    Vendor:
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {delivery.vendor}
                  </Text>
                </View>
                
                <View style={styles.deliveryFooter}>
                  <View style={styles.footerItem}>
                    <MapPin size={14} color={colors.muted} />
                    <Text style={[styles.footerText, { color: colors.muted }]}>
                      {delivery.distance} km
                    </Text>
                  </View>
                  
                  <View style={styles.footerItem}>
                    <TrendingUp size={14} color={colors.muted} />
                    <Text style={[styles.footerText, { color: colors.primary }]}>
                      ${delivery.earnings.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
      </View>
      
      <View style={styles.quickActions}>
        <Text style={[styles.actionsTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        
        <View style={styles.actionButtons}>
          <Button
            title="View Map"
            onPress={handleViewMap}
            leftIcon={<Map size={18} color="#FFFFFF" />}
            style={styles.actionButton}
          />
          
          <Button
            title="Earnings"
            onPress={handleViewEarnings}
            leftIcon={<DollarSign size={18} color="#FFFFFF" />}
            style={styles.actionButton}
          />
          
          <Button
            title="Profile"
            onPress={handleManageProfile}
            leftIcon={<User size={18} color="#FFFFFF" />}
            variant="secondary"
            style={styles.actionButton}
          />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  onlineToggle: {
    alignItems: 'center',
  },
  onlineText: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    marginTop: 16,
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
  statsContainer: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
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
  deliveryCard: {
    marginBottom: 12,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryId: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  deliveryTime: {
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
  divider: {
    height: 1,
    marginBottom: 12,
  },
  deliveryDetails: {
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
  deliveryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  deliveryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  quickActions: {
    padding: 20,
    paddingTop: 0,
    marginBottom: 30,
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
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
  },
});