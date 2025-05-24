import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/Button';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  MapPin,
  MoreVertical,
  Edit,
  Trash,
  Eye,
  Copy,
  CheckCircle,
  XCircle
} from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Service } from '@/types';

// Mock services data
const mockServices: Service[] = [
  {
    id: 'service-1',
    vendorId: 'vendor-1',
    name: 'Home Cleaning Service',
    description: 'Professional home cleaning service for all your needs.',
    price: 75.00,
    priceType: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    category: 'Cleaning',
    tags: ['home', 'cleaning', 'professional'],
    duration: 120,
    isAvailable: true,
    serviceAreas: ['Kingston', 'Portmore'],
    createdAt: '2023-01-15T12:00:00Z',
    updatedAt: '2023-01-15T12:00:00Z'
  },
  {
    id: 'service-2',
    vendorId: 'vendor-1',
    name: 'Plumbing Repair',
    description: 'Fix leaks, clogs, and other plumbing issues.',
    price: 50.00,
    priceType: 'hourly',
    images: [
      'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    category: 'Repair',
    tags: ['plumbing', 'repair', 'emergency'],
    isAvailable: true,
    serviceAreas: ['Kingston', 'Montego Bay'],
    createdAt: '2023-01-20T10:00:00Z',
    updatedAt: '2023-01-20T10:00:00Z'
  },
  {
    id: 'service-3',
    vendorId: 'vendor-1',
    name: 'Lawn Mowing',
    description: 'Keep your lawn looking neat and tidy.',
    price: 40.00,
    priceType: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    category: 'Gardening',
    tags: ['lawn', 'garden', 'outdoor'],
    duration: 60,
    isAvailable: false,
    serviceAreas: ['Kingston'],
    createdAt: '2023-02-05T14:00:00Z',
    updatedAt: '2023-02-05T14:00:00Z'
  },
  {
    id: 'service-4',
    vendorId: 'vendor-1',
    name: 'Electrical Installation',
    description: 'Professional installation of electrical fixtures and systems.',
    price: 60.00,
    priceType: 'hourly',
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    category: 'Installation',
    tags: ['electrical', 'installation', 'professional'],
    isAvailable: true,
    serviceAreas: ['Kingston', 'Portmore', 'Spanish Town'],
    createdAt: '2023-02-10T09:00:00Z',
    updatedAt: '2023-02-10T09:00:00Z'
  },
  {
    id: 'service-5',
    vendorId: 'vendor-1',
    name: 'House Painting',
    description: 'Transform your space with a fresh coat of paint.',
    price: 200.00,
    priceType: 'starting_at',
    images: [
      'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    category: 'Home Improvement',
    tags: ['painting', 'home', 'renovation'],
    isAvailable: true,
    serviceAreas: ['Kingston', 'Montego Bay', 'Ocho Rios'],
    createdAt: '2023-03-01T11:00:00Z',
    updatedAt: '2023-03-01T11:00:00Z'
  }
];

export default function ServicesScreen() {
  const { colors } = useThemeStore();
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  // Load services
  useEffect(() => {
    loadServices();
  }, []);
  
  // Filter services when search query or filter changes
  useEffect(() => {
    filterServices();
  }, [services, searchQuery, activeFilter]);
  
  // Load services from backend (mock for now)
  const loadServices = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, fetch from Firestore
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setServices(mockServices);
    } catch (error) {
      console.error('Error loading services:', error);
      Alert.alert('Error', 'Failed to load services. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter services based on search query and active filter
  const filterServices = () => {
    let filtered = [...services];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        service => 
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.category.toLowerCase().includes(query) ||
          service.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply availability filter
    if (activeFilter === 'available') {
      filtered = filtered.filter(service => service.isAvailable);
    } else if (activeFilter === 'unavailable') {
      filtered = filtered.filter(service => !service.isAvailable);
    }
    
    setFilteredServices(filtered);
  };
  
  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadServices();
    setRefreshing(false);
  };
  
  // Handle service selection
  const toggleServiceSelection = (serviceId: string) => {
    if (selectedService === serviceId) {
      setSelectedService(null);
    } else {
      setSelectedService(serviceId);
    }
  };
  
  // Handle edit service
  const handleEditService = (serviceId: string) => {
    router.push(`/vendor-dashboard/service/${serviceId}`);
  };
  
  // Handle delete service
  const handleDeleteService = (serviceId: string) => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // In a real app, delete from Firestore
              // For now, update local state
              setServices(services.filter(service => service.id !== serviceId));
              setSelectedService(null);
              
              // Show success message
              Alert.alert('Success', 'Service deleted successfully!');
            } catch (error) {
              console.error('Error deleting service:', error);
              Alert.alert('Error', 'Failed to delete service. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  // Handle duplicate service
  const handleDuplicateService = (serviceId: string) => {
    try {
      const serviceToDuplicate = services.find(service => service.id === serviceId);
      
      if (serviceToDuplicate) {
        const duplicatedService: Service = {
          ...serviceToDuplicate,
          id: `service-${Date.now()}`,
          name: `${serviceToDuplicate.name} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setServices([duplicatedService, ...services]);
        setSelectedService(null);
        
        // Show success message
        Alert.alert('Success', 'Service duplicated successfully!');
      }
    } catch (error) {
      console.error('Error duplicating service:', error);
      Alert.alert('Error', 'Failed to duplicate service. Please try again.');
    }
  };
  
  // Handle toggle service availability
  const handleToggleAvailability = (serviceId: string) => {
    try {
      const updatedServices = services.map(service => {
        if (service.id === serviceId) {
          return {
            ...service,
            isAvailable: !service.isAvailable,
            updatedAt: new Date().toISOString()
          };
        }
        return service;
      });
      
      setServices(updatedServices);
      setSelectedService(null);
      
      // Show success message
      const service = services.find(s => s.id === serviceId);
      const newStatus = service?.isAvailable ? 'unavailable' : 'available';
      Alert.alert('Success', `Service is now ${newStatus}!`);
    } catch (error) {
      console.error('Error toggling service availability:', error);
      Alert.alert('Error', 'Failed to update service. Please try again.');
    }
  };
  
  // Handle view service
  const handleViewService = (serviceId: string) => {
    // In a real app, navigate to the customer-facing service page
    Alert.alert('View Service', 'This would open the customer-facing service page.');
  };
  
  // Render service item
  const renderServiceItem = ({ item }: { item: Service }) => {
    const isSelected = selectedService === item.id;
    
    return (
      <View 
        style={[
          styles.serviceItem,
          { 
            backgroundColor: colors.card,
            borderColor: isSelected ? colors.primary : colors.border
          }
        ]}
      >
        <TouchableOpacity
          style={styles.serviceHeader}
          onPress={() => handleEditService(item.id)}
        >
          <Image 
            source={{ uri: item.images[0] }} 
            style={styles.serviceImage} 
            resizeMode="cover"
          />
          
          <View style={styles.serviceInfo}>
            <View style={styles.serviceNameContainer}>
              <Text 
                style={[styles.serviceName, { color: colors.text }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              {!item.isAvailable && (
                <View style={[
                  styles.unavailableBadge,
                  { backgroundColor: colors.error + '20' }
                ]}>
                  <Text style={[styles.unavailableBadgeText, { color: colors.error }]}>
                    Unavailable
                  </Text>
                </View>
              )}
            </View>
            
            <Text 
              style={[styles.serviceDescription, { color: colors.muted }]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
            
            <View style={styles.serviceDetails}>
              <View style={styles.serviceDetail}>
                <DollarSign size={14} color={colors.primary} />
                <Text style={[styles.serviceDetailText, { color: colors.text }]}>
                  ${item.price.toFixed(2)}
                  {item.priceType === 'hourly' ? '/hr' : 
                   item.priceType === 'starting_at' ? '+ ' : ''}
                </Text>
              </View>
              
              {item.duration && (
                <View style={styles.serviceDetail}>
                  <Clock size={14} color={colors.primary} />
                  <Text style={[styles.serviceDetailText, { color: colors.text }]}>
                    {item.duration} min
                  </Text>
                </View>
              )}
              
              {item.serviceAreas && item.serviceAreas.length > 0 && (
                <View style={styles.serviceDetail}>
                  <MapPin size={14} color={colors.primary} />
                  <Text style={[styles.serviceDetailText, { color: colors.text }]}>
                    {item.serviceAreas.length} {item.serviceAreas.length === 1 ? 'area' : 'areas'}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => toggleServiceSelection(item.id)}
          >
            <MoreVertical size={20} color={colors.muted} />
          </TouchableOpacity>
        </TouchableOpacity>
        
        {isSelected && (
          <View style={[styles.actionMenu, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => handleEditService(item.id)}
            >
              <Edit size={16} color={colors.primary} />
              <Text style={[styles.actionMenuItemText, { color: colors.text }]}>
                Edit
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => handleToggleAvailability(item.id)}
            >
              {item.isAvailable ? (
                <XCircle size={16} color={colors.error} />
              ) : (
                <CheckCircle size={16} color={colors.success} />
              )}
              <Text style={[styles.actionMenuItemText, { color: colors.text }]}>
                {item.isAvailable ? 'Disable' : 'Enable'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => handleDuplicateService(item.id)}
            >
              <Copy size={16} color={colors.info} />
              <Text style={[styles.actionMenuItemText, { color: colors.text }]}>
                Duplicate
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => handleViewService(item.id)}
            >
              <Eye size={16} color={colors.warning} />
              <Text style={[styles.actionMenuItemText, { color: colors.text }]}>
                View
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => handleDeleteService(item.id)}
            >
              <Trash size={16} color={colors.error} />
              <Text style={[styles.actionMenuItemText, { color: colors.text }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  
  // Render empty state
  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Loading services...
          </Text>
        </View>
      );
    }
    
    if (searchQuery || activeFilter !== 'all') {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No matching services
          </Text>
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            Try adjusting your search or filters
          </Text>
          <Button
            title="Clear Filters"
            onPress={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            variant="outline"
            style={styles.emptyButton}
          />
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No services yet
        </Text>
        <Text style={[styles.emptyText, { color: colors.muted }]}>
          Add your first service to start receiving bookings
        </Text>
        <Button
          title="Add Service"
          onPress={() => router.push('/vendor-dashboard/add-service')}
          style={styles.emptyButton}
        />
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'Services',
          headerRight: () => (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/vendor-dashboard/add-service')}
            >
              <Plus size={20} color={colors.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={20} color={colors.muted} />}
            containerStyle={styles.searchInput}
          />
        </View>
        
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'all' && { 
                backgroundColor: colors.primary + '20',
                borderColor: colors.primary
              },
              { borderColor: colors.border }
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[
              styles.filterButtonText,
              { color: activeFilter === 'all' ? colors.primary : colors.text }
            ]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'available' && { 
                backgroundColor: colors.success + '20',
                borderColor: colors.success
              },
              { borderColor: colors.border }
            ]}
            onPress={() => setActiveFilter('available')}
          >
            <Text style={[
              styles.filterButtonText,
              { color: activeFilter === 'available' ? colors.success : colors.text }
            ]}>
              Available
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'unavailable' && { 
                backgroundColor: colors.error + '20',
                borderColor: colors.error
              },
              { borderColor: colors.border }
            ]}
            onPress={() => setActiveFilter('unavailable')}
          >
            <Text style={[
              styles.filterButtonText,
              { color: activeFilter === 'unavailable' ? colors.error : colors.text }
            ]}>
              Unavailable
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
      
      <View style={styles.footer}>
        <Button
          title="Add New Service"
          onPress={() => router.push('/vendor-dashboard/add-service')}
          leftIcon={<Plus size={20} color="#FFFFFF" />}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    padding: 8,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filterButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  serviceItem: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  serviceHeader: {
    flexDirection: 'row',
    padding: 12,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  serviceNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    flex: 1,
  },
  unavailableBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  unavailableBadgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  serviceDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  serviceDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  serviceDetailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  moreButton: {
    padding: 4,
  },
  actionMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  actionMenuItem: {
    alignItems: 'center',
    padding: 8,
  },
  actionMenuItemText: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    width: 200,
  },
  footer: {
    padding: 16,
    paddingTop: 0,
  },
});