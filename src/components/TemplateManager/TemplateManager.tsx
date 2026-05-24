'use client';

import { useRef, useState } from 'react';
import { usePhotoBooth } from '@/contexts/PhotoBoothContext';
import { useStyle } from '@/contexts/StyleContext';
import { downloadDataUrl } from '@/utils/imageUtils';
import styles from './TemplateManager.module.scss';

export function TemplateManager() {
  const { cls } = useStyle();
  const { template, setTemplate, selectedLayout } = usePhotoBooth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(template);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreview(result);
      setTemplate(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setTemplate(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDownloadTemplate = () => {
    if (!selectedLayout) return;
    const { canvasWidth, canvasHeight, graphicSlot } = selectedLayout;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const gx = graphicSlot.x * canvasWidth;
    const gy = graphicSlot.y * canvasHeight;
    const gw = graphicSlot.width * canvasWidth;
    const gh = graphicSlot.height * canvasHeight;

    ctx.fillStyle = 'rgba(233,30,140,0.15)';
    ctx.fillRect(gx, gy, gw, gh);

    ctx.strokeStyle = '#e91e8c';
    ctx.lineWidth = 4;
    ctx.setLineDash([16, 8]);
    ctx.strokeRect(gx + 2, gy + 2, gw - 4, gh - 4);

    ctx.fillStyle = '#e91e8c';
    ctx.font = `bold ${Math.min(gw, gh) * 0.1}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GRAPHIC AREA', gx + gw / 2, gy + gh / 2 - 20);
    ctx.font = `${Math.min(gw, gh) * 0.07}px Arial`;
    ctx.fillStyle = 'rgba(233,30,140,0.6)';
    ctx.fillText(`${Math.round(gw)} × ${Math.round(gh)} px`, gx + gw / 2, gy + gh / 2 + 20);

    for (let i = 0; i < selectedLayout.photoSlots.length; i++) {
      const s = selectedLayout.photoSlots[i];
      const px = s.x * canvasWidth;
      const py = s.y * canvasHeight;
      const pw = s.width * canvasWidth;
      const ph = s.height * canvasHeight;
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.strokeRect(px + 1, py + 1, pw - 2, ph - 2);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = `${Math.min(pw, ph) * 0.12}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Photo ${i + 1}`, px + pw / 2, py + ph / 2);
    }

    downloadDataUrl(canvas.toDataURL('image/png'), `template-${selectedLayout.id}.png`);
  };

  return (
    <div className={cls(styles['template-manager'], 'flex flex-col gap-3 w-full')}>
      <h3 className={cls(styles['template-manager__title'], 'text-lg font-bold text-white')}>
        🎨 Custom Template
      </h3>

      <div className={cls(styles['template-manager__actions'], 'flex gap-2')}>
        <button
          onClick={() => fileRef.current?.click()}
          className={cls(
            styles['template-manager__btn'],
            'flex-1 py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-all'
          )}
        >
          📁 Upload Template
        </button>
        <button
          onClick={handleDownloadTemplate}
          disabled={!selectedLayout}
          className={cls(
            `${styles['template-manager__btn']} ${!selectedLayout ? styles['template-manager__btn--disabled'] : ''}`,
            `py-2 px-4 rounded-xl border text-sm font-medium transition-all ${!selectedLayout ? 'border-white/10 text-white/30 cursor-not-allowed' : 'border-white/20 bg-white/10 hover:bg-white/15 text-white'}`
          )}
        >
          ⬇ Download Template
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/svg+xml,image/jpeg"
        onChange={handleUpload}
        className="hidden"
      />

      {preview && (
        <div className={cls(styles['template-manager__preview-wrap'], 'relative')}>
          <img
            src={preview}
            alt="Template preview"
            className={cls(styles['template-manager__preview'], 'w-full rounded-lg object-contain max-h-32 bg-white/5 border border-white/10')}
          />
          <button
            onClick={handleRemove}
            className={cls(
              styles['template-manager__remove'],
              'absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors'
            )}
          >
            ×
          </button>
        </div>
      )}

      <p className={cls(styles['template-manager__hint'], 'text-white/30 text-xs')}>
        Upload a PNG or SVG overlay for the graphic area. Download the template guide to see exact dimensions.
      </p>
    </div>
  );
}
