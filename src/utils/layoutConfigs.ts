import { LayoutConfig } from '@/types';

// Canvas dimensions at 300 DPI
// 2×6 vertical  : 600 × 1800
// 4×6 portrait  : 1200 × 1800
// 4×6 landscape : 1800 × 1200

export const LAYOUTS: LayoutConfig[] = [
  // ── 1: 2×6 · 3 PHOTO ─────────────────────────────────────────────────────
  // 3 stacked equal photos, graphic bar ~17% at bottom
  {
    id: 'v2x6-3photos',
    number: 1,
    name: '2×6 · 3 Photo',
    size: '2x6',
    orientation: 'vertical',
    photoCount: 3,
    description: '3 stacked photos with graphic at bottom',
    canvasWidth: 600,
    canvasHeight: 1800,
    photoSlots: [
      { x: 0, y: 0,     width: 1, height: 0.265 },
      { x: 0, y: 0.275, width: 1, height: 0.265 },
      { x: 0, y: 0.550, width: 1, height: 0.265 },
    ],
    graphicSlot: { x: 0, y: 0.825, width: 1, height: 0.175 },
  },

  // ── 2: 2×6 · 4 PHOTO ─────────────────────────────────────────────────────
  {
    id: 'v2x6-4photos',
    number: 2,
    name: '2×6 · 4 Photo',
    size: '2x6',
    orientation: 'vertical',
    photoCount: 4,
    description: '4 stacked photos with graphic at bottom',
    canvasWidth: 600,
    canvasHeight: 1800,
    photoSlots: [
      { x: 0, y: 0,     width: 1, height: 0.205 },
      { x: 0, y: 0.215, width: 1, height: 0.205 },
      { x: 0, y: 0.430, width: 1, height: 0.205 },
      { x: 0, y: 0.645, width: 1, height: 0.205 },
    ],
    graphicSlot: { x: 0, y: 0.860, width: 1, height: 0.140 },
  },

  // ── 3: 4×6 PORTRAIT · 6 PHOTO ────────────────────────────────────────────
  // 2 cols × 3 rows, graphic bar at bottom
  {
    id: 'v4x6-6photos',
    number: 3,
    name: '4×6 · 6 Photo',
    size: '4x6',
    orientation: 'vertical',
    photoCount: 6,
    description: '2×3 grid of photos with graphic at bottom',
    canvasWidth: 1200,
    canvasHeight: 1800,
    photoSlots: [
      { x: 0,     y: 0,     width: 0.495, height: 0.260 },
      { x: 0.505, y: 0,     width: 0.495, height: 0.260 },
      { x: 0,     y: 0.270, width: 0.495, height: 0.260 },
      { x: 0.505, y: 0.270, width: 0.495, height: 0.260 },
      { x: 0,     y: 0.540, width: 0.495, height: 0.260 },
      { x: 0.505, y: 0.540, width: 0.495, height: 0.260 },
    ],
    graphicSlot: { x: 0, y: 0.810, width: 1, height: 0.190 },
  },

  // ── 4: 4×6 PORTRAIT · 1 PHOTO ────────────────────────────────────────────
  {
    id: 'v4x6-1photo',
    number: 4,
    name: '4×6 Portrait · 1 Photo',
    size: '4x6',
    orientation: 'vertical',
    photoCount: 1,
    description: '1 large portrait photo with graphic at bottom',
    canvasWidth: 1200,
    canvasHeight: 1800,
    photoSlots: [{ x: 0, y: 0, width: 1, height: 0.72 }],
    graphicSlot: { x: 0, y: 0.74, width: 1, height: 0.26 },
  },

  // ── 5: 4×6 LANDSCAPE · 1 PHOTO ───────────────────────────────────────────
  {
    id: 'h4x6-1photo',
    number: 5,
    name: '4×6 Landscape · 1 Photo',
    size: '4x6',
    orientation: 'horizontal',
    photoCount: 1,
    description: '1 large landscape photo with graphic at bottom',
    canvasWidth: 1800,
    canvasHeight: 1200,
    photoSlots: [{ x: 0, y: 0, width: 1, height: 0.74 }],
    graphicSlot: { x: 0, y: 0.76, width: 1, height: 0.24 },
  },

  // ── 6: 4×6 LANDSCAPE · 3 PHOTO (row) ─────────────────────────────────────
  {
    id: 'h4x6-3photos-row',
    number: 6,
    name: '4×6 Landscape · 3 Photo',
    size: '4x6',
    orientation: 'horizontal',
    photoCount: 3,
    description: '3 side-by-side photos with graphic at bottom',
    canvasWidth: 1800,
    canvasHeight: 1200,
    photoSlots: [
      { x: 0,     y: 0, width: 0.327, height: 0.75 },
      { x: 0.337, y: 0, width: 0.326, height: 0.75 },
      { x: 0.674, y: 0, width: 0.326, height: 0.75 },
    ],
    graphicSlot: { x: 0, y: 0.77, width: 1, height: 0.23 },
  },

  // ── 7: 4×6 LANDSCAPE · 3 PHOTO (1 left + 2 stacked right) ───────────────
  {
    id: 'h4x6-3photos-1L2R',
    number: 7,
    name: '4×6 Landscape · 3 Photo',
    size: '4x6',
    orientation: 'horizontal',
    photoCount: 3,
    description: '1 large left photo, 2 stacked right, graphic at bottom',
    canvasWidth: 1800,
    canvasHeight: 1200,
    photoSlots: [
      { x: 0,    y: 0,    width: 0.49, height: 0.76 },
      { x: 0.51, y: 0,    width: 0.49, height: 0.37 },
      { x: 0.51, y: 0.39, width: 0.49, height: 0.37 },
    ],
    graphicSlot: { x: 0, y: 0.78, width: 1, height: 0.22 },
  },

  // ── 8: 4×6 LANDSCAPE · 3 PHOTO (asymmetric grid) ─────────────────────────
  // Top-left large, top-right small, bottom-left small, bottom-right = graphic
  {
    id: 'h4x6-3photos-asymgrid',
    number: 8,
    name: '4×6 Landscape · 3 Photo',
    size: '4x6',
    orientation: 'horizontal',
    photoCount: 3,
    description: 'Asymmetric grid — graphic in bottom-right',
    canvasWidth: 1800,
    canvasHeight: 1200,
    photoSlots: [
      { x: 0,    y: 0,    width: 0.58, height: 0.49 },
      { x: 0.60, y: 0,    width: 0.40, height: 0.49 },
      { x: 0,    y: 0.51, width: 0.40, height: 0.49 },
    ],
    graphicSlot: { x: 0.42, y: 0.51, width: 0.58, height: 0.49 },
  },

  // ── 9: 4×6 LANDSCAPE · 4 PHOTO (T-shape) ─────────────────────────────────
  // Top-left photo, top-right graphic, 3 photos across bottom
  {
    id: 'h4x6-4photos-T',
    number: 9,
    name: '4×6 Landscape · 4 Photo',
    size: '4x6',
    orientation: 'horizontal',
    photoCount: 4,
    description: '1 photo top-left, graphic top-right, 3 photos across bottom',
    canvasWidth: 1800,
    canvasHeight: 1200,
    photoSlots: [
      { x: 0,    y: 0,    width: 0.49, height: 0.49 },
      { x: 0,    y: 0.51, width: 0.32, height: 0.49 },
      { x: 0.34, y: 0.51, width: 0.32, height: 0.49 },
      { x: 0.68, y: 0.51, width: 0.32, height: 0.49 },
    ],
    graphicSlot: { x: 0.51, y: 0, width: 0.49, height: 0.49 },
  },

  // ── 10: 4×6 LANDSCAPE · 2 PHOTO (left stack + graphic right) ─────────────
  {
    id: 'h4x6-2photos-left',
    number: 10,
    name: '4×6 Landscape · 2 Photo',
    size: '4x6',
    orientation: 'horizontal',
    photoCount: 2,
    description: '2 photos stacked on left, graphic on right',
    canvasWidth: 1800,
    canvasHeight: 1200,
    photoSlots: [
      { x: 0, y: 0,    width: 0.49, height: 0.49 },
      { x: 0, y: 0.51, width: 0.49, height: 0.49 },
    ],
    graphicSlot: { x: 0.51, y: 0, width: 0.49, height: 1 },
  },

  // ── 11: 4×6 LANDSCAPE · 2 PHOTO (side-by-side + graphic bottom) ──────────
  {
    id: 'h4x6-2photos-row',
    number: 11,
    name: '4×6 Landscape · 2 Photo',
    size: '4x6',
    orientation: 'horizontal',
    photoCount: 2,
    description: '2 side-by-side photos with graphic at bottom',
    canvasWidth: 1800,
    canvasHeight: 1200,
    photoSlots: [
      { x: 0,    y: 0, width: 0.49, height: 0.76 },
      { x: 0.51, y: 0, width: 0.49, height: 0.76 },
    ],
    graphicSlot: { x: 0, y: 0.78, width: 1, height: 0.22 },
  },
];

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
