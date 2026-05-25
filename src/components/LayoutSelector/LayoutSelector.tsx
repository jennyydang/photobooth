'use client';

import { usePhotoBooth } from '@/contexts/PhotoBoothContext';
import { useStyle } from '@/contexts/StyleContext';
import { LAYOUTS } from '@/utils/layoutConfigs';
import { LayoutConfig } from '@/types';
import { LayoutPreview } from './LayoutPreview';
import styles from './LayoutSelector.module.scss';

export function LayoutSelector() {
  const { cls } = useStyle();
  const { selectLayout, setAppState } = usePhotoBooth();

  const handleSelect = (layout: LayoutConfig) => {
    selectLayout(layout);
    setAppState('design-select');
  };

  return (
    <div className={cls(styles['layout-selector'], 'flex flex-col gap-8 w-full max-w-5xl mx-auto')}>
      <div className={cls(styles['layout-selector__header'], 'text-center')}>
        <h2 className={cls(styles['layout-selector__title'], 'text-3xl font-black text-white mb-2')}>
          Choose Your Layout
        </h2>
        <p className={cls(styles['layout-selector__subtitle'], 'text-white/60')}>
          Select a print arrangement — 2×6 strips or 4×6 prints
        </p>
      </div>

      <div className={cls(styles['layout-selector__grid'], 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3')}>
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            onClick={() => handleSelect(layout)}
            className={cls(
              styles['layout-selector__card'],
              'group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/60 rounded-2xl p-3 flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95'
            )}
          >
            {/* Layout number badge */}
            <div className={cls(styles['layout-selector__badge'], 'w-6 h-6 rounded-full bg-white/10 text-white/60 text-xs font-bold flex items-center justify-center self-end')}>
              {layout.number}
            </div>

            <div className={cls(styles['layout-selector__preview'], 'w-full flex justify-center items-center')}>
              <LayoutPreview layout={layout} />
            </div>

            <div className={cls(styles['layout-selector__info'], 'text-center w-full')}>
              <div className={cls(styles['layout-selector__size'], 'text-pink-400 text-xs font-bold')}>
                {layout.size}"
              </div>
              <div className={cls(styles['layout-selector__count'], 'text-white/60 text-xs')}>
                {layout.photoCount} photo{layout.photoCount > 1 ? 's' : ''}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
