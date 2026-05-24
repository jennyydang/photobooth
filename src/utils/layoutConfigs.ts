import { LayoutConfig } from '@/types';

// Canvas dimensions in px at 300 DPI
// 2x6: 600x1800 vertical, 1800x600 horizontal
// 4x6: 1200x1800 vertical, 1800x1200 horizontal

const GAP = 0.01;

export const LAYOUTS: LayoutConfig[] = [
  // ─── 2×6 VERTICAL ────────────────────────────────────────────────────────
  {
    id: 'v2x6-3photos',
    name: '3 Photos + Graphic',
    size: '2x6',
    orientation: 'vertical',
    photoCount: 3,
    description: '3 stacked photos with graphic at bottom',
    canvasWidth: 600,
    canvasHeight: 1800,
    photoSlots: [
      { x: 0, y: 0, width: 1, height: 0.31 },
      { x: 0, y: 0.33, width: 1, height: 0.31 },
      { x: 0, y: 0.66, width: 1, height: 0.21 },
    ],
    graphicSlot: { x: 0, y: 0.89, width: 1, height: 0.11 },
  },
  {
    id: 'v2x6-4photos',
    name: '4 Photos + Small Graphic',
    size: '2x6',
    orientation: 'vertical',
    photoCount: 4,
    description: '4 stacked photos with small graphic at bottom',
    canvasWidth: 600,
    canvasHeight: 1800,
    photoSlots: [
      { x: 0, y: 0, width: 1, height: 0.225 },
      { x: 0, y: 0.235, width: 1, height: 0.225 },
      { x: 0, y: 0.47, width: 1, height: 0.225 },
      { x: 0, y: 0.705, width: 1, height: 0.225 },
    ],
    graphicSlot: { x: 0, y: 0.94, width: 1, height: 0.06 },
  },

  // ─── 2×6 HORIZONTAL ──────────────────────────────────────────────────────
  {
    id: 'h2x6-3photos',
    name: '3 Photos + Graphic Left',
    size: '2x6',
    orientation: 'horizontal',
    photoCount: 3,
    description: '3 side-by-side photos with graphic on left',
    canvasWidth: 1800,
    canvasHeight: 600,
    photoSlots: [
      { x: 0.27, y: 0, width: 0.24, height: 1 },
      { x: 0.52, y: 0, width: 0.24, height: 1 },
      { x: 0.76, y: 0, width: 0.24, height: 1 },
    ],
    graphicSlot: { x: 0, y: 0, width: 0.25, height: 1 },
  },
  {
    id: 'h2x6-4photos',
    name: '4 Photos + Graphic Left',
    size: '2x6',
    orientation: 'horizontal',
    photoCount: 4,
    description: '4 side-by-side photos with graphic on left',
    canvasWidth: 1800,
    canvasHeight: 600,
    photoSlots: [
      { x: 0.21, y: 0, width: 0.19, height: 1 },
      { x: 0.41, y: 0, width: 0.19, height: 1 },
      { x: 0.61, y: 0, width: 0.19, height: 1 },
      { x: 0.81, y: 0, width: 0.19, height: 1 },
    ],
    graphicSlot: { x: 0, y: 0, width: 0.19, height: 1 },
  },

  // ─── 4×6 VERTICAL ────────────────────────────────────────────────────────
  {
    id: 'v4x6-4photos',
    name: '4 Photos + Graphic',
    size: '4x6',
    orientation: 'vertical',
    photoCount: 4,
    description: '2×2 photo grid with graphic at bottom',
    canvasWidth: 1200,
    canvasHeight: 1800,
    photoSlots: [
      { x: 0, y: 0, width: 0.495, height: 0.32 },
      { x: 0.505, y: 0, width: 0.495, height: 0.32 },
      { x: 0, y: 0.33, width: 0.495, height: 0.32 },
      { x: 0.505, y: 0.33, width: 0.495, height: 0.32 },
    ],
    graphicSlot: { x: 0, y: 0.67, width: 1, height: 0.33 },
  },
  {
    id: 'v4x6-1photo',
    name: '1 Photo + Graphic',
    size: '4x6',
    orientation: 'vertical',
    photoCount: 1,
    description: '1 large photo with graphic at bottom',
    canvasWidth: 1200,
    canvasHeight: 1800,
    photoSlots: [{ x: 0, y: 0, width: 1, height: 0.70 }],
    graphicSlot: { x: 0, y: 0.72, width: 1, height: 0.28 },
  },
  {
    id: 'v4x6-2photos',
    name: '2 Photos + Graphic',
    size: '4x6',
    orientation: 'vertical',
    photoCount: 2,
    description: '2 stacked photos with graphic at bottom',
    canvasWidth: 1200,
    canvasHeight: 1800,
    photoSlots: [
      { x: 0, y: 0, width: 1, height: 0.32 },
      { x: 0, y: 0.34, width: 1, height: 0.32 },
    ],
    graphicSlot: { x: 0, y: 0.68, width: 1, height: 0.32 },
  },

  // ─── 4×6 HORIZONTAL ──────────────────────────────────────────────────────
  {
    id: 'h4x6-1photo',
    name: '1 Photo + Graphic',
    size: '4x6',
    orientation: 'horizontal',
    photoCount: 1,
    description: '1 large photo with graphic at bottom',
    canvasWidth: 1800,
    canvasHeight: 1200,
    photoSlots: [{ x: 0, y: 0, width: 1, height: 0.74 }],
    graphicSlot: { x: 0, y: 0.76, width: 1, height: 0.24 },
  },
  {
    id: 'h4x6-4photos',
    name: '4 Photos + Graphic Top-Right',
    size: '4x6',
    orientation: 'horizontal',
    photoCount: 4,
    description: 'Half-width photo top-left, graphic top-right, 3 photos below',
    canvasWidth: 1800,
    canvasHeight: 1200,
    photoSlots: [
      { x: 0, y: 0, width: 0.49, height: 0.49 },
      { x: 0, y: 0.51, width: 0.32, height: 0.49 },
      { x: 0.34, y: 0.51, width: 0.32, height: 0.49 },
      { x: 0.68, y: 0.51, width: 0.32, height: 0.49 },
    ],
    graphicSlot: { x: 0.51, y: 0, width: 0.49, height: 0.49 },
  },
  {
    id: 'h4x6-2photos',
    name: '2 Photos Left + Graphic Right',
    size: '4x6',
    orientation: 'horizontal',
    photoCount: 2,
    description: '2 stacked photos on left, graphic on right',
    canvasWidth: 1800,
    canvasHeight: 1200,
    photoSlots: [
      { x: 0, y: 0, width: 0.49, height: 0.49 },
      { x: 0, y: 0.51, width: 0.49, height: 0.49 },
    ],
    graphicSlot: { x: 0.51, y: 0, width: 0.49, height: 1 },
  },
];

