'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'dark' | 'light' | 'auto';
export type AccentColor = 'blue' | 'purple' | 'pink' | 'green' | 'orange' | 'red';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface ThemeContextType {
  // Appearance
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  transparencyEnabled: boolean;
  setTransparencyEnabled: (enabled: boolean) => void;
  
  // Display
  scaling: number;
  setScaling: (scale: number) => void;
  nightMode: boolean;
  setNightMode: (enabled: boolean) => void;
  
  // System
  autoUpdate: boolean;
  setAutoUpdate: (enabled: boolean) => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  
  // Helper functions
  getAccentColorClass: () => string;
  getFontSizeClass: () => string;
  getBackdropBlurClass: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [accentColor, setAccentColor] = useState<AccentColor>('blue');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [transparencyEnabled, setTransparencyEnabled] = useState(true);
  const [scaling, setScaling] = useState(100);
  const [nightMode, setNightMode] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('neolinux-settings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          if (settings.theme) setTheme(settings.theme);
          if (settings.accentColor) setAccentColor(settings.accentColor);
          if (settings.fontSize) setFontSize(settings.fontSize);
          if (settings.transparencyEnabled !== undefined) setTransparencyEnabled(settings.transparencyEnabled);
          if (settings.scaling) setScaling(settings.scaling);
          if (settings.nightMode !== undefined) setNightMode(settings.nightMode);
          if (settings.autoUpdate !== undefined) setAutoUpdate(settings.autoUpdate);
          if (settings.notifications !== undefined) setNotifications(settings.notifications);
          if (settings.soundEnabled !== undefined) setSoundEnabled(settings.soundEnabled);
        } catch (e) {
          console.error('Failed to load settings:', e);
        }
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const settings = {
        theme,
        accentColor,
        fontSize,
        transparencyEnabled,
        scaling,
        nightMode,
        autoUpdate,
        notifications,
        soundEnabled,
      };
      localStorage.setItem('neolinux-settings', JSON.stringify(settings));
    }
  }, [theme, accentColor, fontSize, transparencyEnabled, scaling, nightMode, autoUpdate, notifications, soundEnabled]);

  const getAccentColorClass = () => {
    const colorMap: Record<AccentColor, string> = {
      blue: 'accent-blue',
      purple: 'accent-purple',
      pink: 'accent-pink',
      green: 'accent-green',
      orange: 'accent-orange',
      red: 'accent-red',
    };
    return colorMap[accentColor];
  };

  const getFontSizeClass = () => {
    const sizeMap: Record<FontSize, string> = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
      xlarge: 'text-xl',
    };
    return sizeMap[fontSize];
  };

  const getBackdropBlurClass = () => {
    return transparencyEnabled ? 'backdrop-blur-xl' : '';
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        accentColor,
        setAccentColor,
        fontSize,
        setFontSize,
        transparencyEnabled,
        setTransparencyEnabled,
        scaling,
        setScaling,
        nightMode,
        setNightMode,
        autoUpdate,
        setAutoUpdate,
        notifications,
        setNotifications,
        soundEnabled,
        setSoundEnabled,
        getAccentColorClass,
        getFontSizeClass,
        getBackdropBlurClass,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
