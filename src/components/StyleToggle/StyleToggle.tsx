'use client';

import { useStyle } from '@/contexts/StyleContext';
import styles from './StyleToggle.module.scss';

export function StyleToggle() {
  const { styleMode, toggleStyleMode } = useStyle();
  const isTailwind = styleMode === 'tailwind';

  return (
    <div className={isTailwind
      ? 'fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 cursor-pointer select-none'
      : styles['style-toggle']
    }
      onClick={toggleStyleMode}
      role="button"
      aria-label="Toggle style mode"
      title={`Switch to ${isTailwind ? 'BEM/SCSS' : 'Tailwind'} mode`}
    >
      <span className={isTailwind ? 'text-xs font-semibold text-white/70' : styles['style-toggle__label']}>
        {isTailwind ? 'Tailwind' : 'BEM/SCSS'}
      </span>
      <div className={isTailwind
        ? `relative w-10 h-5 rounded-full transition-colors ${isTailwind ? 'bg-pink-500' : 'bg-white/20'}`
        : `${styles['style-toggle__track']} ${isTailwind ? styles['style-toggle__track--active'] : ''}`
      }>
        <div className={isTailwind
          ? `absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isTailwind ? 'translate-x-5' : 'translate-x-0.5'}`
          : `${styles['style-toggle__thumb']} ${isTailwind ? styles['style-toggle__thumb--active'] : ''}`
        } />
      </div>
      <span className={isTailwind ? 'text-xs text-white/50' : styles['style-toggle__hint']}>
        {isTailwind ? 'BEM' : 'TW'}
      </span>
    </div>
  );
}
