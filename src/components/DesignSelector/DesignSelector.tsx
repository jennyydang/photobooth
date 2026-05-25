'use client';

import { useEffect, useRef, useState } from 'react';
import { usePhotoBooth } from '@/contexts/PhotoBoothContext';
import { useStyle } from '@/contexts/StyleContext';
import { DEFAULT_DESIGNS, renderDesignPreview } from '@/utils/designUtils';
import { DesignConfig } from '@/types';
import styles from './DesignSelector.module.scss';

export function DesignSelector() {
  const { cls } = useStyle();
  const { selectDesign, setAppState, selectedLayout } = usePhotoBooth();
  const [selected, setSelected] = useState<DesignConfig | null>(DEFAULT_DESIGNS[0]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const [customDesign, setCustomDesign] = useState<DesignConfig | null>(null);

  // Pre-render preview thumbnails for built-in designs
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results: Record<string, string> = {};
      for (const d of DEFAULT_DESIGNS) {
        results[d.id] = await renderDesignPreview(d, 200, 130);
      }
      if (!cancelled) setPreviews(results);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const custom: DesignConfig = {
        id: 'custom',
        name: 'Custom',
        description: 'Your uploaded design',
        colors: ['#cccccc', '#999999', '#333333'],
        isCustom: true,
        customDataUrl: dataUrl,
      };
      setCustomDesign(custom);
      setSelected(custom);
      setPreviews((p) => ({ ...p, custom: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleContinue = () => {
    if (!selected) return;
    selectDesign(selected);
    setAppState('capturing');
  };

  const allDesigns = [...DEFAULT_DESIGNS, ...(customDesign ? [customDesign] : [])];

  return (
    <div className={cls(styles['design-selector'], 'flex flex-col gap-8 w-full max-w-3xl mx-auto')}>
      <div className={cls(styles['design-selector__header'], 'text-center')}>
        <h2 className={cls(styles['design-selector__title'], 'text-3xl font-black text-white mb-2')}>
          Choose Your Design
        </h2>
        <p className={cls(styles['design-selector__subtitle'], 'text-white/60')}>
          This design fills the graphic area of your layout
        </p>
        {selectedLayout && (
          <p className={cls(styles['design-selector__layout-hint'], 'text-white/40 text-sm mt-1')}>
            Layout: {selectedLayout.name}
          </p>
        )}
      </div>

      <div className={cls(styles['design-selector__grid'], 'grid grid-cols-2 md:grid-cols-4 gap-4')}>
        {allDesigns.map((design) => {
          const isActive = selected?.id === design.id;
          return (
            <button
              key={design.id}
              onClick={() => setSelected(design)}
              className={cls(
                `${styles['design-selector__card']} ${isActive ? styles['design-selector__card--active'] : ''}`,
                `flex flex-col items-center gap-2 rounded-2xl p-3 border-2 transition-all ${isActive ? 'border-pink-500 bg-pink-500/10 scale-105' : 'border-white/10 bg-white/5 hover:border-white/30'}`
              )}
            >
              <div className={cls(styles['design-selector__thumb'], 'w-full rounded-lg overflow-hidden aspect-[3/2] relative')}>
                {previews[design.id] ? (
                  <img
                    src={previews[design.id]}
                    alt={design.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(135deg, ${design.colors[0]}, ${design.colors[1]})`,
                    }}
                  />
                )}
                {isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-pink-500/20">
                    <span className="text-white text-2xl font-black">✓</span>
                  </div>
                )}
              </div>
              <div className={cls(styles['design-selector__card-name'], 'text-white text-xs font-semibold text-center')}>
                {design.name}
              </div>
            </button>
          );
        })}

        {/* Upload card */}
        <button
          onClick={() => fileRef.current?.click()}
          className={cls(
            styles['design-selector__upload'],
            'flex flex-col items-center justify-center gap-2 rounded-2xl p-3 border-2 border-dashed border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-all aspect-[3/2]'
          )}
        >
          <span className="text-3xl">📁</span>
          <span className={cls(styles['design-selector__upload-label'], 'text-white/60 text-xs font-medium text-center')}>
            Upload Custom
          </span>
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        onChange={handleCustomUpload}
        className="hidden"
      />

      {selected && (
        <div className={cls(styles['design-selector__preview-panel'], 'bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-center')}>
          <div className={cls(styles['design-selector__preview-thumb'], 'w-24 h-16 rounded-lg overflow-hidden flex-shrink-0')}>
            {previews[selected.id] ? (
              <img src={previews[selected.id]} alt={selected.name} className="w-full h-full object-cover" />
            ) : (
              <div style={{ background: `linear-gradient(135deg, ${selected.colors[0]}, ${selected.colors[1]})` }} className="w-full h-full" />
            )}
          </div>
          <div>
            <div className={cls(styles['design-selector__preview-name'], 'text-white font-bold')}>{selected.name}</div>
            <div className={cls(styles['design-selector__preview-desc'], 'text-white/50 text-sm')}>{selected.description}</div>
          </div>
        </div>
      )}

      <div className={cls(styles['design-selector__actions'], 'flex gap-3')}>
        <button
          onClick={() => setAppState('layout-select')}
          className={cls(
            styles['design-selector__back-btn'],
            'px-6 py-3 rounded-full border border-white/20 text-white/60 hover:text-white text-sm font-medium transition-colors'
          )}
        >
          ← Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={cls(
            `${styles['design-selector__continue-btn']} ${!selected ? styles['design-selector__continue-btn--disabled'] : ''}`,
            `flex-1 py-3 rounded-full font-bold text-white text-sm transition-all ${!selected ? 'bg-white/20 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-pink-500/30'}`
          )}
        >
          Start Session →
        </button>
      </div>
    </div>
  );
}
