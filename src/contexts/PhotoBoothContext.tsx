'use client';

import React, { createContext, useContext, useReducer } from 'react';
import { AppState, CapturedPhoto, DesignConfig, LayoutConfig } from '@/types';

interface PhotoBoothState {
  appState: AppState;
  selectedLayout: LayoutConfig | null;
  selectedDesign: DesignConfig | null;
  capturedPhotos: CapturedPhoto[];
  currentPhotoIndex: number;
  preparationFrames: string[];
  template: string | null;
  gifUrl: string | null;
  compositeImageUrl: string | null;
}

type Action =
  | { type: 'SET_APP_STATE'; payload: AppState }
  | { type: 'SELECT_LAYOUT'; payload: LayoutConfig }
  | { type: 'SELECT_DESIGN'; payload: DesignConfig }
  | { type: 'ADD_PHOTO'; payload: CapturedPhoto }
  | { type: 'SET_CURRENT_PHOTO_INDEX'; payload: number }
  | { type: 'ADD_PREP_FRAME'; payload: string }
  | { type: 'SET_TEMPLATE'; payload: string | null }
  | { type: 'SET_GIF_URL'; payload: string | null }
  | { type: 'SET_COMPOSITE_URL'; payload: string | null }
  | { type: 'RESET' };

const initialState: PhotoBoothState = {
  appState: 'welcome',
  selectedLayout: null,
  selectedDesign: null,
  capturedPhotos: [],
  currentPhotoIndex: 0,
  preparationFrames: [],
  template: null,
  gifUrl: null,
  compositeImageUrl: null,
};

function reducer(state: PhotoBoothState, action: Action): PhotoBoothState {
  switch (action.type) {
    case 'SET_APP_STATE':
      return { ...state, appState: action.payload };
    case 'SELECT_LAYOUT':
      return { ...state, selectedLayout: action.payload, capturedPhotos: [], currentPhotoIndex: 0, preparationFrames: [] };
    case 'SELECT_DESIGN':
      return { ...state, selectedDesign: action.payload };
    case 'ADD_PHOTO':
      return { ...state, capturedPhotos: [...state.capturedPhotos, action.payload] };
    case 'SET_CURRENT_PHOTO_INDEX':
      return { ...state, currentPhotoIndex: action.payload };
    case 'ADD_PREP_FRAME':
      return { ...state, preparationFrames: [...state.preparationFrames, action.payload] };
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
  selectDesign: (design: DesignConfig) => void;
  addPhoto: (photo: CapturedPhoto) => void;
  setCurrentPhotoIndex: (index: number) => void;
  addPreparationFrame: (dataUrl: string) => void;
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
    selectDesign: (d) => dispatch({ type: 'SELECT_DESIGN', payload: d }),
    addPhoto: (p) => dispatch({ type: 'ADD_PHOTO', payload: p }),
    setCurrentPhotoIndex: (i) => dispatch({ type: 'SET_CURRENT_PHOTO_INDEX', payload: i }),
    addPreparationFrame: (f) => dispatch({ type: 'ADD_PREP_FRAME', payload: f }),
    setTemplate: (t) => dispatch({ type: 'SET_TEMPLATE', payload: t }),
    setGifUrl: (u) => dispatch({ type: 'SET_GIF_URL', payload: u }),
    setCompositeImageUrl: (u) => dispatch({ type: 'SET_COMPOSITE_URL', payload: u }),
    resetSession: () => dispatch({ type: 'RESET' }),
  };

  return (
    <PhotoBoothContext.Provider value={ctx}>
      {children}
    </PhotoBoothContext.Provider>
  );
}

export const usePhotoBooth = () => useContext(PhotoBoothContext);
