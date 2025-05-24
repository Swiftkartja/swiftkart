import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockCategories } from '@/mocks/categories';
import { Category } from '@/types';
import { Search, Plus, Edit, Trash, Grid, ChevronRight } from 'lucide-react-native';

export default function CategoriesScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(mockCategories);
  
  // Filter categories based on search query
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddCategory = () => {
    Alert.prompt(
      "Add New Category",
      "Enter category name",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Add",
          onPress: (name) => {
            if (name && name.trim()) {
              const newCategory: Category = {
                id: `cat-${Date.now()}`,
                name: name.trim(),
                icon: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                color: '#' + Math.floor(Math.random()*16777215).toString(16),
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              setCategories([...categories, newCategory]);
            }
          }
        }
      ],
      "plain-text"
    );
  };
  
  const handleEditCategory = (category: Category) => {
    Alert.prompt(
      "Edit Category",
      "Update category name",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Update",
          onPress: (name) => {
            if (name && name.trim()) {
              const updatedCategories = categories.map(cat => 
                cat.id === category.id ? { ...cat, name: name.trim(), updatedAt: new Date().toISOString() } : cat
              );
              setCategories(updatedCategories);
            }
          }
        }
      ],
      "plain-text",
      category.name
    );
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedCategories = categories.filter(cat => cat.id !== categoryId);
            setCategories(updatedCategories);
          }
        }
      ]
    );
  };
  
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <Card
      style={styles.categoryCard}
      elevation={1}
    >
      <View style={styles.categoryHeader}>
        <Image
          source={{ uri: item.icon }}
          style={[styles.categoryIcon, { backgroundColor: item.color ? item.color + '20' : '#f0f0f0' }]}
          resizeMode="cover"
        />
        
        <View style={styles.categoryInfo}>
          <Text style={[styles.categoryName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.categoryId, { color: colors.muted }]}>
            ID: {item.id}
          </Text>
        </View>
      </View>
      
      <View style={styles.categoryActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
          onPress={() => handleEditCategory(item)}
        >
          <Edit size={16} color={colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.error + '20' }]}
          onPress={() => handleDeleteCategory(item.id)}
        >
          <Trash size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </Card>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Categories' }} />
      
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Search size={20} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search categories..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <Button
          title="Add"
          onPress={handleAddCategory}
          size="sm"
          leftIcon={<Plus size={16} color="#FFFFFF" />}
        />
      </View>
      
      <FlatList
        key="categories-grid"
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Grid size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No categories found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.muted }]}>
              Try adjusting your search or add a new category
            </Text>
          </View>
        }
      />
      
      <View style={styles.footer}>
        <Button
          title="Add New Category"
          onPress={handleAddCategory}
          fullWidth
          leftIcon={<Plus size={20} color="#FFFFFF" />}
        />
      </View>
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
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  categoryCard: {
    flex: 1,
    margin: 6,
    padding: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryId: {
    fontSize: 12,
  },
  categoryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  footer: {
    padding: 16,
  },
});