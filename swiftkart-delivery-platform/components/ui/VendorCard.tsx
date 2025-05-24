import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import { Vendor } from '@/types';
import { Card } from './Card';
import { Star, Clock, MapPin } from 'lucide-react-native';

interface VendorCardProps {
  vendor: Vendor;
  onPress: (vendor: Vendor) => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor, onPress }) => {
  const { colors } = useThemeStore();
  
  return (
    <Card
      style={styles.container}
      onPress={() => onPress(vendor)}
      elevation={3}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: vendor.coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: vendor.logo }}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {vendor.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={colors.warning} fill={colors.warning} />
            <Text style={[styles.rating, { color: colors.text }]}>
              {vendor.rating.toFixed(1)}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.description, { color: colors.muted }]} numberOfLines={2}>
          {vendor.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.infoItem}>
            <Clock size={14} color={colors.muted} />
            <Text style={[styles.infoText, { color: colors.muted }]}>
              {vendor.deliveryTime}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <MapPin size={14} color={colors.muted} />
            <Text style={[styles.infoText, { color: colors.muted }]}>
              {vendor.distance ? `${vendor.distance.toFixed(1)} km` : vendor.city}
            </Text>
          </View>
        </View>
      </View>
      
      {vendor.isFeatured && (
        <View style={[styles.featuredBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    position: 'absolute',
    bottom: -20,
    left: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});