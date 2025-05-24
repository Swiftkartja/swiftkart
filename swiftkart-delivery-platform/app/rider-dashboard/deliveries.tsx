import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Button, Badge } from '@/components/ui/Button';
import { MapPin, Navigation, Clock, Phone, MessageSquare } from 'lucide-react-native';
import { useUserStore } from '@/store/user-store';
import { Delivery, DeliveryStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { GOOGLE_MAPS_API_KEY } from '@/config';

// Mock delivery data
const mockDeliveries: Delivery[] = [
  {
    id: 'del-12345',
    status: 'assigned',
    pickupTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    vendor: {
      id: 'vnd-123',
      name: 'Burger King',
      address: '123 Food Street',
      coordinates: { latitude: 37.7749, longitude: -122.4194 },
    },
    customer: {
      id: 'cst-456',
      name: 'John Smith',
      address: '456 Delivery Avenue',
      phone: '+1234567890',
      coordinates: { latitude: 37.7749, longitude: -122.4195 },
    },
    items: [
      { name: 'Big Burger', quantity: 2, price: 9.99 },
      { name: 'Fries', quantity: 1, price: 2.99 },
    ],
    total: 22.97,
    earnings: 5.00,
  },
  // Add more mock deliveries as needed
];

export default function DeliveriesScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const { user } = useUserStore();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  useEffect(() => {
    // In a real app, fetch deliveries from API
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      // In a real app, make API call to get deliveries for this rider
      setDeliveries(mockDeliveries);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDeliveries();
    setRefreshing(false);
  };

  const handleAcceptDelivery = async (delivery: Delivery) => {
    try {
      // Update delivery status in backend
      await updateDeliveryStatus(delivery.id, 'accepted');
      
      // Navigate to delivery details
      router.push({
        pathname: '/rider-dashboard/map',
        params: {
          deliveryId: delivery.id,
        },
      });
    } catch (error) {
      console.error('Error accepting delivery:', error);
      Alert.alert('Error', 'Failed to accept delivery');
    }
  };

  const handleDeclineDelivery = async (delivery: Delivery) => {
    try {
      // Update delivery status in backend
      await updateDeliveryStatus(delivery.id, 'declined');
      
      // Remove from list
      setDeliveries(prev => prev.filter(d => d.id !== delivery.id));
      
      Alert.alert('Delivery Declined', 'You have declined this delivery');
    } catch (error) {
      console.error('Error declining delivery:', error);
      Alert.alert('Error', 'Failed to decline delivery');
    }
  };

  const getStatusBadge = (status: DeliveryStatus) => {
    const statusMap: Record<DeliveryStatus, { text: string; color: string }> = {
      assigned: { text: 'Assigned', color: colors.warning },
      accepted: { text: 'Accepted', color: colors.primary },
      picked_up: { text: 'Picked Up', color: colors.info },
      on_the_way: { text: 'On the Way', color: colors.success },
      delivered: { text: 'Delivered', color: colors.success },
      cancelled: { text: 'Cancelled', color: colors.danger },
      declined: { text: 'Declined', color: colors.danger },
    };

    return statusMap[status];
  };

  const formatTimeAgo = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleNavigateToVendor = (coordinates: { latitude: number; longitude: number }) => {
    const url = `google.navigation:q=${coordinates.latitude},${coordinates.longitude}`;
    try {
      import('expo-linking').then(Linking => {
        Linking.openURL(url);
      });
    } catch (err) {
      console.warn('Error opening navigation:', err);
      Alert.alert('Error', 'Could not open navigation');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Active Deliveries
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.muted }]}>
          {deliveries.length} deliveries available
        </Text>
      </View>

      {/* Deliveries list */}
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.muted }]}>
              Loading deliveries...
            </Text>
          </View>
        ) : (
          <>
            {deliveries.map((delivery, index) => (
              <TouchableOpacity
                key={delivery.id}
                style={[styles.deliveryCard, { backgroundColor: colors.card }]}
                onPress={() => setSelectedDelivery(delivery)}
              >
                <View style={styles.deliveryHeader}>
                  <View style={styles.deliveryInfo}>
                    <Text style={[styles.deliveryTitle, { color: colors.text }]}>
                      {delivery.vendor.name}
                    </Text>
                    <Text style={[styles.deliverySubtitle, { color: colors.muted }]}>
                      {delivery.customer.name}
                    </Text>
                  </View>
                  <Badge
                    text={getStatusBadge(delivery.status).text}
                    color={getStatusBadge(delivery.status).color}
                  />
                </View>

                <View style={styles.deliveryDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.iconContainer}>
                      <Clock size={16} color={colors.muted} />
                    </View>
                    <Text style={[styles.detailText, { color: colors.muted }]}>
                      {formatTimeAgo(delivery.pickupTime)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.iconContainer}>
                      <MapPin size={16} color={colors.muted} />
                    </View>
                    <Text style={[styles.detailText, { color: colors.muted }]}>
                      {delivery.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.iconContainer}>
                      <Navigation size={16} color={colors.muted} />
                    </View>
                    <Text style={[styles.detailText, { color: colors.primary }]}>
                      ${delivery.earnings.toFixed(2)} earnings
                    </Text>
                  </View>
                </View>

                {delivery.status === 'assigned' && (
                  <View style={styles.actionButtons}>
                    <Button
                      title="Accept"
                      onPress={() => handleAcceptDelivery(delivery)}
                      color={colors.success}
                      fullWidth
                    />
                    <Button
                      title="Decline"
                      onPress={() => handleDeclineDelivery(delivery)}
                      color={colors.danger}
                      fullWidth
                      variant="outline"
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {deliveries.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: colors.muted }]}>
                  No deliveries available at the moment
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Selected delivery details modal */}
      {selectedDelivery && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Delivery Details
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedDelivery(null)}
              >
                <Navigation size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.locationSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Pickup Location
                </Text>
                <View style={styles.locationRow}>
                  <MapPin size={16} color={colors.primary} />
                  <Text style={[styles.locationText, { color: colors.text }]}>
                    {selectedDelivery.vendor.name}
                  </Text>
                </View>
                <Text style={[styles.addressText, { color: colors.muted }]}>
                  {selectedDelivery.vendor.address}
                </Text>
                <TouchableOpacity
                  style={styles.navigateButton}
                  onPress={() => handleNavigateToVendor(selectedDelivery.vendor.coordinates)}
                >
                  <Text style={[styles.navigateText, { color: colors.primary }]}>
                    Navigate to pickup
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.orderSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Order Details
                </Text>
                {selectedDelivery.items.map((item, index) => (
                  <View key={index} style={styles.orderItem}>
                    <Text style={[styles.itemName, { color: colors.text }]}>
                      {item.name} x{item.quantity}
                    </Text>
                    <Text style={[styles.itemPrice, { color: colors.primary }]}>
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>
                ))}
                <View style={styles.divider} />
                <View style={styles.orderTotal}>
                  <Text style={[styles.totalLabel, { color: colors.text }]}>
                    Total:
                  </Text>
                  <Text style={[styles.totalValue, { color: colors.primary }]}>
                    ${selectedDelivery.total.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.earningsSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Your Earnings
                </Text>
                <View style={styles.earningsRow}>
                  <Text style={[styles.earningsLabel, { color: colors.text }]}>
                    Estimated earnings:
                  </Text>
                  <Text style={[styles.earningsValue, { color: colors.success }]}>
                    ${selectedDelivery.earnings.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <Button
                title={selectedDelivery.status === 'assigned' ? 'Accept Delivery' : 'View Map'}
                onPress={() =>
                  selectedDelivery.status === 'assigned'
                    ? handleAcceptDelivery(selectedDelivery)
                    : router.push({
                        pathname: '/rider-dashboard/map',
                        params: { deliveryId: selectedDelivery.id },
                      })
                }
                color={colors.success}
                fullWidth
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  deliveryCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  deliverySubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  deliveryDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    marginBottom: 16,
  },
  locationSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
  },
  addressText: {
    fontSize: 14,
    marginTop: 4,
  },
  navigateButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  navigateText: {
    fontSize: 14,
  },
  orderSection: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 8,
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  earningsSection: {
    marginBottom: 16,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 14,
  },
  earningsValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalFooter: {
    padding: 16,
  },
});