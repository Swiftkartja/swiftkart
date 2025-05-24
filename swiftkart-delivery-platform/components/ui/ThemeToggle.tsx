import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import { Moon, Sun, Monitor } from 'lucide-react-native';

export const ThemeToggle = () => {
  const { mode, setMode, colors } = useThemeStore();

  const handleToggle = () => {
    // Cycle through modes: light -> dark -> system -> light
    const nextMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
    setMode(nextMode);
    
    // Show confirmation
    Alert.alert(
      'Theme Updated',
      `The app theme has been set to ${nextMode.charAt(0).toUpperCase() + nextMode.slice(1)} mode.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.subtle }]}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <View style={styles.iconsContainer}>
        <Sun
          size={16}
          color={mode === 'light' ? colors.primary : colors.muted}
          style={styles.icon}
        />
        <Moon
          size={16}
          color={mode === 'dark' ? colors.primary : colors.muted}
          style={styles.icon}
        />
        <Monitor
          size={16}
          color={mode === 'system' ? colors.primary : colors.muted}
          style={styles.icon}
        />
      </View>
      <View
        style={[
          styles.indicator,
          { backgroundColor: colors.primary },
          mode === 'light'
            ? styles.indicatorLeft
            : mode === 'dark'
            ? styles.indicatorCenter
            : styles.indicatorRight,
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 32,
    borderRadius: 16,
    padding: 4,
    position: 'relative',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 6,
  },
  icon: {
    zIndex: 1,
  },
  indicator: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    top: 4,
    transition: 'all 0.3s ease',
  },
  indicatorLeft: {
    left: 4,
  },
  indicatorCenter: {
    left: 28,
  },
  indicatorRight: {
    left: 52,
  },
});

export default ThemeToggle;