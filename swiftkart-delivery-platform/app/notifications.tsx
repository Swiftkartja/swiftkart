import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Switch, 
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';
import { Stack } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { 
  Bell, 
  ShoppingBag, 
  Truck, 
  MessageSquare, 
  Tag, 
  Star, 
  Gift,
  Trash,
  CheckCircle
} from 'lucide-react-native';
import { Notification } from '@/types';
import { timeAgo } from '@/utils/status-utils';

// Mock notification settings
const mockNotificationSettings = [
  {
    id: 'orders',
    title: 'Order Updates',
    description: 'Get notified about order status changes',
    enabled: true,
    icon: <ShoppingBag size={24} />,
  },
  {
    id: 'delivery',
    title: 'Delivery Updates',
    description: 'Get notified about delivery status changes',
    enabled: true,
    icon: <Truck size={24} />,
  },
  {
    id: 'chat',
    title: 'Chat Messages',
    description: 'Get notified when you receive new messages',
    enabled: true,
    icon: <MessageSquare size={24} />,
  },
  {
    id: 'promotions',
    title: 'Promotions & Offers',
    description: 'Get notified about special offers and discounts',
    enabled: false,
    icon: <Tag size={24} />,
  },
  {
    id: 'reviews',
    title: 'Reviews & Ratings',
    description: 'Get notified when someone rates your order',
    enabled: true,
    icon: <Star size={24} />,
  },
  {
    id: 'rewards',
    title: 'Rewards & Loyalty',
    description: 'Get notified about reward points and loyalty program updates',
    enabled: false,
    icon: <Gift size={24} />,
  },
];

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user-1',
    title: 'Order Delivered',
    message: 'Your order #12345 has been delivered. Enjoy your meal!',
    type: 'order',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    data: {
      orderId: '12345',
    },
  },
  {
    id: '2',
    userId: 'user-1',
    title: 'New Message',
    message: 'You have a new message from Fresh Eats regarding your order.',
    type: 'chat',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    data: {
      chatId: 'vendor-1',
    },
  },
  {
    id: '3',
    userId: 'user-1',
    title: 'Special Offer',
    message: 'Get 20% off your next order with code SWIFT20!',
    type: 'promotion',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    data: {
      promoCode: 'SWIFT20',
    },
  },
  {
    id: '4',
    userId: 'user-1',
    title: 'Order Confirmed',
    message: 'Your order #12346 has been confirmed and is being prepared.',
    type: 'order',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    data: {
      orderId: '12346',
    },
  },
  {
    id: '5',
    userId: 'user-1',
    title: 'Rider Assigned',
    message: 'Mike Johnson has been assigned to deliver your order #12345.',
    type: 'delivery',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    data: {
      orderId: '12345',
      riderId: 'rider-1',
    },
  },
];

