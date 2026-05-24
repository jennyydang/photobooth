'use client';

import { useEffect, useRef, useState } from 'react';
import { usePhotoBooth } from '@/contexts/PhotoBoothContext';
import { useStyle } from '@/contexts/StyleContext';
import { composeStrip } from '@/utils/imageUtils';
import styles from './PrintStrip.module.scss';

interface PrintStripProps {
  onComposed?: (dataUrl: string) => void;
  displayScale?: number;
}

export function PrintStrip({ onComposed, displayScale = 0.25 }: PrintStripProps) {
  const { cls } = useStyle();
  const { selectedLayout, capturedPhotos, template } = usePhotoBooth();
  const [compositeUrl, setCompositeUrl] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    if (!selectedLayout || capturedPhotos.length === 0) return;

    setIsComposing(true);
    const photoUrls = capturedPhotos.map((p) => p.dataUrl);

    composeStrip(selectedLayout, photoUrls, template)
      .then((url) => {
        setCompositeUrl(url);
        onComposed?.(url);
      })
      .finally(() => setIsComposing(false));
  }, [selectedLayout, capturedPhotos, template, onComposed]);

  if (!selectedLayout) return null;

  const displayW = selectedLayout.canvasWidth * displayScale;
  const displayH = selectedLayout.canvasHeight * displayScale;

  return (
    <div className={cls(styles['print-strip'], 'flex flex-col items-center gap-4')}>
      <div
        className={cls(styles['print-strip__frame'], 'rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10')}
        style={{ width: displayW, height: displayH }}
      >
        {isComposing ? (
          <div className={cls(styles['print-strip__loading'], 'w-full h-full flex items-center justify-center bg-gray-900')}>
            <div className={cls(styles['print-strip__spinner'], 'w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin')} />
          </div>
        ) : compositeUrl ? (
          <img
            src={compositeUrl}
            alt="Photo strip preview"
            className={cls(styles['print-strip__image'], 'w-full h-full object-cover')}
            style={{ width: displayW, height: displayH }}
          />
        ) : (
          <div className={cls(styles['print-strip__placeholder'], 'w-full h-full flex items-center justify-center bg-gray-900 text-white/30 text-sm')}>
            No photos yet
          </div>
        )}
      </div>
    </div>
  );
}
