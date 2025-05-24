import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockVendors } from '@/mocks/vendors';
import { Vendor } from '@/types';
import { Search, Filter, Store, ChevronRight, MapPin, Star, Clock } from 'lucide-react-native';

export default function VendorsScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState<boolean | null>(null);
  
  // Filter vendors based on search query and open status
  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesOpenStatus = 
      filterOpen === null || vendor.isOpen === filterOpen;
    
    return matchesSearch && matchesOpenStatus;
  });
  
  const handleVendorPress = (vendorId: string) => {
    router.push(`/admin-dashboard/vendor/${vendorId}`);
  };
  
  const handleAddVendor = () => {
    // In a real app, this would navigate to a vendor creation form
    alert('Add vendor functionality would be implemented here');
  };
  
  const renderVendorItem = ({ item }: { item: Vendor }) => (
    <Card
      style={styles.vendorCard}
      onPress={() => handleVendorPress(item.id)}
      elevation={1}
    >
      <View style={styles.vendorHeader}>
        <Image
          source={{ uri: item.logo }}
          style={styles.vendorLogo}
          resizeMode="cover"
        />
        
        <View style={styles.vendorInfo}>
          <Text style={[styles.vendorName, { color: colors.text }]}>
            {item.name}
          </Text>
          
          <View style={styles.vendorMeta}>
            <View style={styles.metaItem}>
              <MapPin size={12} color={colors.muted} />
              <Text style={[styles.metaText, { color: colors.muted }]}>
                {item.address}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Star size={12} color={colors.warning} />
              <Text style={[styles.metaText, { color: colors.muted }]}>
                {item.rating} ({item.reviewCount} reviews)
              </Text>
            </View>
          </View>
        </View>
        
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.isOpen ? colors.success + '20' : colors.error + '20',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.isOpen ? colors.success : colors.error },
            ]}
          >
            {item.isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>
      
      <Text
        style={[styles.vendorDescription, { color: colors.muted }]}
        numberOfLines={2}
      >
        {item.description}
      </Text>
      
      <View style={styles.vendorFooter}>
        <View style={styles.categoriesContainer}>
          {item.categories.slice(0, 3).map((categoryId, index) => (
            <View
              key={categoryId}
              style={[
                styles.categoryBadge,
                { backgroundColor: colors.primary + '15' },
              ]}
            >
              <Text style={[styles.categoryText, { color: colors.primary }]}>
                {getCategoryName(categoryId)}
              </Text>
            </View>
          ))}
          
          {item.categories.length > 3 && (
            <Text style={[styles.moreCategories, { color: colors.muted }]}>
              +{item.categories.length - 3} more
            </Text>
          )}
        </View>
        
        <Button
          title="View Details"
          onPress={() => handleVendorPress(item.id)}
          variant="outline"
          size="sm"
          rightIcon={<ChevronRight size={16} color={colors.primary} />}
        />
      </View>
    </Card>
  );
  
  // Helper function to get category name from ID
  // In a real app, this would use a proper lookup from categories data
  const getCategoryName = (categoryId: string) => {
    const categoryMap: Record<string, string> = {
      'cat-1': 'Food',
      'cat-2': 'Grocery',
      'cat-3': 'Pharmacy',
      'cat-4': 'Electronics',
      'cat-5': 'Fashion',
      'cat-6': 'Beauty',
      'cat-7': 'Home',
      'cat-8': 'Sports',
    };
    
    return categoryMap[categoryId] || categoryId;
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Manage Vendors' }} />
      
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Search size={20} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search vendors..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <Button
          title="Add Vendor"
          onPress={handleAddVendor}
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
              filterOpen === null && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => setFilterOpen(null)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filterOpen === null ? colors.primary : colors.text },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterOption,
              filterOpen === true && { backgroundColor: colors.success + '20' },
            ]}
            onPress={() => setFilterOpen(true)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filterOpen === true ? colors.success : colors.text },
              ]}
            >
              Open
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterOption,
              filterOpen === false && { backgroundColor: colors.error + '20' },
            ]}
            onPress={() => setFilterOpen(false)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filterOpen === false ? colors.error : colors.text },
              ]}
            >
              Closed
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={filteredVendors}
        keyExtractor={(item) => item.id}
        renderItem={renderVendorItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Store size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No vendors found
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
  vendorCard: {
    marginBottom: 12,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vendorLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  vendorMeta: {
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
  vendorDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  vendorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
  },
  moreCategories: {
    fontSize: 10,
    marginLeft: 4,
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