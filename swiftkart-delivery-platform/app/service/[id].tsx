import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Button } from '@/components/ui/Button';
import { Star, Heart, ChevronRight, Calendar, Clock, MapPin, User as UserIcon } from 'lucide-react-native';
import { mockServices } from '@/mocks/services';
import { mockVendors } from '@/mocks/vendors';

export default function ServiceDetailsScreen() {
  const { colors } = useThemeStore();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Safely get the service ID as a string
  const serviceId = typeof id === 'string' ? id : '';
  
  const service = mockServices.find(s => s.id === serviceId);
  const vendor = service ? mockVendors.find(v => v.id === service.vendorId) : null;
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  if (!service || !vendor) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Service Details' }} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Service not found
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
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const handleVendorPress = () => {
    router.push(`/vendor/${vendor.id}`);
  };
  
  const handleBookNow = () => {
    // In a real app, this would navigate to a booking confirmation screen
    alert('Booking service: ' + service.name);
  };
  
  // Mock available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayOfMonth: date.getDate(),
    };
  });
  
  // Mock available time slots
  const availableTimes = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: service.name }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: service.image }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          
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
        
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.name, { color: colors.text }]}>
                {service.name}
              </Text>
              
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Text style={[styles.rating, { color: colors.text }]}>
                  {service.rating.toFixed(1)} ({service.reviewCount} reviews)
                </Text>
              </View>
            </View>
            
            <View style={styles.priceContainer}>
              {service.discountPrice ? (
                <>
                  <Text
                    style={[styles.originalPrice, { color: colors.muted }]}
                  >
                    ${service.price.toFixed(2)}
                  </Text>
                  <Text
                    style={[styles.discountPrice, { color: colors.primary }]}
                  >
                    ${service.discountPrice.toFixed(2)}
                  </Text>
                </>
              ) : (
                <Text style={[styles.price, { color: colors.primary }]}>
                  ${service.price.toFixed(2)}
                </Text>
              )}
              
              {service.priceUnit && (
                <Text style={[styles.priceUnit, { color: colors.muted }]}>
                  {service.priceUnit}
                </Text>
              )}
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.vendorContainer, { borderColor: colors.border }]}
            onPress={handleVendorPress}
          >
            <Image
              source={{ uri: vendor.logo }}
              style={styles.vendorLogo}
              resizeMode="cover"
            />
            
            <View style={styles.vendorInfo}>
              <Text style={[styles.vendorName, { color: colors.text }]}>
                {vendor.name}
              </Text>
              <Text style={[styles.vendorLocation, { color: colors.muted }]}>
                {vendor.city}, {vendor.state}
              </Text>
            </View>
            
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: colors.muted }]}>
              {service.description}
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Service Details
            </Text>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Clock size={18} color={colors.primary} />
                <View>
                  <Text style={[styles.detailLabel, { color: colors.muted }]}>
                    Duration
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {service.duration}
                  </Text>
                </View>
              </View>
              
              {service.providerName && (
                <View style={styles.detailItem}>
                  <UserIcon size={18} color={colors.primary} />
                  <View>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>
                      Provider
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {service.providerName}
                    </Text>
                  </View>
                </View>
              )}
              
              {service.location && (
                <View style={styles.detailItem}>
                  <MapPin size={18} color={colors.primary} />
                  <View>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>
                      Location
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {service.location}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Select Date
            </Text>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesContainer}
            >
              {availableDates.map((date) => (
                <TouchableOpacity
                  key={date.date}
                  style={[
                    styles.dateButton,
                    {
                      backgroundColor:
                        selectedDate === date.date
                          ? colors.primary
                          : colors.card,
                      borderColor:
                        selectedDate === date.date
                          ? colors.primary
                          : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedDate(date.date)}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      {
                        color:
                          selectedDate === date.date
                            ? '#FFFFFF'
                            : colors.text,
                      },
                    ]}
                  >
                    {date.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateDayNumber,
                      {
                        color:
                          selectedDate === date.date
                            ? '#FFFFFF'
                            : colors.text,
                      },
                    ]}
                  >
                    {date.dayOfMonth}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Select Time
            </Text>
            
            <View style={styles.timesContainer}>
              {availableTimes.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    {
                      backgroundColor:
                        selectedTime === time ? colors.primary : colors.card,
                      borderColor:
                        selectedTime === time ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text
                    style={[
                      styles.timeText,
                      {
                        color: selectedTime === time ? '#FFFFFF' : colors.text,
                      },
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colors.card, borderTopColor: colors.border },
        ]}
      >
        <Button
          title="Book Now"
          onPress={handleBookNow}
          fullWidth
          disabled={!selectedDate || !selectedTime || !service.isAvailable}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 250,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  discountPrice: {
    fontSize: 24,
    fontWeight: '600',
  },
  priceUnit: {
    fontSize: 14,
    marginTop: 4,
  },
  vendorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 24,
  },
  vendorLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  vendorLocation: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  detailsContainer: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  datesContainer: {
    gap: 12,
    paddingVertical: 8,
  },
  dateButton: {
    width: 60,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  dateDayNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
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