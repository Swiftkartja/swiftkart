import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName, Platform } from 'react-native';

// Define the theme colors
const lightColors = {
  primary: '#10b981', // SwiftKart turquoise-green
  secondary: '#0ea5e9',
  background: '#f9fafb',
  card: '#ffffff',
  text: '#1f2937',
  border: '#e5e7eb',
  notification: '#ef4444',
  muted: '#6b7280',
  subtle: '#f3f4f6',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6',
};

const darkColors = {
  primary: '#10b981', // SwiftKart turquoise-green
  secondary: '#0ea5e9',
  background: '#111827',
  card: '#1f2937',
  text: '#f9fafb',
  border: '#374151',
  notification: '#ef4444',
  muted: '#9ca3af',
  subtle: '#374151',
  error: '#f87171',
  success: '#34d399',
  warning: '#fbbf24',
  info: '#60a5fa',
};

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  colors: typeof lightColors;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  applySystemTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      isDark: Appearance.getColorScheme() === 'dark',
      colors: Appearance.getColorScheme() === 'dark' ? darkColors : lightColors,
      
      setMode: (mode: ThemeMode) => {
        let isDark = get().isDark;
        let colors = get().colors;
        
        if (mode === 'system') {
          isDark = Appearance.getColorScheme() === 'dark';
          colors = isDark ? darkColors : lightColors;
        } else {
          isDark = mode === 'dark';
          colors = isDark ? darkColors : lightColors;
        }
        
        set({ mode, isDark, colors });
      },
      
      toggleTheme: () => {
        const currentMode = get().mode;
        
        // If in system mode, switch to explicit light/dark
        if (currentMode === 'system') {
          const systemIsDark = Appearance.getColorScheme() === 'dark';
          // Toggle to the opposite of the system theme
          const newMode = systemIsDark ? 'light' : 'dark';
          const newIsDark = newMode === 'dark';
          set({ 
            mode: newMode, 
            isDark: newIsDark, 
            colors: newIsDark ? darkColors : lightColors 
          });
        } else {
          // Toggle between light and dark
          const newMode = currentMode === 'dark' ? 'light' : 'dark';
          const newIsDark = newMode === 'dark';
          set({ 
            mode: newMode, 
            isDark: newIsDark, 
            colors: newIsDark ? darkColors : lightColors 
          });
        }
      },
      
      applySystemTheme: () => {
        const systemIsDark = Appearance.getColorScheme() === 'dark';
        const currentMode = get().mode;
        
        // Only update if in system mode
        if (currentMode === 'system') {
          set({ 
            isDark: systemIsDark, 
            colors: systemIsDark ? darkColors : lightColors 
          });
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Listen for system theme changes
if (Platform.OS !== 'web') {
  Appearance.addChangeListener(({ colorScheme }) => {
    const themeStore = useThemeStore.getState();
    if (themeStore.mode === 'system') {
      themeStore.applySystemTheme();
    }
  });
}