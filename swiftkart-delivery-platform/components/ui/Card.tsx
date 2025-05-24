import React from 'react';
import { 
  StyleSheet, 
  View, 
  StyleProp, 
  ViewStyle,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useThemeStore } from '@/store/theme-store';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevation?: number;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevation = 2,
  bordered = false,
}) => {
  const { colors, isDark } = useThemeStore();
  
  const cardStyle: StyleProp<ViewStyle> = [
    styles.card,
    { 
      backgroundColor: colors.card,
      borderColor: bordered ? colors.border : 'transparent',
      ...Platform.select({
        ios: {
          shadowColor: isDark ? '#000' : '#000',
          shadowOffset: { width: 0, height: elevation },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: elevation,
        },
        android: {
          elevation: elevation,
        },
        web: {
          boxShadow: `0px ${elevation}px ${elevation * 2}px rgba(0, 0, 0, ${isDark ? 0.3 : 0.1})`,
        },
      }),
    },
    style,
  ];
  
  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardStyle} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }
  
  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
});