import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Linking,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle,
  ChevronRight,
  Navigation
} from 'lucide-react-native';
import { MapView } from '@/components/maps/MapView';
import { Order, MapMarker, Route } from '@/types';
import { formatDate, getStatusColor } from '@/utils/status-utils';

// Mock order data
const mockOrders: Record<string, Order> = {
  '12345': {
    id: '12345',
    customerId: 'user-1',
    vendorId: 'vendor-1',
    riderId: 'rider-1',
    items: [
      {
        id: 'item-1',
        productId: 'product-1',
        name: 'Jerk Chicken',
        price: 12.99,
        quantity: 2,
        total: 25.98,
        image: 'https://images.unsplash.com/photo-1532636875304-0c89119d9b4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'item-2',
        productId: 'product-2',
        name: 'Festival (4 pcs)',
        price: 3.99,
        quantity: 1,
        total: 3.99,
        image: 'https://images.unsplash.com/photo-1619221882266-0a6b9e6817c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      },
    ],
    subtotal: 29.97,
    deliveryFee: 2.99,
    tax: 2.40,
    total: 35.36,
    status: 'in transit',
    paymentMethod: 'wallet',
    paymentStatus: 'completed',
    deliveryAddress: {
      id: 'addr-1',
      title: 'Home',
      address: '123 Main Street, Apt 4B',
      city: 'Kingston',
      state: 'St. Andrew',
      zipCode: '10001',
      isDefault: true,
      type: 'home',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    estimatedDeliveryTime: new Date(Date.now() + 1000 * 60 * 15).toISOString(), // 15 minutes from now
    notes: 'Please leave at the door.',
  },
  '12346': {
    id: '12346',
    customerId: 'user-1',
    vendorId: 'vendor-2',
    riderId: 'rider-2',
    items: [
      {
        id: 'item-3',
        productId: 'product-3',
        name: 'Ackee and Saltfish',
        price: 15.99,
        quantity: 1,
        total: 15.99,
        image: 'https://images.unsplash.com/photo-1535400255456-196712fa0b0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      },
    ],
    subtotal: 15.99,
    deliveryFee: 2.99,
    tax: 1.28,
    total: 20.26,
    status: 'delivered',
    paymentMethod: 'card',
    paymentStatus: 'completed',
    deliveryAddress: {
      id: 'addr-1',
      title: 'Home',
      address: '123 Main Street, Apt 4B',
      city: 'Kingston',
      state: 'St. Andrew',
      zipCode: '10001',
      isDefault: true,
      type: 'home',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    estimatedDeliveryTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    actualDeliveryTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  'latest': {
    id: 'latest',
    customerId: 'user-1',
    vendorId: 'vendor-1',
    riderId: 'rider-1',
    items: [
      {
        id: 'item-1',
        productId: 'product-1',
        name: 'Jerk Chicken',
        price: 12.99,
        quantity: 2,
        total: 25.98,
        image: 'https://images.unsplash.com/photo-1532636875304-0c89119d9b4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      },
    ],
    subtotal: 25.98,
    deliveryFee: 2.99,
    tax: 2.08,
    total: 31.05,
    status: 'pending',
    paymentMethod: 'wallet',
    paymentStatus: 'completed',
    deliveryAddress: {
      id: 'addr-1',
      title: 'Home',
      address: '123 Main Street, Apt 4B',
      city: 'Kingston',
      state: 'St. Andrew',
      zipCode: '10001',
      isDefault: true,
      type: 'home',
    },
    createdAt: new Date().toISOString(), // Just now
    updatedAt: new Date().toISOString(), // Just now
    estimatedDeliveryTime: new Date(Date.now() + 1000 * 60 * 45).toISOString(), // 45 minutes from now
  },
};

// Mock rider data
const mockRiders: Record<string, any> = {
  'rider-1': {
    id: 'rider-1',
    name: 'Mike Johnson',
    phone: '+1-876-555-1234',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    rating: 4.8,
    vehicleType: 'Motorcycle',
    vehiclePlate: 'JM 1234',
    location: {
      latitude: 18.0179,
      longitude: -76.8099,
    },
  },
  'rider-2': {
    id: 'rider-2',
    name: 'Sarah Williams',
    phone: '+1-876-555-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    rating: 4.9,
    vehicleType: 'Car',
    vehiclePlate: 'JM 5678',
    location: {
      latitude: 18.0270,
      longitude: -76.8055,
    },
  },
};

// Mock vendor data
const mockVendors: Record<string, any> = {
  'vendor-1': {
    id: 'vendor-1',
    name: 'Fresh Eats',
    phone: '+1-876-555-9876',
    avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    location: {
      latitude: 18.0179,
      longitude: -76.8099,
    },
  },
  'vendor-2': {
    id: 'vendor-2',
    name: 'Island Flavors',
    phone: '+1-876-555-4321',
    avatar: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    location: {
      latitude: 18.0270,
      longitude: -76.8055,
    },
  },
};

// Order status steps
const orderStatusSteps = [
  { key: 'pending', label: 'Order Placed', icon: <Package size={24} /> },
  { key: 'accepted', label: 'Order Accepted', icon: <CheckCircle size={24} /> },
  { key: 'preparing', label: 'Preparing', icon: <Package size={24} /> },
  { key: 'ready', label: 'Ready for Pickup', icon: <Package size={24} /> },
  { key: 'in transit', label: 'Out for Delivery', icon: <Truck size={24} /> },
  { key: 'delivered', label: 'Delivered', icon: <CheckCircle size={24} /> },
];

export default function TrackOrderScreen() {
  const { colors } = useThemeStore();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [rider, setRider] = useState<any | null>(null);
  const [vendor, setVendor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [route, setRoute] = useState<Route | undefined>(undefined);
  const [mapReady, setMapReady] = useState(false);
  
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get order ID
        const orderId = typeof id === 'string' ? id : 'latest';
        
        // Get order data
        const orderData = mockOrders[orderId];
        
        if (!orderData) {
          throw new Error('Order not found');
        }
        
        setOrder(orderData);
        
        // Get rider data if available
        if (orderData.riderId && mockRiders[orderData.riderId]) {
          setRider(mockRiders[orderData.riderId]);
        }
        
        // Get vendor data
        if (orderData.vendorId && mockVendors[orderData.vendorId]) {
          setVendor(mockVendors[orderData.vendorId]);
        }
        
        // Set current step based on order status
        const statusIndex = orderStatusSteps.findIndex(step => step.key === orderData.status);
        setCurrentStep(statusIndex >= 0 ? statusIndex : 0);
        
        // Create map markers
        const mapMarkers: MapMarker[] = [];
        
        // Add vendor marker
        if (orderData.vendorId && mockVendors[orderData.vendorId]?.location) {
          const vendorLocation = mockVendors[orderData.vendorId].location;
          mapMarkers.push({
            id: 'vendor',
            coordinate: {
              latitude: vendorLocation.latitude,
              longitude: vendorLocation.longitude,
            },
            title: mockVendors[orderData.vendorId].name,
            description: 'Pickup location',
            type: 'vendor',
          });
        }
        
        // Add customer marker (delivery address)
        mapMarkers.push({
          id: 'customer',
          coordinate: {
            latitude: 18.0179,
            longitude: -76.8099,
          },
          title: 'Delivery Location',
          description: orderData.deliveryAddress.address,
          type: 'dropoff',
        });
        
        // Add rider marker if available
        if (orderData.riderId && mockRiders[orderData.riderId]?.location) {
          const riderLocation = mockRiders[orderData.riderId].location;
          mapMarkers.push({
            id: 'rider',
            coordinate: {
              latitude: riderLocation.latitude,
              longitude: riderLocation.longitude,
            },
            title: mockRiders[orderData.riderId].name,
            description: 'Your delivery rider',
            type: 'rider',
          });
        }
        
        setMarkers(mapMarkers);
        
        // Create route if rider and delivery address are available
        if (orderData.riderId && mockRiders[orderData.riderId]?.location) {
          const riderLocation = mockRiders[orderData.riderId].location;
          
          setRoute({
            origin: {
              latitude: riderLocation.latitude,
              longitude: riderLocation.longitude,
            },
            destination: {
              latitude: 18.0179,
              longitude: -76.8099,
            },
            duration: 15, // minutes
            distance: 3.2, // km
          });
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
        Alert.alert('Error', 'Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderData();
  }, [id]);
  
  const handleCallRider = () => {
    if (rider && rider.phone) {
      const phoneNumber = rider.phone.replace(/\D/g, ''); // Remove non-numeric characters
      
      if (Platform.OS !== 'web') {
        Linking.openURL(`tel:${phoneNumber}`);
      } else {
        alert(`Please call the rider at ${rider.phone}`);
      }
    }
  };
  
  const handleMessageRider = () => {
    if (rider) {
      router.push(`/chat/${rider.id}`);
    }
  };
  
  const handleViewOrderDetails = () => {
    if (order) {
      router.push(`/order/${order.id}`);
    }
  };
  
  const handleMapReady = () => {
    setMapReady(true);
  };
  
  const handleMarkerPress = (marker: MapMarker) => {
    console.log('Marker pressed:', marker);
    // You can add additional functionality here if needed
  };
  
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Track Order' }} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading order details...
        </Text>
      </View>
    );
  }
  
  if (!order) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Track Order' }} />
        <Text style={[styles.errorText, { color: colors.text }]}>
          Order not found
        </Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.errorButton}
        />
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Track Order' }} />
      
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.mapCard} elevation={2}>
          <View style={styles.mapHeader}>
            <Text style={[styles.mapTitle, { color: colors.text }]}>
              Order Tracking
            </Text>
            {order.status === 'in transit' && (
              <View style={[styles.liveIndicator, { backgroundColor: colors.success }]}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
          </View>
          
          <MapView
            style={styles.map}
            markers={markers}
            route={route}
            showUserLocation={false}
            onMapReady={handleMapReady}
            onMarkerPress={handleMarkerPress}
          />
          
          {order.status === 'in transit' && route && (
            <View style={styles.etaContainer}>
              <Clock size={16} color={colors.primary} />
              <Text style={[styles.etaText, { color: colors.text }]}>
                Estimated arrival in {route.duration} minutes ({route.distance} km)
              </Text>
            </View>
          )}
        </Card>
        
        {rider && order.status === 'in transit' && (
          <Card style={styles.riderCard} elevation={2}>
            <View style={styles.riderInfo}>
              <Image
                source={{ uri: rider.avatar }}
                style={styles.riderAvatar}
                resizeMode="cover"
              />
              
              <View style={styles.riderDetails}>
                <Text style={[styles.riderName, { color: colors.text }]}>
                  {rider.name}
                </Text>
                <Text style={[styles.riderVehicle, { color: colors.muted }]}>
                  {rider.vehicleType} • {rider.vehiclePlate}
                </Text>
                <View style={styles.riderRating}>
                  <Text style={[styles.ratingText, { color: colors.primary }]}>
                    ★ {rider.rating.toFixed(1)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.riderActions}>
                <TouchableOpacity
                  style={[styles.riderAction, { backgroundColor: colors.primary + '20' }]}
                  onPress={handleCallRider}
                >
                  <Phone size={20} color={colors.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.riderAction, { backgroundColor: colors.primary + '20' }]}
                  onPress={handleMessageRider}
                >
                  <MessageSquare size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}
        
        <Card style={styles.statusCard} elevation={2}>
          <Text style={[styles.statusTitle, { color: colors.text }]}>
            Order Status
          </Text>
          
          <View style={styles.statusSteps}>
            {orderStatusSteps.map((step, index) => {
              const isCompleted = index <= currentStep;
              const isActive = index === currentStep;
              
              return (
                <View key={step.key} style={styles.statusStep}>
                  <View style={styles.stepIconContainer}>
                    <View
                      style={[
                        styles.stepIcon,
                        {
                          backgroundColor: isCompleted
                            ? colors.primary
                            : colors.subtle,
                          borderColor: isCompleted
                            ? colors.primary
                            : colors.border,
                        },
                      ]}
                    >
                      {React.cloneElement(step.icon, {
                        size: 16,
                        color: isCompleted ? '#FFFFFF' : colors.muted,
                      })}
                    </View>
                    
                    {index < orderStatusSteps.length - 1 && (
                      <View
                        style={[
                          styles.stepLine,
                          {
                            backgroundColor: isCompleted
                              ? colors.primary
                              : colors.border,
                          },
                        ]}
                      />
                    )}
                  </View>
                  
                  <View style={styles.stepContent}>
                    <Text
                      style={[
                        styles.stepLabel,
                        {
                          color: isActive
                            ? colors.primary
                            : isCompleted
                            ? colors.text
                            : colors.muted,
                          fontWeight: isActive ? '600' : '400',
                        },
                      ]}
                    >
                      {step.label}
                    </Text>
                    
                    {isActive && (
                      <Text style={[styles.stepTime, { color: colors.muted }]}>
                        {order.status === 'delivered'
                          ? `Delivered at ${formatDate(order.actualDeliveryTime || order.updatedAt)}`
                          : order.status === 'in transit'
                          ? `Estimated delivery by ${formatDate(order.estimatedDeliveryTime || '')}`
                          : `Updated at ${formatDate(order.updatedAt)}`}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </Card>
        
        <Card style={styles.orderDetailsCard} elevation={2}>
          <View style={styles.orderHeader}>
            <Text style={[styles.orderTitle, { color: colors.text }]}>
              Order #{order.id}
            </Text>
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={handleViewOrderDetails}
            >
              <Text style={[styles.viewDetailsText, { color: colors.primary }]}>
                View Details
              </Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.orderInfo}>
            <View style={styles.orderInfoItem}>
              <Text style={[styles.orderInfoLabel, { color: colors.muted }]}>
                Order Date
              </Text>
              <Text style={[styles.orderInfoValue, { color: colors.text }]}>
                {formatDate(order.createdAt)}
              </Text>
            </View>
            
            <View style={styles.orderInfoItem}>
              <Text style={[styles.orderInfoLabel, { color: colors.muted }]}>
                Items
              </Text>
              <Text style={[styles.orderInfoValue, { color: colors.text }]}>
                {order.items.reduce((total, item) => total + item.quantity, 0)} items
              </Text>
            </View>
            
            <View style={styles.orderInfoItem}>
              <Text style={[styles.orderInfoLabel, { color: colors.muted }]}>
                Total
              </Text>
              <Text style={[styles.orderInfoValue, { color: colors.primary, fontWeight: '600' }]}>
                ${order.total.toFixed(2)}
              </Text>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.deliveryAddress}>
            <MapPin size={16} color={colors.primary} />
            <View style={styles.addressContent}>
              <Text style={[styles.addressTitle, { color: colors.text }]}>
                Delivery Address
              </Text>
              <Text style={[styles.addressText, { color: colors.muted }]}>
                {order.deliveryAddress.address}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
              </Text>
            </View>
          </View>
          
          {order.notes && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.orderNotes}>
                <Text style={[styles.notesTitle, { color: colors.text }]}>
                  Delivery Notes
                </Text>
                <Text style={[styles.notesText, { color: colors.muted }]}>
                  {order.notes}
                </Text>
              </View>
            </>
          )}
        </Card>
        
        {order.status === 'in transit' && (
          <Button
            title="Get Directions"
            leftIcon={<Navigation size={18} color="#FFFFFF" />}
            onPress={() => {
              // Open maps app with directions
              const address = encodeURIComponent(
                `${order.deliveryAddress.address}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state}`
              );
              
              const url = Platform.select({
                ios: `maps:?daddr=${address}`,
                android: `geo:0,0?q=${address}`,
                web: `https://maps.google.com/maps?daddr=${address}`,
              });
              
              if (url) {
                Linking.openURL(url).catch(err => {
                  console.error('Error opening maps:', err);
                  Alert.alert('Error', 'Could not open maps application.');
                });
              }
            }}
            style={styles.directionsButton}
          />
        )}
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 18,
    marginBottom: 16,
  },
  errorButton: {
    minWidth: 120,
  },
  mapCard: {
    marginBottom: 16,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  liveIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  map: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  etaText: {
    fontSize: 14,
    marginLeft: 8,
  },
  riderCard: {
    marginBottom: 16,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  riderDetails: {
    flex: 1,
    marginLeft: 12,
  },
  riderName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  riderVehicle: {
    fontSize: 14,
    marginBottom: 4,
  },
  riderRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  riderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  riderAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCard: {
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statusSteps: {
    marginBottom: 8,
  },
  statusStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepIconContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: {
    width: 2,
    height: 24,
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  stepTime: {
    fontSize: 12,
  },
  orderDetailsCard: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  orderInfo: {
    marginBottom: 12,
  },
  orderInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderInfoLabel: {
    fontSize: 14,
  },
  orderInfoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  deliveryAddress: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressContent: {
    flex: 1,
    marginLeft: 8,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
  },
  orderNotes: {
    marginTop: 4,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
  },
  directionsButton: {
    marginBottom: 16,
  },
});