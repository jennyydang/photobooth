'use client';

import { useStyle } from '@/contexts/StyleContext';
import styles from './Countdown.module.scss';

interface CountdownProps {
  count: number | null;
  photoIndex: number;
  totalPhotos: number;
}

export function Countdown({ count, photoIndex, totalPhotos }: CountdownProps) {
  const { cls } = useStyle();

  if (count === null) return null;

  const label = count === 0 ? '📸' : count.toString();

  return (
    <div className={cls(styles.countdown, 'absolute inset-0 flex items-center justify-center bg-black/50 z-20')}>
      <div className={cls(styles.countdown__inner, 'text-center')}>
        <div
          className={cls(
            styles.countdown__number,
            'text-9xl font-black text-white drop-shadow-2xl animate-pulse'
          )}
          key={count}
        >
          {label}
        </div>
        <div className={cls(styles.countdown__status, 'text-white/80 text-xl mt-4 font-medium')}>
          Photo {photoIndex + 1} of {totalPhotos}
        </div>
        {count > 0 && (
          <div className={cls(styles.countdown__hint, 'text-white/50 text-sm mt-2')}>
            Get ready…
          </div>
        )}
      </div>
    </div>
  );
}
