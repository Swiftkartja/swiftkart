// components/ui/CartButton.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { useThemeStore } from '@/store/theme-store';
import { useCartStore } from '@/store/cart-store';

interface CartButtonProps {
  onPress: () => void;
}

export const CartButton: React.FC<CartButtonProps> = ({ onPress }) => {
  const { colors } = useThemeStore();
  const { getCartCount } = useCartStore();
  
  const itemCount = getCartCount();
  
  if (itemCount === 0) {
    return null;
  }
  
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.primary }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ShoppingCart size={24} color="#FFFFFF" />
      {itemCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {itemCount > 99 ? '99+' : itemCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { MessageSquare, Send, Paperclip, Image as ImageIcon } from 'lucide-react-native';
import { Message, ChatUser } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const { user } = useAuthStore();
  const { id } = useLocalSearchParams();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [recipient, setRecipient] = useState<ChatUser | null>(null);
  
  useEffect(() => {
    loadChatData();
  }, [id]);

  const loadChatData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch chat data from storage
      const storedMessages = await AsyncStorage.getItem(`chat_${id}`);
      const storedRecipient = await AsyncStorage.getItem(`chat_recipient_${id}`);
      
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
      
      if (storedRecipient) {
        setRecipient(JSON.parse(storedRecipient));
      }
      
      // In a real app, this would fetch from your backend
      // For now, we'll simulate with mock data
      if (!recipient) {
        setRecipient({
          id: id,
          name: 'Mock Vendor',
          avatar: 'https://via.placeholder.com/40',
          role: 'vendor'
        });
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
      Alert.alert('Error', 'Failed to load chat data');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      if (!newMessage.trim()) return;
      
      setIsSending(true);
      
      // Create new message
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        senderId: user?.id,
        recipientId: id,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      
      // Update local state
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Save to storage
      await AsyncStorage.setItem(
        `chat_${id}`,
        JSON.stringify([...messages, message])
      );
      
      // In a real app, this would send to your backend
      // For now, we'll simulate
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate recipient's response
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message!',
        senderId: id,
        recipientId: user?.id,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      
      setMessages(prev => [...prev, response]);
      await AsyncStorage.setItem(
        `chat_${id}`,
        JSON.stringify([...messages, response])
      );
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleAttachment = () => {
    Alert.alert(
      'Attachments',
      'This feature will allow you to send images and files',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK' }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading chat...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: recipient?.name || 'Chat' }} />
      
      <ScrollView
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.senderId === user?.id && styles.sentMessageContainer
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.senderId === user?.id && styles.sentMessageText,
                { color: colors.text }
              ]}
            >
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.attachmentButton}
          onPress={handleAttachment}
        >
          <Paperclip size={20} color={colors.text} />
        </TouchableOpacity>
        
        <TextInput
          style={[styles.input, { backgroundColor: colors.card }]}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          placeholderTextColor={colors.muted}
          onSubmitEditing={sendMessage}
        />
        
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={isSending || !newMessage.trim()}
        >
          <Send size={20} color={isSending ? colors.muted : colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
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
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 12,
  },
  sentMessageContainer: {
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  sentMessageText: {
    backgroundColor: colors.primary + '20',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  attachmentButton: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 12,
    marginRight: 8,
  },
  sendButton: {
    padding: 8,
  },
});