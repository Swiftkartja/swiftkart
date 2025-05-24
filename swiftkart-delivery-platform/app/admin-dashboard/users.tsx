import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockUsers } from '@/mocks/users';
import { User, UserRole } from '@/types';
import { Search, Filter, User as UserIcon, ChevronRight, Mail, Phone } from 'lucide-react-native';

export default function UsersScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  
  // Filter users based on search query and selected role
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });
  
  const handleUserPress = (userId: string) => {
    router.push(`/admin-dashboard/user/${userId}`);
  };
  
  const handleAddUser = () => {
    // In a real app, this would navigate to a user creation form
    alert('Add user functionality would be implemented here');
  };
  
  const renderUserItem = ({ item }: { item: User }) => (
    <Card
      style={styles.userCard}
      onPress={() => handleUserPress(item.id)}
      elevation={1}
    >
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {item.name}
          </Text>
          <View style={styles.userMeta}>
            <View style={styles.metaItem}>
              <Mail size={12} color={colors.muted} />
              <Text style={[styles.metaText, { color: colors.muted }]}>
                {item.email}
              </Text>
            </View>
            {item.phone && (
              <View style={styles.metaItem}>
                <Phone size={12} color={colors.muted} />
                <Text style={[styles.metaText, { color: colors.muted }]}>
                  {item.phone}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View
          style={[
            styles.roleBadge,
            {
              backgroundColor: getRoleColor(item.role),
            },
          ]}
        >
          <Text style={styles.roleText}>
            {getRoleLabel(item.role)}
          </Text>
        </View>
      </View>
      
      <View style={styles.userActions}>
        <Button
          title="View Details"
          onPress={() => handleUserPress(item.id)}
          variant="outline"
          size="sm"
          rightIcon={<ChevronRight size={16} color={colors.primary} />}
        />
      </View>
    </Card>
  );
  
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return colors.error;
      case 'vendor':
        return colors.primary;
      case 'rider':
        return colors.warning;
      case 'customer':
        return colors.info;
      default:
        return colors.muted;
    }
  };
  
  const getRoleLabel = (role: UserRole) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Manage Users' }} />
      
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Search size={20} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search users..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <Button
          title="Add User"
          onPress={handleAddUser}
          size="sm"
        />
      </View>
      
      <View style={styles.filterContainer}>
        <Text style={[styles.filterLabel, { color: colors.text }]}>
          Filter by role:
        </Text>
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedRole === 'all' && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => setSelectedRole('all')}
          >
            <Text
              style={[
                styles.filterText,
                { color: selectedRole === 'all' ? colors.primary : colors.text },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedRole === 'customer' && { backgroundColor: colors.info + '20' },
            ]}
            onPress={() => setSelectedRole('customer')}
          >
            <Text
              style={[
                styles.filterText,
                { color: selectedRole === 'customer' ? colors.info : colors.text },
              ]}
            >
              Customers
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedRole === 'vendor' && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => setSelectedRole('vendor')}
          >
            <Text
              style={[
                styles.filterText,
                { color: selectedRole === 'vendor' ? colors.primary : colors.text },
              ]}
            >
              Vendors
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedRole === 'rider' && { backgroundColor: colors.warning + '20' },
            ]}
            onPress={() => setSelectedRole('rider')}
          >
            <Text
              style={[
                styles.filterText,
                { color: selectedRole === 'rider' ? colors.warning : colors.text },
              ]}
            >
              Riders
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedRole === 'admin' && { backgroundColor: colors.error + '20' },
            ]}
            onPress={() => setSelectedRole('admin')}
          >
            <Text
              style={[
                styles.filterText,
                { color: selectedRole === 'admin' ? colors.error : colors.text },
              ]}
            >
              Admins
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <UserIcon size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No users found
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
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  userCard: {
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userMeta: {
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
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  userActions: {
    alignItems: 'flex-end',
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