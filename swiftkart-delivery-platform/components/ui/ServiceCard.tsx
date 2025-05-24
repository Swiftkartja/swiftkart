import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import { Service } from '@/types';
import { Card } from './Card';
import { Star, Clock } from 'lucide-react-native';

interface ServiceCardProps {
  service: Service;
  onPress: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onPress,
}) => {
  const { colors } = useThemeStore();
  
  return (
    <Card
      style={styles.container}
      onPress={() => onPress(service)}
      elevation={2}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: service.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {service.discountPrice && (
          <View style={[styles.discountBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.discountText}>
              {Math.round(((service.price - service.discountPrice) / service.price) * 100)}% OFF
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {service.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Star size={12} color={colors.warning} fill={colors.warning} />
          <Text style={[styles.rating, { color: colors.muted }]}>
            {service.rating.toFixed(1)}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <View>
            {service.discountPrice ? (
              <View style={styles.priceContainer}>
                <Text style={[styles.originalPrice, { color: colors.muted }]}>
                  ${service.price.toFixed(2)}
                </Text>
                <Text style={[styles.price, { color: colors.primary }]}>
                  ${service.discountPrice.toFixed(2)}
                </Text>
              </View>
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
          
          <View style={styles.durationContainer}>
            <Clock size={14} color={colors.muted} />
            <Text style={[styles.duration, { color: colors.muted }]}>
              {service.duration}
            </Text>
          </View>
        </View>
        
        {service.providerName && (
          <View style={styles.providerContainer}>
            {service.providerImage ? (
              <Image
                source={{ uri: service.providerImage }}
                style={styles.providerImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.providerInitial, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.initialText, { color: colors.primary }]}>
                  {service.providerName.charAt(0)}
                </Text>
              </View>
            )}
            <Text style={[styles.providerName, { color: colors.muted }]} numberOfLines={1}>
              {service.providerName}
            </Text>
          </View>
        )}
      </View>
      
      {!service.isAvailable && (
        <View style={styles.unavailableOverlay}>
          <Text style={styles.unavailableText}>Unavailable</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    padding: 0,
    overflow: 'hidden',
    marginRight: 12,
  },
  imageContainer: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    height: 40,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'column',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  priceUnit: {
    fontSize: 10,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duration: {
    fontSize: 12,
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  providerImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  providerInitial: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    fontSize: 10,
    fontWeight: '600',
  },
  providerName: {
    fontSize: 12,
    flex: 1,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});