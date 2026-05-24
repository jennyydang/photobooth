'use client';

import React, { createContext, useContext, useState } from 'react';
import { StyleMode } from '@/types';

interface StyleContextType {
  styleMode: StyleMode;
  toggleStyleMode: () => void;
  cls: (bemClass: string, twClass: string) => string;
}

const StyleContext = createContext<StyleContextType>({
  styleMode: 'bem',
  toggleStyleMode: () => {},
  cls: (bemClass) => bemClass,
});

export function StyleProvider({ children }: { children: React.ReactNode }) {
  const [styleMode, setStyleMode] = useState<StyleMode>('bem');

  const toggleStyleMode = () =>
    setStyleMode((prev) => (prev === 'bem' ? 'tailwind' : 'bem'));

  const cls = (bemClass: string, twClass: string) =>
    styleMode === 'bem' ? bemClass : twClass;

  return (
    <StyleContext.Provider value={{ styleMode, toggleStyleMode, cls }}>
      {children}
    </StyleContext.Provider>
  );
}

export const useStyle = () => useContext(StyleContext);
