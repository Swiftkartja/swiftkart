import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockUsers } from '@/mocks/users';
import { User } from '@/types';
import { Search, Filter, Truck, ChevronRight, MapPin, Star, Phone } from 'lucide-react-native';

export default function RidersScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOnline, setFilterOnline] = useState<boolean | null>(null);
  
  // Filter riders from users
  const riders = mockUsers.filter(user => user.role === 'rider');
  
  // Apply search and online status filters
  const filteredRiders = riders.filter(rider => {
    const matchesSearch = 
      rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rider.email && rider.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesOnlineStatus = 
      filterOnline === null || 
      (rider.riderInfo && rider.riderInfo.isOnline === filterOnline);
    
    return matchesSearch && matchesOnlineStatus;
  });
  
  const handleRiderPress = (riderId: string) => {
    router.push(`/admin-dashboard/rider/${riderId}`);
  };
  
  const handleAddRider = () => {
    // In a real app, this would navigate to a rider creation form
    alert('Add rider functionality would be implemented here');
  };
  
  const renderRiderItem = ({ item }: { item: User }) => (
    <Card
      style={styles.riderCard}
      onPress={() => handleRiderPress(item.id)}
      elevation={1}
    >
      <View style={styles.riderHeader}>
        <Image
          source={{ uri: item.avatar }}
          style={styles.riderAvatar}
          resizeMode="cover"
        />
        
        <View style={styles.riderInfo}>
          <Text style={[styles.riderName, { color: colors.text }]}>
            {item.name}
          </Text>
          
          <View style={styles.riderMeta}>
            {item.riderInfo?.area && (
              <View style={styles.metaItem}>
                <MapPin size={12} color={colors.muted} />
                <Text style={[styles.metaText, { color: colors.muted }]}>
                  {item.riderInfo.area}
                </Text>
              </View>
            )}
            
            {item.phone && (
              <View style={styles.metaItem}>
                <Phone size={12} color={colors.muted} />
                <Text style={[styles.metaText, { color: colors.muted }]}>
                  {item.phone}
                </Text>
              </View>
            )}
            
            {item.riderInfo?.rating && (
              <View style={styles.metaItem}>
                <Star size={12} color={colors.warning} />
                <Text style={[styles.metaText, { color: colors.muted }]}>
                  {item.riderInfo.rating} ({item.riderInfo.completedDeliveries || 0} deliveries)
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.riderInfo?.isOnline 
                ? colors.success + '20' 
                : colors.error + '20',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { 
                color: item.riderInfo?.isOnline 
                  ? colors.success 
                  : colors.error 
              },
            ]}
          >
            {item.riderInfo?.isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>
      
      <View style={styles.riderFooter}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {item.riderInfo?.completedDeliveries || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              Deliveries
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              ${item.riderInfo?.earnings?.toFixed(2) || '0.00'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              Earnings
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {item.riderInfo?.activeDeliveries || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              Active
            </Text>
          </View>
        </View>
        
        <Button
          title="View Details"
          onPress={() => handleRiderPress(item.id)}
          variant="outline"
          size="sm"
          rightIcon={<ChevronRight size={16} color={colors.primary} />}
        />
      </View>
    </Card>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Manage Riders' }} />
      
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Search size={20} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search riders..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <Button
          title="Add Rider"
          onPress={handleAddRider}
          size="sm"
        />
      </View>
      
      <View style={styles.filterContainer}>
        <Text style={[styles.filterLabel, { color: colors.text }]}>
          Filter:
        </Text>
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={[
              styles.filterOption,
              filterOnline === null && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => setFilterOnline(null)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filterOnline === null ? colors.primary : colors.text },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterOption,
              filterOnline === true && { backgroundColor: colors.success + '20' },
            ]}
            onPress={() => setFilterOnline(true)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filterOnline === true ? colors.success : colors.text },
              ]}
            >
              Online
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterOption,
              filterOnline === false && { backgroundColor: colors.error + '20' },
            ]}
            onPress={() => setFilterOnline(false)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filterOnline === false ? colors.error : colors.text },
              ]}
            >
              Offline
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={filteredRiders}
        keyExtractor={(item) => item.id}
        renderItem={renderRiderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Truck size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No riders found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.muted }]}>
              Try adjusting your search or filters
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
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
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  riderCard: {
    marginBottom: 12,
  },
  riderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  riderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  riderMeta: {
    gap: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  riderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
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