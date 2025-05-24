import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
  StyleProp
} from 'react-native';
import { useThemeStore } from '@/store/theme-store';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode; // Added children prop to support passing elements inside Button
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  children,
}) => {
  const { colors } = useThemeStore();
  
  const getButtonStyles = (): StyleProp<ViewStyle> => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...sizeStyles[size],
      ...(fullWidth && styles.fullWidth),
    };
    
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: colors.primary,
      },
      secondary: {
        backgroundColor: colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      danger: {
        backgroundColor: colors.error,
      },
    };
    
    const disabledStyle: ViewStyle = {
      opacity: 0.5,
    };
    
    return [
      baseStyle,
      variantStyles[variant],
      disabled && disabledStyle,
      style,
    ];
  };
  
  const getTextStyles = (): StyleProp<TextStyle> => {
    const baseStyle: TextStyle = {
      ...styles.text,
      ...textSizeStyles[size],
    };
    
    const variantTextStyles: Record<ButtonVariant, TextStyle> = {
      primary: {
        color: '#FFFFFF',
      },
      secondary: {
        color: colors.text,
      },
      outline: {
        color: colors.primary,
      },
      ghost: {
        color: colors.primary,
      },
      danger: {
        color: '#FFFFFF',
      },
    };
    
    return [
      baseStyle,
      variantTextStyles[variant],
      textStyle,
    ];
  };
  
  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    sm: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
    },
    md: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    lg: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 10,
    },
  };
  
  const textSizeStyles: Record<ButtonSize, TextStyle> = {
    sm: {
      fontSize: 14,
    },
    md: {
      fontSize: 16,
    },
    lg: {
      fontSize: 18,
    },
  };
  
  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF'} 
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={getTextStyles()}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
          {children}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});