import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  Linking, 
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Image
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Mail, 
  MessageSquare, 
  FileText, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  User, 
  Send,
  X,
  Paperclip
} from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

// Mock FAQs
const mockFAQs = [
  {
    id: '1',
    question: 'How do I track my order?',
    answer: 'You can track your order by going to the Orders tab and selecting the order you want to track. You will see real-time updates on your order status and delivery progress.',
    category: 'orders',
  },
  {
    id: '2',
    question: 'How do I cancel my order?',
    answer: 'To cancel an order, go to the Orders tab, select the order you want to cancel, and tap on the "Cancel Order" button. Please note that orders can only be cancelled before they are prepared by the vendor.',
    category: 'orders',
  },
  {
    id: '3',
    question: 'How do I add a payment method?',
    answer: 'To add a payment method, go to your Profile, tap on "Payment Methods", and then tap on "Add Payment Method". You can add credit/debit cards or other supported payment options.',
    category: 'payments',
  },
  {
    id: '4',
    question: 'How do I change my delivery address?',
    answer: 'You can change your delivery address during checkout. You can also manage your saved addresses by going to your Profile and tapping on "Addresses".',
    category: 'delivery',
  },
  {
    id: '5',
    question: 'How do I contact customer support?',
    answer: 'You can contact our customer support team through the Help & Support section in your Profile. You can also email us at swiftkartllc@gmail.com or call us at +1-876-SWIFT-KART.',
    category: 'account',
  },
];

