export type PrintSize = '2x6' | '4x6';
export type Orientation = 'vertical' | 'horizontal';
export type StyleMode = 'bem' | 'tailwind';
export type AppState =
  | 'welcome'
  | 'layout-select'
  | 'capturing'
  | 'review'
  | 'share'
  | 'print';

export interface PhotoSlot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GraphicSlot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutConfig {
  id: string;
  name: string;
  size: PrintSize;
  orientation: Orientation;
  photoCount: number;
  description: string;
  canvasWidth: number;
  canvasHeight: number;
  photoSlots: PhotoSlot[];
  graphicSlot: GraphicSlot;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
}

export type PrinterType =
  | 'dnp-ds-rx1hs'
  | 'dnp-ds620'
  | 'selphy-cp1500'
  | 'selphy-cp1300'
  | 'home-inkjet'
  | 'home-laser'
  | 'generic';

export interface PrinterConfig {
  id: PrinterType;
  name: string;
  description: string;
  dpi: number;
}
