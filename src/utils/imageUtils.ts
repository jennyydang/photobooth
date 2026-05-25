import { DesignConfig, LayoutConfig } from '@/types';
import { drawDesignToContext } from './designUtils';

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function drawCoverFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const scale = Math.max(dw / img.width, dh / img.height);
  const sw = dw / scale;
  const sh = dh / scale;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

async function drawGraphicSlot(
  ctx: CanvasRenderingContext2D,
  design: DesignConfig | null,
  gx: number, gy: number, gw: number, gh: number
) {
  if (!design) {
    drawFallbackGraphic(ctx, gx, gy, gw, gh);
    return;
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(gx, gy, gw, gh);
  ctx.clip();

  if (design.isCustom && design.customDataUrl) {
    try {
      const img = await loadImage(design.customDataUrl);
      drawCoverFit(ctx, img, gx, gy, gw, gh);
    } catch {
      drawDesignToContext(ctx, 'classic', gx, gy, gw, gh);
    }
  } else {
    drawDesignToContext(ctx, design.id, gx, gy, gw, gh);
  }

  ctx.restore();
}

export async function composeStrip(
  layout: LayoutConfig,
  photosDataUrls: string[],
  design: DesignConfig | null,
  scale = 1
): Promise<string> {
  const w = layout.canvasWidth * scale;
  const h = layout.canvasHeight * scale;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Fill whole canvas black (gaps between slots show as black border)
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, w, h);

  // Draw photos
  for (let i = 0; i < layout.photoSlots.length; i++) {
    const slot = layout.photoSlots[i];
    const photoUrl = photosDataUrls[i];
    if (!photoUrl) continue;

    const img = await loadImage(photoUrl);
    const dx = slot.x * w;
    const dy = slot.y * h;
    const dw = slot.width * w;
    const dh = slot.height * h;

    ctx.save();
    ctx.beginPath();
    ctx.rect(dx, dy, dw, dh);
    ctx.clip();
    drawCoverFit(ctx, img, dx, dy, dw, dh);
    ctx.restore();
  }

  // Draw graphic / design slot
  const g = layout.graphicSlot;
  await drawGraphicSlot(ctx, design, g.x * w, g.y * h, g.width * w, g.height * h);

  return canvas.toDataURL('image/png');
}

function drawFallbackGraphic(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
) {
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#e91e8c');
  grad.addColorStop(0.5, '#9c27b0');
  grad.addColorStop(1, '#3f51b5');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fontSize = Math.min(w * 0.08, h * 0.4, 40);
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillText('✨ Photo Booth ✨', x + w / 2, y + h / 2);
  ctx.restore();
}

/**
 * Compose a single GIF frame: camera frame fills all photo slots as full-bleed
 * background, design renders in the graphic slot.
 */
export async function composeGifFrame(
  layout: LayoutConfig,
  frameDataUrl: string,
  design: DesignConfig | null,
  outputW: number,
  outputH: number
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = outputW;
  canvas.height = outputH;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, outputW, outputH);

  // Scale factors from layout canvas to output
  const sx = outputW / layout.canvasWidth;
  const sy = outputH / layout.canvasHeight;

  // Draw the live camera frame into each photo slot
  const img = await loadImage(frameDataUrl);
  for (const slot of layout.photoSlots) {
    const dx = slot.x * layout.canvasWidth * sx;
    const dy = slot.y * layout.canvasHeight * sy;
    const dw = slot.width * layout.canvasWidth * sx;
    const dh = slot.height * layout.canvasHeight * sy;

    ctx.save();
    ctx.beginPath();
    ctx.rect(dx, dy, dw, dh);
    ctx.clip();
    drawCoverFit(ctx, img, dx, dy, dw, dh);
    ctx.restore();
  }

  // Draw design in graphic slot
  const g = layout.graphicSlot;
  await drawGraphicSlot(
    ctx, design,
    g.x * layout.canvasWidth * sx,
    g.y * layout.canvasHeight * sy,
    g.width * layout.canvasWidth * sx,
    g.height * layout.canvasHeight * sy
  );

  return canvas.toDataURL('image/jpeg', 0.82);
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export async function captureVideoFrame(
  video: HTMLVideoElement,
  mirror = true
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d')!;

  if (mirror) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.85);
}
