import { DesignConfig } from '@/types';

export const DEFAULT_DESIGNS: DesignConfig[] = [
  {
    id: 'classic',
    name: 'Classic Night',
    description: 'Deep indigo gradient with elegant gold accents',
    colors: ['#0f0c29', '#302b63', '#24243e'],
  },
  {
    id: 'bloom',
    name: 'Bloom',
    description: 'Soft blush floral with rose gold tones',
    colors: ['#f8cdda', '#e8a598', '#c76b6b'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean white with sharp geometric accents',
    colors: ['#ffffff', '#f0f0f0', '#1a1a1a'],
  },
];

export function drawDesignToContext(
  ctx: CanvasRenderingContext2D,
  designId: string,
  x: number,
  y: number,
  w: number,
  h: number
) {
  switch (designId) {
    case 'classic':
      drawClassic(ctx, x, y, w, h);
      break;
    case 'bloom':
      drawBloom(ctx, x, y, w, h);
      break;
    case 'minimal':
      drawMinimal(ctx, x, y, w, h);
      break;
    default:
      drawClassic(ctx, x, y, w, h);
  }
}

function drawClassic(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
) {
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#0f0c29');
  grad.addColorStop(0.5, '#302b63');
  grad.addColorStop(1, '#24243e');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  // Sparkle dots
  ctx.save();
  const dotCount = Math.floor((w * h) / 4000);
  for (let i = 0; i < dotCount; i++) {
    const dx = x + Math.random() * w;
    const dy = y + Math.random() * h;
    const r = Math.random() * 2 + 0.5;
    ctx.beginPath();
    ctx.arc(dx, dy, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,220,100,${Math.random() * 0.7 + 0.2})`;
    ctx.fill();
  }

  // Decorative arc lines
  const cx = x + w / 2;
  const cy = y + h * 0.35;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, (w * 0.45) + i * (w * 0.06), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(218,165,32,${0.15 - i * 0.04})`;
    ctx.lineWidth = Math.max(1, w * 0.008);
    ctx.stroke();
  }

  // Text
  const fontSize = Math.min(w * 0.09, h * 0.28, 56);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `italic ${fontSize}px Georgia, serif`;
  ctx.fillStyle = 'rgba(218,165,32,0.95)';
  ctx.fillText('Photo Booth', x + w / 2, y + h * 0.55);
  const subSize = fontSize * 0.42;
  ctx.font = `${subSize}px Georgia, serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillText('✦  memories forever  ✦', x + w / 2, y + h * 0.72);
  ctx.restore();
}

function drawBloom(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
) {
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#fce4ec');
  grad.addColorStop(0.5, '#f8cdda');
  grad.addColorStop(1, '#f48fb1');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  // Floral circles
  ctx.save();
  const petalColors = ['rgba(229,115,115,0.18)', 'rgba(240,98,146,0.15)', 'rgba(206,147,216,0.2)'];
  const circles = [
    { ox: 0.15, oy: 0.2, r: 0.38 },
    { ox: 0.85, oy: 0.75, r: 0.32 },
    { ox: 0.5,  oy: 0.5,  r: 0.24 },
    { ox: 0.1,  oy: 0.85, r: 0.20 },
    { ox: 0.9,  oy: 0.15, r: 0.18 },
  ];
  circles.forEach(({ ox, oy, r }, i) => {
    ctx.beginPath();
    ctx.arc(x + ox * w, y + oy * h, r * Math.min(w, h), 0, Math.PI * 2);
    ctx.fillStyle = petalColors[i % petalColors.length];
    ctx.fill();
  });

  // Text
  const fontSize = Math.min(w * 0.1, h * 0.30, 60);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold italic ${fontSize}px Georgia, serif`;
  ctx.fillStyle = 'rgba(136,14,79,0.85)';
  ctx.fillText('Photo Booth', x + w / 2, y + h * 0.52);
  const subSize = fontSize * 0.38;
  ctx.font = `${subSize}px Georgia, serif`;
  ctx.fillStyle = 'rgba(136,14,79,0.5)';
  ctx.fillText('✿  you look gorgeous  ✿', x + w / 2, y + h * 0.72);
  ctx.restore();
}

function drawMinimal(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
) {
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(x, y, w, h);

  // Thin border inside
  const inset = Math.max(4, Math.min(w, h) * 0.04);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = Math.max(1, Math.min(w, h) * 0.008);
  ctx.strokeRect(x + inset, y + inset, w - inset * 2, h - inset * 2);

  // Corner accents
  const accentLen = Math.min(w, h) * 0.15;
  const lw = Math.max(2, Math.min(w, h) * 0.015);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = lw;

  const corners = [
    [x + inset, y + inset],
    [x + w - inset, y + inset],
    [x + inset, y + h - inset],
    [x + w - inset, y + h - inset],
  ];
  const dirs = [[1,1],[-1,1],[1,-1],[-1,-1]];
  corners.forEach(([cx, cy], i) => {
    const [dx, dy] = dirs[i];
    ctx.beginPath();
    ctx.moveTo(cx + dx * accentLen, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy * accentLen);
    ctx.stroke();
  });

  // Text
  const fontSize = Math.min(w * 0.09, h * 0.28, 54);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = '#1a1a1a';
  ctx.fillText('PHOTO BOOTH', x + w / 2, y + h * 0.5);
  const subSize = fontSize * 0.35;
  ctx.font = `400 ${subSize}px Arial, sans-serif`;
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.letterSpacing = '0.2em';
  ctx.fillText('SMILE • CAPTURE • REMEMBER', x + w / 2, y + h * 0.7);
  ctx.restore();
}

export async function renderDesignPreview(
  design: DesignConfig,
  w: number,
  h: number
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  if (design.isCustom && design.customDataUrl) {
    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, w, h);
        resolve();
      };
      img.onerror = reject;
      img.src = design.customDataUrl!;
    });
  } else {
    drawDesignToContext(ctx, design.id, 0, 0, w, h);
  }

  return canvas.toDataURL('image/png');
}
