import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  XCircle, 
  MapPin, 
  Phone, 
  User, 
  MessageCircle, 
  DollarSign,
  Store,
  Calendar,
  ChevronRight,
  Navigation
} from 'lucide-react-native';
import { getStatusColor, formatStatus, formatDate } from '@/utils/status-utils';

// Mock orders data
const mockOrders = [
  {
    id: 'order-101',
    customer: {
      id: 'user-1',
      name: 'John Doe',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    },
    vendor: {
      id: 'vendor-1',
      name: 'Fresh Eats',
      phone: '+1 (555) 987-6543',
      logo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    },
    rider: {
      id: 'rider-1',
      name: 'Mike Wilson',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    },
    items: [
      {
        id: 'item-1',
        productId: 'product-101',
        name: 'Fresh Organic Apples',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
        price: 4.99,
        quantity: 2,
      },
      {
        id: 'item-2',
        productId: 'product-102',
        name: 'Whole Grain Bread',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
        price: 3.49,
        quantity: 1,
      },
      {
        id: 'item-3',
        productId: 'product-103',
        name: 'Organic Milk',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
        price: 2.99,
        quantity: 2,
      },
    ],
    subtotal: 19.45,
    deliveryFee: 3.99,
    tax: 1.95,
    tip: 3.00,
    total: 28.39,
    status: 'delivered',
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    deliveryAddress: {
      id: 'address-1',
      userId: 'user-1',
      name: 'Home',
      address: '123 Main St',
      city: 'Old Harbor',
      state: 'CA',
      zipCode: '94105',
      isDefault: true,
    },
    deliveryCoordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    deliveryInstructions: 'Please leave at the door. Ring the doorbell.',
    estimatedDeliveryTime: '2023-05-16T15:30:00.000Z',
    actualDeliveryTime: '2023-05-16T15:25:00.000Z',
    createdAt: '2023-05-16T14:30:00.000Z',
    updatedAt: '2023-05-16T15:25:00.000Z',
  },
  {
    id: 'order-102',
    customer: {
      id: 'user-2',
      name: 'Jane Smith',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    },
    vendor: {
      id: 'vendor-2',
      name: 'Quick Mart',
      phone: '+1 (555) 876-5432',
      logo: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    },
    rider: {
      id: 'rider-2',
      name: 'Sarah Johnson',
      phone: '+1 (555) 567-8901',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    },
    items: [
      {
        id: 'item-4',
        productId: 'product-104',
        name: 'Free-Range Eggs',
        image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
        price: 5.49,
        quantity: 1,
      },
      {
        id: 'item-5',
        productId: 'product-105',
        name: 'Organic Spinach',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
        price: 2.49,
        quantity: 1,
      },
    ],
    subtotal: 7.98,
    deliveryFee: 3.99,
    tax: 0.80,
    tip: 2.00,
    total: 14.77,
    status: 'out_for_delivery',
    paymentMethod: 'PayPal',
    paymentStatus: 'paid',
    deliveryAddress: {
      id: 'address-2',
      userId: 'user-2',
      name: 'Work',
      address: '456 Market St',
      city: 'Old Harbor',
      state: 'CA',
      zipCode: '94103',
      isDefault: true,
    },
    deliveryCoordinates: {
      latitude: 37.7833,
      longitude: -122.4167,
    },
    deliveryInstructions: 'Call when you arrive. I will come down to pick it up.',
    estimatedDeliveryTime: '2023-05-16T16:00:00.000Z',
    actualDeliveryTime: null,
    createdAt: '2023-05-16T15:00:00.000Z',
    updatedAt: '2023-05-16T15:45:00.000Z',
  },
];

