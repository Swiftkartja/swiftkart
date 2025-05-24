import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import { Category } from '@/types';

interface CategoryItemProps {
  category: Category;
  onPress: (category: Category) => void;
  isSelected?: boolean;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onPress,
  isSelected = false,
}) => {
  const { colors } = useThemeStore();
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? colors.primary : colors.card,
          borderColor: isSelected ? colors.primary : colors.border,
        },
      ]}
      onPress={() => onPress(category)}
      activeOpacity={0.7}
    >
      {category.image ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: category.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={[
            styles.overlay,
            { backgroundColor: isSelected ? colors.primary + '80' : 'rgba(0,0,0,0.3)' }
          ]} />
        </View>
      ) : (
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: isSelected ? '#FFFFFF' : colors.primary + '20' },
          ]}
        >
          {/* We would use the icon here, but for now we'll just show the first letter */}
          <Text
            style={[
              styles.iconText,
              { color: isSelected ? colors.primary : colors.primary },
            ]}
          >
            {category.name.charAt(0)}
          </Text>
        </View>
      )}
      
      <Text
        style={[
          styles.name,
          { color: isSelected ? '#FFFFFF' : colors.text },
        ]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
    marginRight: 12,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});