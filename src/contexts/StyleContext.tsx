'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StyleMode, ThemeMode } from '@/types';

interface StyleContextType {
  styleMode: StyleMode;
  toggleStyleMode: () => void;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  cls: (bemClass: string, twClass: string) => string;
}

const StyleContext = createContext<StyleContextType>({
  styleMode: 'bem',
  toggleStyleMode: () => {},
  themeMode: 'light',
  toggleTheme: () => {},
  cls: (bemClass) => bemClass,
});

export function StyleProvider({ children }: { children: React.ReactNode }) {
  const [styleMode, setStyleMode] = useState<StyleMode>('bem');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [themeMode]);

  const toggleStyleMode = () =>
    setStyleMode((prev) => (prev === 'bem' ? 'tailwind' : 'bem'));

  const toggleTheme = () =>
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const cls = (bemClass: string, twClass: string) =>
    styleMode === 'bem' ? bemClass : twClass;

  return (
    <StyleContext.Provider value={{ styleMode, toggleStyleMode, themeMode, toggleTheme, cls }}>
      {children}
    </StyleContext.Provider>
  );
}

export const useStyle = () => useContext(StyleContext);
