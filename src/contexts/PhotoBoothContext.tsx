'use client';

import React, { createContext, useContext, useReducer } from 'react';
import { AppState, CapturedPhoto, LayoutConfig } from '@/types';

interface PhotoBoothState {
  appState: AppState;
  selectedLayout: LayoutConfig | null;
  capturedPhotos: CapturedPhoto[];
  currentPhotoIndex: number;
  template: string | null;
  gifUrl: string | null;
  compositeImageUrl: string | null;
}

type Action =
  | { type: 'SET_APP_STATE'; payload: AppState }
  | { type: 'SELECT_LAYOUT'; payload: LayoutConfig }
  | { type: 'ADD_PHOTO'; payload: CapturedPhoto }
  | { type: 'SET_CURRENT_PHOTO_INDEX'; payload: number }
  | { type: 'SET_TEMPLATE'; payload: string | null }
  | { type: 'SET_GIF_URL'; payload: string | null }
  | { type: 'SET_COMPOSITE_URL'; payload: string | null }
  | { type: 'RESET' };

const initialState: PhotoBoothState = {
  appState: 'welcome',
  selectedLayout: null,
  capturedPhotos: [],
  currentPhotoIndex: 0,
  template: null,
  gifUrl: null,
  compositeImageUrl: null,
};

function reducer(state: PhotoBoothState, action: Action): PhotoBoothState {
  switch (action.type) {
    case 'SET_APP_STATE':
      return { ...state, appState: action.payload };
    case 'SELECT_LAYOUT':
      return { ...state, selectedLayout: action.payload };
    case 'ADD_PHOTO':
      return { ...state, capturedPhotos: [...state.capturedPhotos, action.payload] };
    case 'SET_CURRENT_PHOTO_INDEX':
      return { ...state, currentPhotoIndex: action.payload };
    case 'SET_TEMPLATE':
      return { ...state, template: action.payload };
    case 'SET_GIF_URL':
      return { ...state, gifUrl: action.payload };
    case 'SET_COMPOSITE_URL':
      return { ...state, compositeImageUrl: action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

interface PhotoBoothContextType extends PhotoBoothState {
  setAppState: (state: AppState) => void;
  selectLayout: (layout: LayoutConfig) => void;
  addPhoto: (photo: CapturedPhoto) => void;
  setCurrentPhotoIndex: (index: number) => void;
  setTemplate: (template: string | null) => void;
  setGifUrl: (url: string | null) => void;
  setCompositeImageUrl: (url: string | null) => void;
  resetSession: () => void;
}

const PhotoBoothContext = createContext<PhotoBoothContextType>(
  {} as PhotoBoothContextType
);

export function PhotoBoothProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const ctx: PhotoBoothContextType = {
    ...state,
    setAppState: (s) => dispatch({ type: 'SET_APP_STATE', payload: s }),
    selectLayout: (l) => dispatch({ type: 'SELECT_LAYOUT', payload: l }),
    addPhoto: (p) => dispatch({ type: 'ADD_PHOTO', payload: p }),
    setCurrentPhotoIndex: (i) =>
      dispatch({ type: 'SET_CURRENT_PHOTO_INDEX', payload: i }),
    setTemplate: (t) => dispatch({ type: 'SET_TEMPLATE', payload: t }),
    setGifUrl: (u) => dispatch({ type: 'SET_GIF_URL', payload: u }),
    setCompositeImageUrl: (u) =>
      dispatch({ type: 'SET_COMPOSITE_URL', payload: u }),
    resetSession: () => dispatch({ type: 'RESET' }),
  };

  return (
    <PhotoBoothContext.Provider value={ctx}>
      {children}
    </PhotoBoothContext.Provider>
  );
}

export const usePhotoBooth = () => useContext(PhotoBoothContext);
