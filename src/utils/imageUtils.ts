import { LayoutConfig } from '@/types';

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

export async function composeStrip(
  layout: LayoutConfig,
  photosDataUrls: string[],
  graphicDataUrl: string | null,
  scale = 1
): Promise<string> {
  const w = layout.canvasWidth * scale;
  const h = layout.canvasHeight * scale;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#1a1a2e';
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

  // Draw graphic/template
  const gSlot = layout.graphicSlot;
  const gx = gSlot.x * w;
  const gy = gSlot.y * h;
  const gw = gSlot.width * w;
  const gh = gSlot.height * h;

  if (graphicDataUrl) {
    try {
      const gImg = await loadImage(graphicDataUrl);
      ctx.save();
      ctx.beginPath();
      ctx.rect(gx, gy, gw, gh);
      ctx.clip();
      drawCoverFit(ctx, gImg, gx, gy, gw, gh);
      ctx.restore();
    } catch {
      drawDefaultGraphic(ctx, gx, gy, gw, gh);
    }
  } else {
    drawDefaultGraphic(ctx, gx, gy, gw, gh);
  }

  return canvas.toDataURL('image/png');
}

function drawDefaultGraphic(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
  gradient.addColorStop(0, '#e91e8c');
  gradient.addColorStop(0.5, '#9c27b0');
  gradient.addColorStop(1, '#3f51b5');
  ctx.fillStyle = gradient;
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
  return canvas.toDataURL('image/jpeg', 0.92);
}
