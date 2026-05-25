'use client';

import { LayoutConfig } from '@/types';

interface LayoutPreviewProps {
  layout: LayoutConfig;
}

// Normalize preview so all layouts fit in a consistent bounding box
const MAX_SIZE = 80;

export function LayoutPreview({ layout }: LayoutPreviewProps) {
  const { canvasWidth, canvasHeight, photoSlots, graphicSlot } = layout;

  const scale = Math.min(MAX_SIZE / canvasWidth, MAX_SIZE / canvasHeight);
  const w = Math.round(canvasWidth * scale);
  const h = Math.round(canvasHeight * scale);

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
      style={{ display: 'block', maxWidth: '100%' }}
      aria-label={layout.name}
    >
      {/* Background */}
      <rect width={canvasWidth} height={canvasHeight} fill="#111111" rx={6} />

      {/* Photo slots */}
      {photoSlots.map((slot, i) => (
        <g key={i}>
          <rect
            x={slot.x * canvasWidth}
            y={slot.y * canvasHeight}
            width={slot.width * canvasWidth}
            height={slot.height * canvasHeight}
            fill="#3a3a5a"
            rx={3}
          />
          <text
            x={(slot.x + slot.width / 2) * canvasWidth}
            y={(slot.y + slot.height / 2) * canvasHeight}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.25)"
            fontSize={Math.min(slot.width * canvasWidth, slot.height * canvasHeight) * 0.28}
          >
            📷
          </text>
        </g>
      ))}

      {/* Graphic / design slot */}
      <defs>
        <linearGradient id={`g-${layout.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e91e8c" />
          <stop offset="100%" stopColor="#9c27b0" />
        </linearGradient>
      </defs>
      <rect
        x={graphicSlot.x * canvasWidth}
        y={graphicSlot.y * canvasHeight}
        width={graphicSlot.width * canvasWidth}
        height={graphicSlot.height * canvasHeight}
        fill={`url(#g-${layout.id})`}
        rx={3}
      />
    </svg>
  );
}
