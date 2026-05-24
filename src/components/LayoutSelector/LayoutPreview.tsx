'use client';

import { LayoutConfig } from '@/types';

interface LayoutPreviewProps {
  layout: LayoutConfig;
}

const PREVIEW_W = 90;
const PREVIEW_H = 120;

export function LayoutPreview({ layout }: LayoutPreviewProps) {
  const { canvasWidth, canvasHeight, photoSlots, graphicSlot, orientation } = layout;

  const scaleX = PREVIEW_W / canvasWidth;
  const scaleY = PREVIEW_H / canvasHeight;
  const scale = Math.min(scaleX, scaleY);

  const w = canvasWidth * scale;
  const h = canvasHeight * scale;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
      style={{ display: 'block' }}
    >
      <rect width={canvasWidth} height={canvasHeight} fill="#1a1a2e" rx={8} />
      {photoSlots.map((slot, i) => (
        <rect
          key={i}
          x={slot.x * canvasWidth}
          y={slot.y * canvasHeight}
          width={slot.width * canvasWidth}
          height={slot.height * canvasHeight}
          fill="#4a4a6a"
          rx={4}
        />
      ))}
      <rect
        x={graphicSlot.x * canvasWidth}
        y={graphicSlot.y * canvasHeight}
        width={graphicSlot.width * canvasWidth}
        height={graphicSlot.height * canvasHeight}
        fill="url(#grad)"
        rx={4}
      />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e91e8c" />
          <stop offset="100%" stopColor="#9c27b0" />
        </linearGradient>
      </defs>
      {photoSlots.map((slot, i) => (
        <text
          key={`t-${i}`}
          x={(slot.x + slot.width / 2) * canvasWidth}
          y={(slot.y + slot.height / 2) * canvasHeight}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.3)"
          fontSize={Math.min(slot.width * canvasWidth, slot.height * canvasHeight) * 0.3}
        >
          📷
        </text>
      ))}
    </svg>
  );
}