export default function NotificationsScreen() {
  const { colors } = useThemeStore();
  
  const [notificationSettings, setNotificationSettings] = useState(
    mockNotificationSettings
  );
  const [masterToggle, setMasterToggle] = useState(
    mockNotificationSettings.some(setting => setting.enabled)
  );
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'settings'>('all');
  const [refreshing, setRefreshing] = useState(false);
  
  // Save notification settings when they change
  useEffect(() => {
    // In a real app, this would save to backend or local storage
    console.log('Notification settings updated:', {
      masterToggle,
      settings: notificationSettings
    });
  }, [notificationSettings, masterToggle]);
  
  const handleToggleSetting = (id: string) => {
    const updatedSettings = notificationSettings.map(setting =>
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    );
    
    setNotificationSettings(updatedSettings);
    setMasterToggle(updatedSettings.some(setting => setting.enabled));
  };
  
  const handleToggleAll = (value: boolean) => {
    setMasterToggle(value);
    setNotificationSettings(
      notificationSettings.map(setting => ({ ...setting, enabled: value }))
    );
  };
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };
  
  const handleMarkAllAsRead = () => {
    if (notifications.some(notification => !notification.isRead)) {
      setNotifications(
        notifications.map(notification => ({ ...notification, isRead: true }))
      );
      Alert.alert('Success', 'All notifications marked as read');
    }
  };
  
  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to delete all notifications?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setNotifications([]);
            Alert.alert('Success', 'All notifications cleared');
          },
        },
      ]
    );
  };
  
  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    handleMarkAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.type === 'order' && notification.data?.orderId) {
      Alert.alert('Navigate', `Navigate to order details for order #${notification.data.orderId}`);
      // router.push(`/order/${notification.data.orderId}`);
    } else if (notification.type === 'chat' && notification.data?.chatId) {
      Alert.alert('Navigate', `Navigate to chat with ${notification.data.chatId}`);
      // router.push(`/chat/${notification.data.chatId}`);
    } else if (notification.type === 'promotion' && notification.data?.promoCode) {
      Alert.alert('Promo Code', `Your promo code is: ${notification.data.promoCode}`);
    } else if (notification.type === 'delivery' && notification.data?.orderId) {
      Alert.alert('Navigate', `Navigate to track order #${notification.data.orderId}`);
      // router.push(`/track-order/${notification.data.orderId}`);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add a new notification at the top
    const newNotification: Notification = {
      id: Date.now().toString(),
      userId: 'user-1',
      title: 'Refreshed',
      message: 'You just refreshed your notifications!',
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString(),
      data: {},
    };
    
    setNotifications([newNotification, ...notifications]);
    setRefreshing(false);
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag size={24} color={colors.primary} />;
      case 'delivery':
        return <Truck size={24} color={colors.primary} />;
      case 'chat':
        return <MessageSquare size={24} color={colors.primary} />;
      case 'promotion':
        return <Tag size={24} color={colors.primary} />;
      case 'review':
        return <Star size={24} color={colors.primary} />;
      case 'reward':
        return <Gift size={24} color={colors.primary} />;
      default:
        return <Bell size={24} color={colors.primary} />;
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Notifications' }} />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'all' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'all' ? colors.primary : colors.muted }
            ]}
          >
            All Notifications
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'settings' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('settings')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'settings' ? colors.primary : colors.muted }
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'all' ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {notifications.length > 0 ? (
            <>
              <View style={styles.notificationActions}>
                <TouchableOpacity onPress={handleMarkAllAsRead}>
                  <Text style={[styles.actionText, { color: colors.primary }]}>
                    Mark all as read
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleClearAll}>
                  <Text style={[styles.actionText, { color: colors.error }]}>
                    Clear all
                  </Text>
                </TouchableOpacity>
              </View>
              
              {notifications.map(notification => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    { backgroundColor: colors.card },
                    !notification.isRead && { borderLeftColor: colors.primary, borderLeftWidth: 4 }
                  ]}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <View style={styles.notificationContent}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                      {getNotificationIcon(notification.type)}
                    </View>
                    
                    <View style={styles.notificationTextContainer}>
                      <Text style={[styles.notificationTitle, { color: colors.text }]}>
                        {notification.title}
                      </Text>
                      <Text style={[styles.notificationMessage, { color: colors.muted }]}>
                        {notification.message}
                      </Text>
                      <Text style={[styles.notificationTime, { color: colors.muted }]}>
                        {timeAgo(notification.createdAt)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.notificationActions}>
                    {!notification.isRead && (
                      <TouchableOpacity
                        style={styles.notificationAction}
                        onPress={() => handleMarkAsRead(notification.id)}
                      >
                        <CheckCircle size={18} color={colors.primary} />
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity
                      style={styles.notificationAction}
                      onPress={() => handleDeleteNotification(notification.id)}
                    >
                      <Trash size={18} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Bell size={64} color={colors.muted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Notifications
              </Text>
              <Text style={[styles.emptyDescription, { color: colors.muted }]}>
                You don't have any notifications yet. Pull down to refresh.
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.masterToggleCard} elevation={1}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <Bell size={24} color={colors.primary} />
                </View>
                
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.masterToggleTitle, { color: colors.text }]}>
                    All Notifications
                  </Text>
                  <Text style={[styles.masterToggleDescription, { color: colors.muted }]}>
                    {masterToggle
                      ? 'You will receive all enabled notifications'
                      : 'You will not receive any notifications'}
                  </Text>
                </View>
              </View>
              
              <Switch
                value={masterToggle}
                onValueChange={handleToggleAll}
                trackColor={{ false: colors.border, true: colors.primary + '70' }}
                thumbColor={masterToggle ? colors.primary : '#f4f3f4'}
              />
            </View>
          </Card>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Notification Preferences
          </Text>
          
          {notificationSettings.map(setting => (
            <Card key={setting.id} style={styles.settingCard} elevation={1}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: setting.enabled
                          ? colors.primary + '20'
                          : colors.subtle,
                      },
                    ]}
                  >
                    {React.cloneElement(setting.icon, {
                      color: setting.enabled ? colors.primary : colors.muted,
                    })}
                  </View>
                  
                  <View style={styles.settingTextContainer}>
                    <Text
                      style={[
                        styles.settingTitle,
                        { color: setting.enabled ? colors.text : colors.muted },
                      ]}
                    >
                      {setting.title}
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.muted }]}>
                      {setting.description}
                    </Text>
                  </View>
                </View>
                
                <Switch
                  value={setting.enabled}
                  onValueChange={() => handleToggleSetting(setting.id)}
                  trackColor={{ false: colors.border, true: colors.primary + '70' }}
                  thumbColor={setting.enabled ? colors.primary : '#f4f3f4'}
                  disabled={!masterToggle}
                />
              </View>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  masterToggleCard: {
    marginBottom: 24,
  },
  masterToggleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  masterToggleDescription: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  settingCard: {
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  // Notification styles
  notificationCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  notificationAction: {
    padding: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
});