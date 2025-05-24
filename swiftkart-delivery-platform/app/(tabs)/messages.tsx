import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { Search, MessageSquare, CheckCircle } from 'lucide-react-native';

// Mock chats data
const mockChats = [
  {
    id: 'vendor-1',
    name: 'Fresh Eats',
    avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    lastMessage: 'Hello! How can I help you today?',
    timestamp: '2023-05-16T14:32:00.000Z',
    unread: 0,
    type: 'vendor',
  },
  {
    id: 'rider-1',
    name: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    lastMessage: 'I am on my way with your order.',
    timestamp: '2023-05-16T15:03:30.000Z',
    unread: 2,
    type: 'rider',
  },
  {
    id: 'vendor-2',
    name: 'Quick Mart',
    avatar: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    lastMessage: 'Your order has been confirmed.',
    timestamp: '2023-05-16T13:45:00.000Z',
    unread: 0,
    type: 'vendor',
  },
  {
    id: 'rider-2',
    name: 'Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    lastMessage: 'I have arrived at your location.',
    timestamp: '2023-05-15T18:20:00.000Z',
    unread: 0,
    type: 'rider',
  },
  {
    id: 'vendor-3',
    name: 'MediCare Pharmacy',
    avatar: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    lastMessage: 'Your prescription is ready for pickup.',
    timestamp: '2023-05-15T14:10:00.000Z',
    unread: 1,
    type: 'vendor',
  },
];

export default function MessagesScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter chats based on search query
  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleChatPress = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If the message is from today, show the time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    
    // If the message is from this week, show the day
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    
    // Otherwise, show the date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  
  const renderChatItem = ({ item }: { item: any }) => (
    <Card
      style={styles.chatCard}
      onPress={() => handleChatPress(item.id)}
      elevation={1}
    >
      <View style={styles.chatContent}>
        <Image
          source={{ uri: item.avatar }}
          style={styles.avatar}
          resizeMode="cover"
        />
        
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={[styles.chatName, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.chatTime, { color: colors.muted }]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
          
          <View style={styles.chatFooter}>
            <Text
              style={[
                styles.lastMessage,
                { color: item.unread > 0 ? colors.text : colors.muted },
                item.unread > 0 && { fontWeight: '500' },
              ]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
            
            {item.unread > 0 ? (
              <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.unreadCount}>{item.unread}</Text>
              </View>
            ) : (
              <CheckCircle size={16} color={colors.success} />
            )}
          </View>
        </View>
      </View>
    </Card>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Messages' }} />
      
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Search size={20} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search messages..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MessageSquare size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No messages found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.muted }]}>
              Start a conversation with a vendor or rider
            </Text>
          </View>
        }
      />
    </View>
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
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  chatCard: {
    marginBottom: 12,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatTime: {
    fontSize: 12,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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