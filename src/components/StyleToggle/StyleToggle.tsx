'use client';

import { useStyle } from '@/contexts/StyleContext';
import styles from './StyleToggle.module.scss';

export function StyleToggle() {
  const { styleMode, toggleStyleMode, themeMode, toggleTheme } = useStyle();
  const isTailwind = styleMode === 'tailwind';
  const isDark = themeMode === 'dark';

  return (
    <div className={isTailwind
      ? 'fixed top-4 right-4 z-50 flex items-center gap-2'
      : styles['style-toggle-group']
    }>
      {/* Dark/light mode toggle */}
      <button
        onClick={toggleTheme}
        className={isTailwind
          ? `flex items-center justify-center w-9 h-9 rounded-full bg-white/10 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-black/10 dark:hover:bg-white/15 transition-all`
          : styles['style-toggle-group__theme-btn']
        }
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* BEM / Tailwind toggle */}
      <div
        className={isTailwind
          ? 'flex items-center gap-2 bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 rounded-full px-4 py-2 cursor-pointer select-none'
          : styles['style-toggle']
        }
        onClick={toggleStyleMode}
        role="button"
        aria-label="Toggle style mode"
        title={`Switch to ${isTailwind ? 'BEM/SCSS' : 'Tailwind'} mode`}
      >
        <span className={isTailwind ? 'text-xs font-semibold text-gray-700 dark:text-white/70' : styles['style-toggle__label']}>
          {isTailwind ? 'Tailwind' : 'BEM/SCSS'}
        </span>
        <div className={isTailwind
          ? `relative w-10 h-5 rounded-full transition-colors ${isTailwind ? 'bg-pink-500' : 'bg-gray-300 dark:bg-white/20'}`
          : `${styles['style-toggle__track']} ${isTailwind ? styles['style-toggle__track--active'] : ''}`
        }>
          <div className={isTailwind
            ? `absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isTailwind ? 'translate-x-5' : 'translate-x-0.5'}`
            : `${styles['style-toggle__thumb']} ${isTailwind ? styles['style-toggle__thumb--active'] : ''}`
          } />
        </div>
        <span className={isTailwind ? 'text-xs text-gray-400 dark:text-white/50' : styles['style-toggle__hint']}>
          {isTailwind ? 'BEM' : 'TW'}
        </span>
      </div>
    </div>
  );
}
