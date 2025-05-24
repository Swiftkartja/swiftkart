import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { useCartStore } from '@/store/cart-store';
import { CartButton } from '@/components/ui/CartButton';
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  MessageSquare, 
  Heart, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react-native';
import { mockVendors } from '@/mocks/vendors';
import { mockProducts } from '@/mocks/products';
import { mockServices } from '@/mocks/services';

export default function VendorDetailsScreen() {
  const { colors } = useThemeStore();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  
  // Safely get the vendor ID as a string
  const vendorId = typeof id === 'string' ? id : '';
  
  const vendor = mockVendors.find(v => v.id === vendorId);
  const products = mockProducts.filter(p => p.vendorId === vendorId);
  const services = mockServices.filter(s => s.vendorId === vendorId);
  
  const [activeTab, setActiveTab] = useState<'products' | 'services' | 'info' | 'reviews'>('products');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllHours, setShowAllHours] = useState(false);
  
  if (!vendor) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Vendor Details' }} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Vendor not found
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.errorButton}
          />
        </View>
      </View>
    );
  }
  
  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };
  
  const handleServicePress = (serviceId: string) => {
    router.push(`/service/${serviceId}`);
  };
  
  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addItem(product, 1);
    }
  };
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const handleChat = () => {
    router.push(`/chat/${vendor.id}`);
  };
  
  const handleCall = () => {
    // In a real app, this would use Linking to make a phone call
    alert(`Calling ${vendor.phone}`);
  };
  
  const handleEmail = () => {
    // In a real app, this would use Linking to open email
    alert(`Emailing ${vendor.email}`);
  };
  
  const handleWebsite = () => {
    // In a real app, this would use Linking to open the website
    alert(`Opening website: ${vendor.website}`);
  };
  
  const handleToggleHours = () => {
    setShowAllHours(!showAllHours);
  };
  
  const handleCartPress = () => {
    router.push('/cart');
  };
  
  const handleWriteReview = () => {
    // In a real app, this would navigate to a review form
    alert('Write a review for ' + vendor.name);
  };
  
  const handleSeeAllReviews = () => {
    // In a real app, this would navigate to a reviews list
    alert('See all reviews for ' + vendor.name);
  };
  
  // Mock opening hours
  const openingHours = [
    { day: 'Monday', open: '9:00 AM', close: '6:00 PM', isClosed: false },
    { day: 'Tuesday', open: '9:00 AM', close: '6:00 PM', isClosed: false },
    { day: 'Wednesday', open: '9:00 AM', close: '6:00 PM', isClosed: false },
    { day: 'Thursday', open: '9:00 AM', close: '6:00 PM', isClosed: false },
    { day: 'Friday', open: '9:00 AM', close: '8:00 PM', isClosed: false },
    { day: 'Saturday', open: '10:00 AM', close: '4:00 PM', isClosed: false },
    { day: 'Sunday', open: '', close: '', isClosed: true },
  ];
  
  // Mock reviews
  const reviews = [
    {
      id: 'review-1',
      userName: 'John Doe',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      rating: 5,
      comment: 'Great service and products! Will definitely order again.',
      createdAt: '2023-05-10T14:30:00.000Z',
    },
    {
      id: 'review-2',
      userName: 'Jane Smith',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      rating: 4,
      comment: 'Good quality products but delivery was a bit slow.',
      createdAt: '2023-05-08T10:15:00.000Z',
    },
    {
      id: 'review-3',
      userName: 'Mike Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      rating: 5,
      comment: 'Excellent customer service! They were very helpful with my order.',
      createdAt: '2023-05-05T16:45:00.000Z',
    },
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: vendor.name }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{ uri: vendor.coverImage }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          
          <View style={styles.overlay} />
          
          <View style={styles.vendorInfo}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: vendor.logo }}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
            
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{vendor.name}</Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Text style={styles.rating}>
                  {vendor.rating.toFixed(1)} ({vendor.reviewCount} reviews)
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[
                styles.favoriteButton,
                isFavorite && { backgroundColor: colors.primary },
              ]}
              onPress={handleToggleFavorite}
            >
              <Heart
                size={20}
                color={isFavorite ? '#FFFFFF' : colors.primary}
                fill={isFavorite ? '#FFFFFF' : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MapPin size={16} color={colors.muted} />
              <Text style={[styles.infoText, { color: colors.muted }]}>
                {vendor.city}, {vendor.state}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Clock size={16} color={colors.muted} />
              <Text
                style={[
                  styles.infoText,
                  { color: vendor.isOpen ? colors.success : colors.error },
                ]}
              >
                {vendor.isOpen ? 'Open Now' : 'Closed'}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.description, { color: colors.text }]}>
            {vendor.description}
          </Text>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'products' && { borderBottomColor: colors.primary },
            ]}
            onPress={() => setActiveTab('products')}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'products' ? colors.primary : colors.muted,
                },
              ]}
            >
              Products
            </Text>
          </TouchableOpacity>
          
          {services.length > 0 && (
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'services' && { borderBottomColor: colors.primary },
              ]}
              onPress={() => setActiveTab('services')}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === 'services' ? colors.primary : colors.muted,
                  },
                ]}
              >
                Services
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'info' && { borderBottomColor: colors.primary },
            ]}
            onPress={() => setActiveTab('info')}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'info' ? colors.primary : colors.muted,
                },
              ]}
            >
              Info
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'reviews' && { borderBottomColor: colors.primary },
            ]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'reviews' ? colors.primary : colors.muted,
                },
              ]}
            >
              Reviews
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContent}>
          {activeTab === 'products' && (
            <>
              {products.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: colors.muted }]}>
                    No products available
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={products}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <ProductCard
                      product={item}
                      onPress={() => handleProductPress(item.id)}
                      onAddToCart={() => handleAddToCart(item.id)}
                    />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.productsList}
                  scrollEnabled={false}
                />
              )}
            </>
          )}
          
          {activeTab === 'services' && (
            <>
              {services.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: colors.muted }]}>
                    No services available
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={services}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <ServiceCard
                      service={item}
                      onPress={() => handleServicePress(item.id)}
                    />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.servicesList}
                  scrollEnabled={false}
                />
              )}
            </>
          )}
          
          {activeTab === 'info' && (
            <View style={styles.infoContainer}>
              <Card style={styles.infoCard} elevation={1}>
                <Text style={[styles.infoTitle, { color: colors.text }]}>
                  Contact Information
                </Text>
                
                <View style={styles.contactItem}>
                  <Phone size={18} color={colors.primary} />
                  <Text style={[styles.contactText, { color: colors.text }]}>
                    {vendor.phone}
                  </Text>
                </View>
                
                <View style={styles.contactItem}>
                  <Mail size={18} color={colors.primary} />
                  <Text style={[styles.contactText, { color: colors.text }]}>
                    {vendor.email}
                  </Text>
                </View>
                
                {vendor.website && (
                  <View style={styles.contactItem}>
                    <Globe size={18} color={colors.primary} />
                    <Text style={[styles.contactText, { color: colors.text }]}>
                      {vendor.website}
                    </Text>
                  </View>
                )}
                
                <View style={styles.contactItem}>
                  <MapPin size={18} color={colors.primary} />
                  <Text style={[styles.contactText, { color: colors.text }]}>
                    {vendor.address}, {vendor.city}, {vendor.state} {vendor.zipCode}
                  </Text>
                </View>
                
                <View style={styles.contactActions}>
                  <Button
                    title="Call"
                    onPress={handleCall}
                    leftIcon={<Phone size={16} color="#FFFFFF" />}
                    size="sm"
                    style={styles.contactButton}
                  />
                  
                  <Button
                    title="Email"
                    onPress={handleEmail}
                    leftIcon={<Mail size={16} color="#FFFFFF" />}
                    size="sm"
                    style={styles.contactButton}
                  />
                  
                  <Button
                    title="Chat"
                    onPress={handleChat}
                    leftIcon={<MessageSquare size={16} color="#FFFFFF" />}
                    size="sm"
                    style={styles.contactButton}
                  />
                </View>
              </Card>
              
              <Card style={styles.infoCard} elevation={1}>
                <View style={styles.hoursHeader}>
                  <Text style={[styles.infoTitle, { color: colors.text }]}>
                    Opening Hours
                  </Text>
                  <TouchableOpacity onPress={handleToggleHours}>
                    {showAllHours ? (
                      <ChevronUp size={20} color={colors.primary} />
                    ) : (
                      <ChevronDown size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                </View>
                
                {openingHours
                  .slice(0, showAllHours ? openingHours.length : 3)
                  .map((hours, index) => (
                    <View key={index} style={styles.hoursItem}>
                      <Text
                        style={[styles.dayText, { color: colors.text }]}
                      >
                        {hours.day}
                      </Text>
                      <Text
                        style={[
                          styles.hoursText,
                          {
                            color: hours.isClosed
                              ? colors.error
                              : colors.text,
                          },
                        ]}
                      >
                        {hours.isClosed
                          ? 'Closed'
                          : `${hours.open} - ${hours.close}`}
                      </Text>
                    </View>
                  ))}
              </Card>
              
              <Card style={styles.infoCard} elevation={1}>
                <Text style={[styles.infoTitle, { color: colors.text }]}>
                  Delivery Information
                </Text>
                
                <View style={styles.deliveryItem}>
                  <Text style={[styles.deliveryLabel, { color: colors.muted }]}>
                    Delivery Time:
                  </Text>
                  <Text style={[styles.deliveryValue, { color: colors.text }]}>
                    {vendor.deliveryTime}
                  </Text>
                </View>
                
                <View style={styles.deliveryItem}>
                  <Text style={[styles.deliveryLabel, { color: colors.muted }]}>
                    Delivery Fee:
                  </Text>
                  <Text style={[styles.deliveryValue, { color: colors.text }]}>
                    ${vendor.deliveryFee?.toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.deliveryItem}>
                  <Text style={[styles.deliveryLabel, { color: colors.muted }]}>
                    Minimum Order:
                  </Text>
                  <Text style={[styles.deliveryValue, { color: colors.text }]}>
                    ${vendor.minOrder?.toFixed(2)}
                  </Text>
                </View>
              </Card>
            </View>
          )}
          
          {activeTab === 'reviews' && (
            <View style={styles.reviewsContainer}>
              <View style={styles.reviewsHeader}>
                <View style={styles.reviewsSummary}>
                  <Text style={[styles.reviewsTitle, { color: colors.text }]}>
                    Customer Reviews
                  </Text>
                  <View style={styles.reviewsRating}>
                    <Star size={18} color="#FFD700" fill="#FFD700" />
                    <Text style={[styles.reviewsRatingText, { color: colors.text }]}>
                      {vendor.rating.toFixed(1)} ({vendor.reviewCount} reviews)
                    </Text>
                  </View>
                </View>
                
                <Button
                  title="Write a Review"
                  variant="outline"
                  size="sm"
                  style={styles.writeReviewButton}
                  onPress={handleWriteReview}
                />
              </View>
              
              {reviews.map((review) => (
                <Card key={review.id} style={styles.reviewCard} elevation={1}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{ uri: review.userAvatar }}
                      style={styles.reviewerAvatar}
                      resizeMode="cover"
                    />
                    
                    <View style={styles.reviewerInfo}>
                      <Text style={[styles.reviewerName, { color: colors.text }]}>
                        {review.userName}
                      </Text>
                      
                      <View style={styles.reviewRating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            color="#FFD700"
                            fill={star <= review.rating ? '#FFD700' : 'transparent'}
                          />
                        ))}
                        <Text style={[styles.reviewDate, { color: colors.muted }]}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <Text style={[styles.reviewComment, { color: colors.text }]}>
                    {review.comment}
                  </Text>
                </Card>
              ))}
              
              <Button
                title="See All Reviews"
                variant="outline"
                fullWidth
                style={styles.seeAllReviewsButton}
                onPress={handleSeeAllReviews}
              />
            </View>
          )}
        </View>
      </ScrollView>
      
      <CartButton onPress={handleCartPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'relative',
    height: 200,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  vendorInfo: {
    position: 'absolute',
    bottom: -40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    marginRight: 12,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  nameContainer: {
    flex: 1,
    paddingBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  detailsContainer: {
    marginTop: 48,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    marginTop: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContent: {
    padding: 16,
  },
  productsList: {
    paddingVertical: 8,
  },
  servicesList: {
    paddingVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
  },
  infoContainer: {
    gap: 16,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  contactButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  hoursHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  hoursText: {
    fontSize: 14,
  },
  deliveryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  deliveryLabel: {
    fontSize: 14,
  },
  deliveryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewsContainer: {
    gap: 16,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewsSummary: {
    flex: 1,
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewsRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewsRatingText: {
    fontSize: 14,
  },
  writeReviewButton: {
    marginLeft: 8,
  },
  reviewCard: {
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
  seeAllReviewsButton: {
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  errorButton: {
    width: 200,
  },
});