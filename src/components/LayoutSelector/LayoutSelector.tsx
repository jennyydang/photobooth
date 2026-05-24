'use client';

import { useState } from 'react';
import { usePhotoBooth } from '@/contexts/PhotoBoothContext';
import { useStyle } from '@/contexts/StyleContext';
import { LAYOUTS } from '@/utils/layoutConfigs';
import { LayoutConfig, PrintSize } from '@/types';
import { LayoutPreview } from './LayoutPreview';
import styles from './LayoutSelector.module.scss';

export function LayoutSelector() {
  const { cls } = useStyle();
  const { selectLayout, setAppState } = usePhotoBooth();
  const [activeSize, setActiveSize] = useState<PrintSize>('2x6');

  const filtered = LAYOUTS.filter((l) => l.size === activeSize);

  const handleSelect = (layout: LayoutConfig) => {
    selectLayout(layout);
    setAppState('capturing');
  };

  return (
    <div className={cls(styles['layout-selector'], 'flex flex-col gap-8 w-full max-w-4xl mx-auto')}>
      <div className={cls(styles['layout-selector__header'], 'text-center')}>
        <h2 className={cls(styles['layout-selector__title'], 'text-3xl font-black text-white mb-2')}>
          Choose Your Layout
        </h2>
        <p className={cls(styles['layout-selector__subtitle'], 'text-white/60')}>
          Select a print size and photo arrangement
        </p>
      </div>

      <div className={cls(styles['layout-selector__tabs'], 'flex gap-3 justify-center')}>
        {(['2x6', '4x6'] as PrintSize[]).map((size) => (
          <button
            key={size}
            onClick={() => setActiveSize(size)}
            className={cls(
              `${styles['layout-selector__tab']} ${activeSize === size ? styles['layout-selector__tab--active'] : ''}`,
              `px-8 py-3 rounded-full font-bold text-sm transition-all ${activeSize === size ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'bg-white/10 text-white/70 hover:bg-white/20'}`
            )}
          >
            {size}" strip
          </button>
        ))}
      </div>

      <div className={cls(styles['layout-selector__grid'], 'grid grid-cols-2 md:grid-cols-3 gap-4')}>
        {filtered.map((layout) => (
          <button
            key={layout.id}
            onClick={() => handleSelect(layout)}
            className={cls(
              styles['layout-selector__card'],
              'group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/50 rounded-2xl p-4 flex flex-col items-center gap-3 transition-all hover:scale-105 active:scale-95'
            )}
          >
            <div className={cls(styles['layout-selector__preview'], 'w-full flex justify-center')}>
              <LayoutPreview layout={layout} />
            </div>
            <div className={cls(styles['layout-selector__info'], 'text-center')}>
              <div className={cls(styles['layout-selector__name'], 'text-white font-semibold text-sm')}>
                {layout.name}
              </div>
              <div className={cls(styles['layout-selector__desc'], 'text-white/50 text-xs mt-0.5')}>
                {layout.orientation} · {layout.photoCount} photo{layout.photoCount > 1 ? 's' : ''}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