export const getLayoutsBySize = (size: '2x6' | '4x6') =>
  LAYOUTS.filter((l) => l.size === size);

export const getLayoutById = (id: string) =>
  LAYOUTS.find((l) => l.id === id) ?? null;

export const PRINTERS = [
  {
    id: 'dnp-ds-rx1hs',
    name: 'DNP DS-RX1HS',
    description: 'Dye Sublimation — 2×6, 4×6, 4×8 strips',
    dpi: 300,
  },
  {
    id: 'dnp-ds620',
    name: 'DNP DS620',
    description: 'Dye Sublimation — up to 6×8 prints',
    dpi: 300,
  },
  {
    id: 'selphy-cp1500',
    name: 'Canon SELPHY CP1500',
    description: 'Compact photo printer — 4×6 cards',
    dpi: 300,
  },
  {
    id: 'selphy-cp1300',
    name: 'Canon SELPHY CP1300',
    description: 'Compact photo printer — 4×6 cards',
    dpi: 300,
  },
  {
    id: 'home-inkjet',
    name: 'Home Inkjet',
    description: 'Standard inkjet printer',
    dpi: 600,
  },
  {
    id: 'home-laser',
    name: 'Home/Office Laser',
    description: 'Laser printer',
    dpi: 600,
  },
  {
    id: 'generic',
    name: 'System Default',
    description: 'Use OS print dialog to select any printer',
    dpi: 300,
  },
] as const;