// FAQ categories
const faqCategories = [
  { id: 'all', label: 'All', icon: <HelpCircle size={20} /> },
  { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
  { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
  { id: 'delivery', label: 'Delivery', icon: <Truck size={20} /> },
  { id: 'account', label: 'Account', icon: <User size={20} /> },
];

export default function HelpScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const chatScrollViewRef = useRef<ScrollView>(null);
  
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Array<{name: string, uri: string, type?: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  const handleSendMessage = async () => {
    if (message.trim() || attachments.length > 0) {
      setIsLoading(true);
      
      // Simulate API call
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        Alert.alert(
          'Message Sent',
          'Thank you for contacting us. Our support team will get back to you shortly.',
          [{ text: 'OK', onPress: () => {
            setMessage('');
            setAttachments([]);
            setIsLoading(false);
          }}]
        );
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Error', 'Failed to send message. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please enter a message or attach a file before sending.');
    }
  };
  
  const handleContactSupport = (method: 'phone' | 'email' | 'chat') => {
    switch (method) {
      case 'phone':
        // Use Linking to open phone app with the support number
        const phoneNumber = '+18765794358'; // Example number (SWIFT-KART)
        if (Platform.OS !== 'web') {
          Linking.openURL(`tel:${phoneNumber}`).catch(err => {
            Alert.alert('Error', 'Could not open phone app. Please dial +1-876-SWIFT-KART manually.');
          });
        } else {
          Alert.alert('Call Support', `Please call our support team at ${phoneNumber}`);
        }
        break;
      case 'email':
        // Use Linking to open email app with support email
        const email = 'swiftkartllc@gmail.com';
        const subject = 'SwiftKart Support Request';
        if (Platform.OS !== 'web') {
          Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}`).catch(err => {
            Alert.alert('Error', 'Could not open email app. Please email swiftkartllc@gmail.com manually.');
          });
        } else {
          window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
        }
        break;
      case 'chat':
        // Open the live chat interface
        setShowChat(true);
        break;
    }
  };
  
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'text/plain'],
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setAttachments([...attachments, { 
          name: asset.name, 
          uri: asset.uri,
          type: asset.mimeType
        }]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };
  
  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'You need to grant permission to access your photos.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.uri.split('/').pop() || 'image.jpg';
        setAttachments([...attachments, { 
          name: fileName, 
          uri: asset.uri,
          type: 'image/jpeg'
        }]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };
  
  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };
  
  // Filter FAQs based on selected category and search query
  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // Live Chat Component
  const LiveChatComponent = () => {
    const [chatMessage, setChatMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: Date}>>([
      {
        id: '1',
        text: 'Hello! Welcome to SwiftKart support. How can I help you today?',
        isUser: false,
        timestamp: new Date(),
      }
    ]);
    
    const handleSendChatMessage = () => {
      if (chatMessage.trim()) {
        // Add user message
        const userMessage = {
          id: Date.now().toString(),
          text: chatMessage,
          isUser: true,
          timestamp: new Date(),
        };
        
        setChatMessages([...chatMessages, userMessage]);
        setChatMessage('');
        
        // Simulate agent response after 1 second
        setTimeout(() => {
          const agentMessage = {
            id: (Date.now() + 1).toString(),
            text: 'Thank you for your message. One of our agents will respond shortly. Is there anything else I can help you with?',
            isUser: false,
            timestamp: new Date(),
          };
          
          setChatMessages(prevMessages => [...prevMessages, agentMessage]);
          
          // Scroll to bottom
          if (chatScrollViewRef.current) {
            chatScrollViewRef.current.scrollToEnd({ animated: true });
          }
        }, 1000);
      }
    };
    
    // Scroll to bottom when messages change
    useEffect(() => {
      if (chatScrollViewRef.current) {
        chatScrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, [chatMessages]);
    
    return (
      <View style={[styles.chatContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.chatHeader, { backgroundColor: colors.primary }]}>
          <Text style={styles.chatHeaderText}>Live Support Chat</Text>
          <TouchableOpacity onPress={() => setShowChat(false)}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.chatMessages}
          ref={chatScrollViewRef}
        >
          {chatMessages.map(msg => (
            <View 
              key={msg.id}
              style={[
                styles.chatBubble,
                msg.isUser ? 
                  [styles.userBubble, { backgroundColor: colors.primary }] : 
                  [styles.agentBubble, { backgroundColor: colors.card, borderColor: colors.border }]
              ]}
            >
              <Text 
                style={[
                  styles.chatText, 
                  { color: msg.isUser ? '#FFFFFF' : colors.text }
                ]}
              >
                {msg.text}
              </Text>
              <Text 
                style={[
                  styles.chatTimestamp, 
                  { color: msg.isUser ? 'rgba(255,255,255,0.7)' : colors.muted }
                ]}
              >
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}
        </ScrollView>
        
        <View style={[styles.chatInputContainer, { borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.chatInput, { backgroundColor: colors.subtle, color: colors.text }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.muted}
            value={chatMessage}
            onChangeText={setChatMessage}
            onSubmitEditing={handleSendChatMessage}
            returnKeyType="send"
          />
          <TouchableOpacity 
            style={[styles.chatSendButton, { backgroundColor: colors.primary }]}
            onPress={handleSendChatMessage}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // If live chat is open, show the chat interface
  if (showChat) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <Stack.Screen options={{ title: 'Live Chat' }} />
        <LiveChatComponent />
      </KeyboardAvoidingView>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Help & Support' }} />
        
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
        >
          <Card style={styles.searchCard} elevation={1}>
            <View style={[styles.searchContainer, { backgroundColor: colors.subtle }]}>
              <HelpCircle size={20} color={colors.muted} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search for help..."
                placeholderTextColor={colors.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </Card>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Frequently Asked Questions
          </Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {faqCategories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor:
                      selectedCategory === category.id
                        ? colors.primary
                        : colors.card,
                    borderColor:
                      selectedCategory === category.id
                        ? colors.primary
                        : colors.border,
                  },
                ]}
                onPress={() => handleCategorySelect(category.id)}
              >
                {React.cloneElement(category.icon, {
                  color: selectedCategory === category.id ? '#FFFFFF' : colors.primary,
                })}
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color:
                        selectedCategory === category.id
                          ? '#FFFFFF'
                          : colors.text,
                    },
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {filteredFAQs.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={[styles.noResultsText, { color: colors.muted }]}>
                No FAQs found for your search.
              </Text>
            </View>
          ) : (
            filteredFAQs.map(faq => (
              <Card key={faq.id} style={styles.faqCard} elevation={1}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => toggleFAQ(faq.id)}
                >
                  <Text style={[styles.questionText, { color: colors.text }]}>
                    {faq.question}
                  </Text>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp size={20} color={colors.primary} />
                  ) : (
                    <ChevronDown size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
                
                {expandedFAQ === faq.id && (
                  <View style={[styles.faqAnswer, { backgroundColor: colors.subtle }]}>
                    <Text style={[styles.answerText, { color: colors.text }]}>
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </Card>
            ))
          )}
          
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
            Contact Support
          </Text>
          
          <View style={styles.contactOptions}>
            <TouchableOpacity
              style={[styles.contactOption, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleContactSupport('phone')}
            >
              <View style={[styles.contactIconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Phone size={24} color={colors.primary} />
              </View>
              <Text style={[styles.contactOptionText, { color: colors.text }]}>
                Call Us
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.contactOption, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleContactSupport('email')}
            >
              <View style={[styles.contactIconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Mail size={24} color={colors.primary} />
              </View>
              <Text style={[styles.contactOptionText, { color: colors.text }]}>
                Email
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.contactOption, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleContactSupport('chat')}
            >
              <View style={[styles.contactIconContainer, { backgroundColor: colors.primary + '20' }]}>
                <MessageSquare size={24} color={colors.primary} />
              </View>
              <Text style={[styles.contactOptionText, { color: colors.text }]}>
                Live Chat
              </Text>
            </TouchableOpacity>
          </View>
          
          <Card style={styles.messageCard} elevation={1}>
            <Text style={[styles.messageTitle, { color: colors.text }]}>
              Send us a message
            </Text>
            
            <TextInput
              style={[
                styles.messageInput,
                { backgroundColor: colors.subtle, color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Type your message here..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={4}
              value={message}
              onChangeText={setMessage}
              textAlignVertical="top"
            />
            
            {attachments.length > 0 && (
              <View style={styles.attachmentsContainer}>
                {attachments.map((attachment, index) => (
                  <View 
                    key={index} 
                    style={[styles.attachmentItem, { backgroundColor: colors.subtle, borderColor: colors.border }]}
                  >
                    {attachment.type?.startsWith('image/') ? (
                      <Image 
                        source={{ uri: attachment.uri }} 
                        style={styles.attachmentThumbnail} 
                      />
                    ) : (
                      <FileText size={16} color={colors.primary} />
                    )}
                    <Text 
                      style={[styles.attachmentName, { color: colors.text }]}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {attachment.name}
                    </Text>
                    <TouchableOpacity onPress={() => handleRemoveAttachment(index)}>
                      <X size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            
            <View style={styles.messageActions}>
              <TouchableOpacity
                style={[styles.attachButton, { backgroundColor: colors.subtle }]}
                onPress={() => {
                  Alert.alert(
                    'Attach File',
                    'Choose file type',
                    [
                      {
                        text: 'Document',
                        onPress: handlePickDocument
                      },
                      {
                        text: 'Image',
                        onPress: handlePickImage
                      },
                      {
                        text: 'Cancel',
                        style: 'cancel'
                      }
                    ]
                  );
                }}
              >
                <Paperclip size={20} color={colors.primary} />
                <Text style={[styles.attachText, { color: colors.primary }]}>
                  Attach File
                </Text>
              </TouchableOpacity>
              
              <Button
                title="Send Message"
                onPress={handleSendMessage}
                leftIcon={isLoading ? null : <Send size={16} color="#FFFFFF" />}
                size="sm"
                disabled={isLoading}
              >
                {isLoading && <ActivityIndicator size="small" color="#FFFFFF" />}
              </Button>
            </View>
          </Card>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  searchCard: {
    marginBottom: 24,
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
    fontSize: 14,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingBottom: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  faqCard: {
    marginBottom: 12,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noResultsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
  },
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  contactOption: {
    width: '30%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  messageCard: {
    marginTop: 8,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
  },
  attachmentsContainer: {
    marginTop: 12,
    gap: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  attachmentName: {
    flex: 1,
    fontSize: 14,
  },
  attachmentThumbnail: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  attachText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Live Chat Styles
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  chatHeaderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  chatText: {
    fontSize: 14,
    lineHeight: 20,
  },
  chatTimestamp: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chatSendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});