export default function OrderDetailsScreen() {
  const { colors } = useThemeStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  
  useEffect(() => {
    // Fetch order data
    const fetchOrder = async () => {
      try {
        // In a real app, this would be an API call
        const foundOrder = mockOrders.find(o => o.id === id);
        
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          Alert.alert(
            "Error",
            "Order not found",
            [
              { 
                text: "OK", 
                onPress: () => router.back()
              }
            ]
          );
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        Alert.alert(
          "Error",
          "Failed to load order details",
          [
            { 
              text: "OK", 
              onPress: () => router.back()
            }
          ]
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);
  
  const handleTrackOrder = () => {
    router.push(`/track-order/${id}`);
  };
  
  const handleContactVendor = () => {
    if (order?.vendor) {
      router.push(`/chat/${order.vendor.id}`);
    }
  };
  
  const handleContactRider = () => {
    if (order?.rider) {
      router.push(`/chat/${order.rider.id}`);
    }
  };
  
  const handleContactCustomer = () => {
    if (order?.customer) {
      router.push(`/chat/${order.customer.id}`);
    }
  };
  
  const handleNavigateToAddress = () => {
    if (order?.deliveryCoordinates) {
      if (Platform.OS === 'web') {
        // For web, open Google Maps in a new tab
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${order.deliveryCoordinates.latitude},${order.deliveryCoordinates.longitude}`,
          '_blank'
        );
      } else {
        // For mobile, navigate to the map screen with coordinates
        router.push({
          pathname: '/rider-dashboard/map',
          params: {
            latitude: order.deliveryCoordinates.latitude,
            longitude: order.deliveryCoordinates.longitude,
            orderId: order.id,
          },
        });
      }
    }
  };
  
  const handleUpdateOrderStatus = (newStatus: string) => {
    // In a real app, this would update the order status in the backend
    Alert.alert(
      "Update Order Status",
      `Are you sure you want to mark this order as ${formatStatus(newStatus)}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Update", 
          onPress: () => {
            // Update order status
            setOrder({
              ...order,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            });
            
            Alert.alert(
              "Success",
              `Order status updated to ${formatStatus(newStatus)}`
            );
          }
        }
      ]
    );
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} color={getStatusColor(status, colors)} />;
      case 'confirmed':
        return <CheckCircle size={20} color={getStatusColor(status, colors)} />;
      case 'preparing':
        return <Package size={20} color={getStatusColor(status, colors)} />;
      case 'ready_for_pickup':
        return <Package size={20} color={getStatusColor(status, colors)} />;
      case 'out_for_delivery':
        return <Truck size={20} color={getStatusColor(status, colors)} />;
      case 'delivered':
        return <CheckCircle size={20} color={getStatusColor(status, colors)} />;
      case 'cancelled':
        return <XCircle size={20} color={getStatusColor(status, colors)} />;
      default:
        return <Clock size={20} color={getStatusColor(status, colors)} />;
    }
  };
  
  const renderOrderActions = () => {
    const userRole = user?.role;
    
    if (userRole === 'customer') {
      return (
        <View style={styles.orderActions}>
          {(order.status === 'out_for_delivery' || order.status === 'preparing') && (
            <Button
              title="Track Order"
              onPress={handleTrackOrder}
              leftIcon={<Truck size={18} color="#FFFFFF" />}
              style={styles.actionButton}
            />
          )}
          
          <Button
            title="Contact Vendor"
            onPress={handleContactVendor}
            variant="outline"
            leftIcon={<MessageCircle size={18} color={colors.primary} />}
            style={styles.actionButton}
          />
          
          {order.status === 'out_for_delivery' && order.rider && (
            <Button
              title="Contact Rider"
              onPress={handleContactRider}
              variant="outline"
              leftIcon={<Phone size={18} color={colors.primary} />}
              style={styles.actionButton}
            />
          )}
        </View>
      );
    } else if (userRole === 'vendor') {
      return (
        <View style={styles.orderActions}>
          {order.status === 'pending' && (
            <View style={styles.statusButtons}>
              <Button
                title="Confirm Order"
                onPress={() => handleUpdateOrderStatus('confirmed')}
                style={[styles.actionButton, { marginRight: 8 }]}
              />
              <Button
                title="Reject Order"
                onPress={() => handleUpdateOrderStatus('cancelled')}
                variant="danger"
                style={styles.actionButton}
              />
            </View>
          )}
          
          {order.status === 'confirmed' && (
            <Button
              title="Start Preparing"
              onPress={() => handleUpdateOrderStatus('preparing')}
              style={styles.actionButton}
            />
          )}
          
          {order.status === 'preparing' && (
            <Button
              title="Mark as Ready"
              onPress={() => handleUpdateOrderStatus('ready_for_pickup')}
              style={styles.actionButton}
            />
          )}
          
          <Button
            title="Contact Customer"
            onPress={handleContactCustomer}
            variant="outline"
            leftIcon={<MessageCircle size={18} color={colors.primary} />}
            style={styles.actionButton}
          />
        </View>
      );
    } else if (userRole === 'rider') {
      return (
        <View style={styles.orderActions}>
          {order.status === 'ready_for_pickup' && (
            <Button
              title="Pick Up Order"
              onPress={() => handleUpdateOrderStatus('out_for_delivery')}
              style={styles.actionButton}
            />
          )}
          
          {order.status === 'out_for_delivery' && (
            <View style={styles.statusButtons}>
              <Button
                title="Mark as Delivered"
                onPress={() => handleUpdateOrderStatus('delivered')}
                style={[styles.actionButton, { marginRight: 8 }]}
              />
              <Button
                title="Navigate"
                onPress={handleNavigateToAddress}
                variant="outline"
                leftIcon={<Navigation size={18} color={colors.primary} />}
                style={styles.actionButton}
              />
            </View>
          )}
          
          <View style={styles.contactButtons}>
            <Button
              title="Contact Customer"
              onPress={handleContactCustomer}
              variant="outline"
              leftIcon={<MessageCircle size={18} color={colors.primary} />}
              style={[styles.actionButton, { marginRight: 8 }]}
            />
            <Button
              title="Contact Vendor"
              onPress={handleContactVendor}
              variant="outline"
              leftIcon={<MessageCircle size={18} color={colors.primary} />}
              style={styles.actionButton}
            />
          </View>
        </View>
      );
    } else if (userRole === 'admin') {
      return (
        <View style={styles.orderActions}>
          <View style={styles.statusButtons}>
            <Button
              title="Contact Customer"
              onPress={handleContactCustomer}
              variant="outline"
              leftIcon={<MessageCircle size={18} color={colors.primary} />}
              style={[styles.actionButton, { marginRight: 8 }]}
            />
            <Button
              title="Contact Vendor"
              onPress={handleContactVendor}
              variant="outline"
              leftIcon={<MessageCircle size={18} color={colors.primary} />}
              style={styles.actionButton}
            />
          </View>
          
          {order.rider && (
            <Button
              title="Contact Rider"
              onPress={handleContactRider}
              variant="outline"
              leftIcon={<MessageCircle size={18} color={colors.primary} />}
              style={styles.actionButton}
            />
          )}
        </View>
      );
    }
    
    return null;
  };
  
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
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
        <XCircle size={48} color={colors.error} />
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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen 
        options={{ 
          title: `Order #${order.id.split('-')[1]}`,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.header}>
        <View style={styles.orderStatus}>
          {getStatusIcon(order.status)}
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(order.status, colors) },
            ]}
          >
            {formatStatus(order.status)}
          </Text>
        </View>
        
        <View style={styles.orderInfo}>
          <View style={styles.orderInfoItem}>
            <Calendar size={16} color={colors.muted} />
            <Text style={[styles.orderInfoText, { color: colors.text }]}>
              {formatDate(order.createdAt)}
            </Text>
          </View>
          
          <View style={styles.orderInfoItem}>
            <DollarSign size={16} color={colors.muted} />
            <Text style={[styles.orderInfoText, { color: colors.text }]}>
              {order.paymentMethod}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Order Items
        </Text>
        
        <Card
          style={[styles.card, { backgroundColor: colors.card }]}
          elevation={1}
        >
          {order.items.map((item: any) => (
            <View key={item.id} style={styles.orderItem}>
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                resizeMode="cover"
              />
              
              <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.itemPrice, { color: colors.muted }]}>
                  ${item.price.toFixed(2)} x {item.quantity}
                </Text>
              </View>
              
              <Text style={[styles.itemTotal, { color: colors.primary }]}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                Subtotal
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                ${order.subtotal.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                Delivery Fee
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                ${order.deliveryFee.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                Tax
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                ${order.tax.toFixed(2)}
              </Text>
            </View>
            
            {order.tip > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                  Tip
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  ${order.tip.toFixed(2)}
                </Text>
              </View>
            )}
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                Total
              </Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>
                ${order.total.toFixed(2)}
              </Text>
            </View>
          </View>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Delivery Details
        </Text>
        
        <Card
          style={[styles.card, { backgroundColor: colors.card }]}
          elevation={1}
        >
          <View style={styles.deliveryAddress}>
            <MapPin size={20} color={colors.primary} />
            <View style={styles.addressDetails}>
              <Text style={[styles.addressName, { color: colors.text }]}>
                {order.deliveryAddress.name}
              </Text>
              <Text style={[styles.addressText, { color: colors.text }]}>
                {order.deliveryAddress.address}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
              </Text>
            </View>
          </View>
          
          {order.deliveryInstructions && (
            <View style={styles.deliveryInstructions}>
              <Text style={[styles.instructionsLabel, { color: colors.muted }]}>
                Instructions:
              </Text>
              <Text style={[styles.instructionsText, { color: colors.text }]}>
                {order.deliveryInstructions}
              </Text>
            </View>
          )}
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.deliveryTimes}>
            <View style={styles.timeRow}>
              <Text style={[styles.timeLabel, { color: colors.muted }]}>
                Order Placed:
              </Text>
              <Text style={[styles.timeValue, { color: colors.text }]}>
                {formatDate(order.createdAt)}
              </Text>
            </View>
            
            {order.estimatedDeliveryTime && (
              <View style={styles.timeRow}>
                <Text style={[styles.timeLabel, { color: colors.muted }]}>
                  Estimated Delivery:
                </Text>
                <Text style={[styles.timeValue, { color: colors.text }]}>
                  {formatDate(order.estimatedDeliveryTime)}
                </Text>
              </View>
            )}
            
            {order.actualDeliveryTime && (
              <View style={styles.timeRow}>
                <Text style={[styles.timeLabel, { color: colors.muted }]}>
                  Delivered At:
                </Text>
                <Text style={[styles.timeValue, { color: colors.text }]}>
                  {formatDate(order.actualDeliveryTime)}
                </Text>
              </View>
            )}
          </View>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {user?.role === 'customer' ? 'Vendor Information' : 'Customer Information'}
        </Text>
        
        <Card
          style={[styles.card, { backgroundColor: colors.card }]}
          elevation={1}
        >
          {user?.role === 'customer' ? (
            <TouchableOpacity 
              style={styles.contactInfo}
              onPress={handleContactVendor}
            >
              <View style={styles.contactHeader}>
                <Store size={20} color={colors.primary} />
                <View style={styles.contactDetails}>
                  <Text style={[styles.contactName, { color: colors.text }]}>
                    {order.vendor.name}
                  </Text>
                  <Text style={[styles.contactPhone, { color: colors.muted }]}>
                    {order.vendor.phone}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.muted} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.contactInfo}
              onPress={handleContactCustomer}
            >
              <View style={styles.contactHeader}>
                <User size={20} color={colors.primary} />
                <View style={styles.contactDetails}>
                  <Text style={[styles.contactName, { color: colors.text }]}>
                    {order.customer.name}
                  </Text>
                  <Text style={[styles.contactPhone, { color: colors.muted }]}>
                    {order.customer.phone}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.muted} />
            </TouchableOpacity>
          )}
        </Card>
      </View>
      
      {order.rider && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Delivery Person
          </Text>
          
          <Card
            style={[styles.card, { backgroundColor: colors.card }]}
            elevation={1}
          >
            <TouchableOpacity 
              style={styles.contactInfo}
              onPress={handleContactRider}
            >
              <View style={styles.contactHeader}>
                <Truck size={20} color={colors.primary} />
                <View style={styles.contactDetails}>
                  <Text style={[styles.contactName, { color: colors.text }]}>
                    {order.rider.name}
                  </Text>
                  <Text style={[styles.contactPhone, { color: colors.muted }]}>
                    {order.rider.phone}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.muted} />
            </TouchableOpacity>
          </Card>
        </View>
      )}
      
      {renderOrderActions()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 16,
  },
  errorButton: {
    marginTop: 16,
  },
  backButton: {
    marginLeft: 16,
  },
  header: {
    padding: 16,
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  orderInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  orderInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderInfoText: {
    fontSize: 14,
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    padding: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  orderSummary: {
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  deliveryAddress: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressDetails: {
    marginLeft: 12,
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
  },
  deliveryInstructions: {
    marginBottom: 12,
  },
  instructionsLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  deliveryTimes: {
    marginTop: 4,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactDetails: {
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
  },
  orderActions: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 40,
  },
  actionButton: {
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  contactButtons: {
    flexDirection: 'row',
  },
});