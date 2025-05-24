import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Dimensions, Alert, ActivityIndicator, PermissionsAndroid } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Navigation, CheckCircle, Phone, MessageSquare, MapPin } from 'lucide-react-native';
import { MapView } from '@/components/maps/MapView';
import { MapMarker, Route } from '@/types';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '@/config';

// Mock delivery data
const mockDelivery = {
  id: 'delivery-101',
  vendor: {
    name: 'Fresh Eats',
    address: '123 Market St, Old Harbor, CA',
    phone: '+1234567890',
    coordinates: {
      latitude: 18.0179,
      longitude: -76.8099,
    },
  },
  customer: {
    name: 'John Doe',
    address: '456 Main St, Old Harbor, CA',
    phone: '+1987654321',
    coordinates: {
      latitude: 18.0233,
      longitude: -76.8167,
    },
  },
  status: 'assigned',
  items: [
    { name: 'Chicken Salad', quantity: 1, price: 12.99 },
    { name: 'Fresh Juice', quantity: 2, price: 4.99 },
  ],
  total: 22.97,
  distance: 2.4,
  earnings: 8.50,
};

export default function DeliveryMapScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { deliveryId } = params;
  
  const [currentStatus, setCurrentStatus] = useState(mockDelivery.status);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [route, setRoute] = useState<Route | undefined>(undefined);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);
  
  useEffect(() => {
    // Request location permissions
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'SwiftKart needs access to your location to track deliveries',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getUserLocation();
          }
        } else {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            getUserLocation();
          }
        }
      } catch (err) {
        console.warn('Location permission error:', err);
      }
    };

    requestLocationPermission();
  }, []);

  const getUserLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      setUserLocation(location.coords);
      calculateRoute(location.coords);
    } catch (err) {
      console.warn('Error getting location:', err);
      Alert.alert('Location Error', 'Could not get your current location');
    }
  };

  const calculateRoute = async (start: { latitude: number; longitude: number }) => {
    try {
      const vendorCoords = mockDelivery.vendor.coordinates;
      const customerCoords = mockDelivery.customer.coordinates;

      // Calculate route from rider to vendor to customer
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?` +
        `origin=${start.latitude},${start.longitude}&` +
        `waypoints=${vendorCoords.latitude},${vendorCoords.longitude}|` +
        `${customerCoords.latitude},${customerCoords.longitude}&` +
        `key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        setRoute(route);
      }
    } catch (err) {
      console.warn('Error calculating route:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMarkers = () => {
    const markers: MapMarker[] = [
      {
        id: 'vendor',
        coordinates: mockDelivery.vendor.coordinates,
        title: mockDelivery.vendor.name,
        description: mockDelivery.vendor.address,
        icon: 'store',
        color: colors.primary,
      },
      {
        id: 'customer',
        coordinates: mockDelivery.customer.coordinates,
        title: mockDelivery.customer.name,
        description: mockDelivery.customer.address,
        icon: 'user',
        color: colors.success,
      },
    ];

    if (userLocation) {
      markers.push({
        id: 'rider',
        coordinates: userLocation,
        title: 'Your Location',
        description: 'Current position',
        icon: 'rider',
        color: colors.warning,
      });
    }

    return markers;
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setCurrentStatus(newStatus);
      
      // Update status in backend
      await updateDeliveryStatus(deliveryId, newStatus);
      
      // Show confirmation
      Alert.alert(
        newStatus === 'picked_up' ? 'Order Picked Up' : 'Order Delivered',
        newStatus === 'picked_up' 
          ? 'You have confirmed pickup from the vendor. Proceed to customer location.'
          : 'You have confirmed delivery to the customer. Great job!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update delivery status');
    }
  };

  const handleNavigateToLocation = (coordinates: { latitude: number; longitude: number }) => {
    if (Platform.OS === 'web') {
      window.open(
        `https://www.google.com/maps/dir/?api=1&` +
        `origin=${userLocation?.latitude},${userLocation?.longitude}&` +
        `destination=${coordinates.latitude},${coordinates.longitude}&` +
        `travelmode=driving&key=${GOOGLE_MAPS_API_KEY}`,
        '_blank'
      );
    } else {
      // For mobile, open Google Maps
      const url = `google.navigation:q=${coordinates.latitude},${coordinates.longitude}`;
      try {
        import('expo-linking').then(Linking => {
          Linking.openURL(url);
        });
      } catch (err) {
        console.warn('Error opening navigation:', err);
        Alert.alert('Error', 'Could not open navigation');
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Delivery #{deliveryId.split('-')[1]}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.muted }]}>
            Loading delivery route...
          </Text>
        </View>
      ) : (
        <>
          {/* Map with markers and route */}
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: userLocation?.latitude || mockDelivery.vendor.coordinates.latitude,
              longitude: userLocation?.longitude || mockDelivery.vendor.coordinates.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
            onMapReady={() => setMapReady(true)}
          >
            {getMarkers().map((marker) => (
              <MapView.Marker
                key={marker.id}
                coordinate={marker.coordinates}
                title={marker.title}
                description={marker.description}
                pinColor={marker.color}
              >
                <MapView.Callout>
                  <View style={styles.calloutContainer}>
                    <Text style={[styles.calloutTitle, { color: colors.text }]}>{marker.title}</Text>
                    <Text style={[styles.calloutDescription, { color: colors.muted }]}>{marker.description}</Text>
                  </View>
                </MapView.Callout>
              </MapView.Marker>
            ))}

            {route && (
              <MapViewDirections
                origin={userLocation}
                waypoints={[mockDelivery.vendor.coordinates]}
                destination={mockDelivery.customer.coordinates}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeWidth={3}
                strokeColor={colors.primary}
                optimizeWaypoints={true}
              />
            )}
          </MapView>

          {/* Delivery info panel */}
          <View style={styles.deliveryInfo}>
            <View style={styles.locationHeader}>
              <Text style={[styles.locationName, { color: colors.text }]}>
                {currentStatus === 'assigned' ? 'Vendor Location' : 'Customer Location'}
              </Text>
              <View style={styles.locationActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
                  onPress={() => handleNavigateToLocation(
                    currentStatus === 'assigned' 
                      ? mockDelivery.vendor.coordinates 
                      : mockDelivery.customer.coordinates
                  )}
                >
                  <Navigation size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={[styles.locationAddress, { color: colors.muted }]}>
              {currentStatus === 'assigned' 
                ? mockDelivery.vendor.address 
                : mockDelivery.customer.address}
            </Text>
          </View>

          {/* Order summary */}
          <View style={styles.orderSummary}>
            <Text style={[styles.orderTitle, { color: colors.text }]}>
              Order Details
            </Text>
            {mockDelivery.items.map((item, index) => (
              <View key={index} style={styles.orderItem}>
                <Text style={[styles.orderItemName, { color: colors.text }]}>
                  {item.name} x{item.quantity}
                </Text>
                <Text style={[styles.orderItemPrice, { color: colors.primary }]}>
                  ${item.price.toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.orderTotal}>
              <Text style={[styles.orderTotalLabel, { color: colors.text }]}>
                Total:
              </Text>
              <Text style={[styles.orderTotalValue, { color: colors.primary }]}>
                ${mockDelivery.total.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Status actions */}
          <View style={styles.actions}>
            {currentStatus === 'assigned' ? (
              <Button
                title="Picked Up"
                onPress={() => handleUpdateStatus('picked_up')}
                color={colors.success}
                fullWidth
              />
            ) : currentStatus === 'picked_up' ? (
              <Button
                title="Delivered"
                onPress={() => handleUpdateStatus('delivered')}
                color={colors.success}
                fullWidth
              />
            ) : (
              <View style={styles.completedMessage}>
                <CheckCircle size={24} color={colors.success} />
                <Text style={[styles.completedText, { color: colors.success }]}>
                  Delivery Completed
                </Text>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  map: {
    flex: 1,
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
  deliveryInfo: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    elevation: 4,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
  },
  locationActions: {
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
  locationAddress: {
    fontSize: 14,
  },
  orderSummary: {
    position: 'absolute',
    bottom: 200,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    elevation: 4,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderItemName: {
    fontSize: 14,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '500',
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
    marginBottom: 8,
  },
  orderTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderTotalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    elevation: 4,
  },
  completedMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
  },
  calloutContainer: {
    width: 200,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 14,
  },
});