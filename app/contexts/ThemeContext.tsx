'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'dark' | 'light' | 'auto';
export type AccentColor = 'blue' | 'purple' | 'pink' | 'green' | 'orange' | 'red';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
export type BackgroundType = 'gradient' | 'image';

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
  backgroundType: BackgroundType;
  setBackgroundType: (type: BackgroundType) => void;
  backgroundImage: string;
  setBackgroundImage: (url: string) => void;
  
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
  getBackgroundGradient: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [accentColor, setAccentColor] = useState<AccentColor>('blue');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [transparencyEnabled, setTransparencyEnabled] = useState(true);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('gradient');
  const [backgroundImage, setBackgroundImage] = useState('');
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
          if (settings.backgroundType) setBackgroundType(settings.backgroundType);
          if (settings.backgroundImage) setBackgroundImage(settings.backgroundImage);
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
        backgroundType,
        backgroundImage,
        scaling,
        nightMode,
        autoUpdate,
        notifications,
        soundEnabled,
      };
      localStorage.setItem('neolinux-settings', JSON.stringify(settings));
    }
  }, [theme, accentColor, fontSize, transparencyEnabled, backgroundType, backgroundImage, scaling, nightMode, autoUpdate, notifications, soundEnabled]);

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

  const getBackgroundGradient = () => {
    if (theme === 'light') {
      return 'from-blue-100 via-purple-100 to-pink-100';
    }
    const accentGradients: Record<AccentColor, string> = {
      blue: 'from-blue-900 via-indigo-900 to-purple-900',
      purple: 'from-purple-900 via-violet-900 to-fuchsia-900',
      pink: 'from-pink-900 via-rose-900 to-red-900',
      green: 'from-green-900 via-emerald-900 to-teal-900',
      orange: 'from-orange-900 via-amber-900 to-yellow-900',
      red: 'from-red-900 via-rose-900 to-pink-900',
    };
    return accentGradients[accentColor] || 'from-purple-900 via-blue-900 to-indigo-900';
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
        backgroundType,
        setBackgroundType,
        backgroundImage,
        setBackgroundImage,
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
        getBackgroundGradient,
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
