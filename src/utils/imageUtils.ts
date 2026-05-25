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

function drawPlaceholderSlot(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
) {
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(x, y, w, h);
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = `${Math.min(w, h) * 0.3}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📷', x + w / 2, y + h / 2);
  ctx.restore();
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

  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, w, h);

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

  const sx = outputW / layout.canvasWidth;
  const sy = outputH / layout.canvasHeight;

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

/**
 * Compose a single getting-ready frame for pose `poseIndex`.
 * Slots 0..poseIndex-1 show already-captured photos.
 * Slot poseIndex shows the live camera frame.
 * Slots poseIndex+1..N-1 show a dark placeholder.
 */
export async function composePoseFrame(
  layout: LayoutConfig,
  poseIndex: number,
  liveFrame: string,
  capturedPhotoUrls: string[],
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

  const sx = outputW / layout.canvasWidth;
  const sy = outputH / layout.canvasHeight;

  const liveImg = await loadImage(liveFrame);

  for (let i = 0; i < layout.photoSlots.length; i++) {
    const slot = layout.photoSlots[i];
    const dx = slot.x * layout.canvasWidth * sx;
    const dy = slot.y * layout.canvasHeight * sy;
    const dw = slot.width * layout.canvasWidth * sx;
    const dh = slot.height * layout.canvasHeight * sy;

    if (i < poseIndex && capturedPhotoUrls[i]) {
      // Already captured
      const img = await loadImage(capturedPhotoUrls[i]);
      ctx.save();
      ctx.beginPath();
      ctx.rect(dx, dy, dw, dh);
      ctx.clip();
      drawCoverFit(ctx, img, dx, dy, dw, dh);
      ctx.restore();
    } else if (i === poseIndex) {
      // Live frame
      ctx.save();
      ctx.beginPath();
      ctx.rect(dx, dy, dw, dh);
      ctx.clip();
      drawCoverFit(ctx, liveImg, dx, dy, dw, dh);
      ctx.restore();
    } else {
      // Upcoming slot — placeholder
      drawPlaceholderSlot(ctx, dx, dy, dw, dh);
    }
  }

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

/**
 * Generate a PNG template for a layout — blank slots outlined on white,
 * suitable for editing in Canva or Photoshop.
 */
export async function generateLayoutTemplate(layout: LayoutConfig): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = layout.canvasWidth;
  canvas.height = layout.canvasHeight;
  const ctx = canvas.getContext('2d')!;

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, layout.canvasWidth, layout.canvasHeight);

  // Photo slot outlines
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 3;
  ctx.fillStyle = '#f5f5f5';

  for (let i = 0; i < layout.photoSlots.length; i++) {
    const slot = layout.photoSlots[i];
    const dx = slot.x * layout.canvasWidth;
    const dy = slot.y * layout.canvasHeight;
    const dw = slot.width * layout.canvasWidth;
    const dh = slot.height * layout.canvasHeight;

    ctx.fillRect(dx, dy, dw, dh);
    ctx.strokeRect(dx, dy, dw, dh);

    // Slot label
    ctx.save();
    ctx.fillStyle = '#aaaaaa';
    ctx.font = `bold ${Math.min(dw, dh) * 0.12}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Photo ${i + 1}`, dx + dw / 2, dy + dh / 2);
    ctx.restore();
  }

  // Graphic slot — pink gradient indicator
  const g = layout.graphicSlot;
  const gx = g.x * layout.canvasWidth;
  const gy = g.y * layout.canvasHeight;
  const gw = g.width * layout.canvasWidth;
  const gh = g.height * layout.canvasHeight;

  const grad = ctx.createLinearGradient(gx, gy, gx + gw, gy + gh);
  grad.addColorStop(0, 'rgba(233,30,140,0.15)');
  grad.addColorStop(1, 'rgba(156,39,176,0.15)');
  ctx.fillStyle = grad;
  ctx.fillRect(gx, gy, gw, gh);

  ctx.strokeStyle = 'rgba(233,30,140,0.4)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 4]);
  ctx.strokeRect(gx, gy, gw, gh);
  ctx.setLineDash([]);

  ctx.save();
  ctx.fillStyle = 'rgba(233,30,140,0.6)';
  ctx.font = `bold ${Math.min(gw, gh) * 0.1}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Design Area', gx + gw / 2, gy + gh / 2);
  ctx.restore();

  return canvas.toDataURL('image/png');
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
