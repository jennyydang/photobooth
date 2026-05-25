'use client';

import { useEffect, useRef, useState } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useCountdown } from '@/hooks/useCountdown';
import { usePhotoBooth } from '@/contexts/PhotoBoothContext';
import { useStyle } from '@/contexts/StyleContext';
import { Countdown } from '@/components/Countdown/Countdown';
import styles from './CameraView.module.scss';

const COUNTDOWN_FROM = 3;
const BETWEEN_SHOT_DELAY = 1500;
const PREP_FRAME_INTERVAL_MS = 400;

export function CameraView() {
  const { cls } = useStyle();
  const {
    selectedLayout,
    capturedPhotos,
    currentPhotoIndex,
    addPhoto,
    setCurrentPhotoIndex,
    setAppState,
    addPreparationFrame,
  } = usePhotoBooth();
  const { videoRef, isReady, error, startCamera, stopCamera, capture } = useCamera();
  const { count, start: startCountdown, stop: stopCountdown } = useCountdown();
  const [flash, setFlash] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const isMounted = useRef(true);
  const frameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      isMounted.current = false;
      stopCamera();
      stopCountdown();
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!selectedLayout) return null;

  const totalPhotos = selectedLayout.photoCount;
  const capturedCount = capturedPhotos.length;
  const isDone = capturedCount >= totalPhotos;

  const startFrameCapture = () => {
    frameIntervalRef.current = setInterval(async () => {
      if (!isMounted.current || !videoRef.current || !isReady) return;
      const url = await capture(true);
      if (url && isMounted.current) addPreparationFrame(url);
    }, PREP_FRAME_INTERVAL_MS);
  };

  const stopFrameCapture = () => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
  };

  const handleCapture = async () => {
    if (isCapturing || !isReady || isDone) return;
    setIsCapturing(true);
    startFrameCapture();

    const runShot = async (index: number) => {
      if (!isMounted.current) return;

      await new Promise<void>((resolve) => startCountdown(COUNTDOWN_FROM, resolve));
      if (!isMounted.current) return;

      const dataUrl = await capture(true);
      if (dataUrl && isMounted.current) {
        setFlash(true);
        setTimeout(() => isMounted.current && setFlash(false), 300);
        addPhoto({ id: `${Date.now()}-${index}`, dataUrl, timestamp: Date.now() });
        setCurrentPhotoIndex(index + 1);

        if (index + 1 < totalPhotos) {
          await new Promise((r) => setTimeout(r, BETWEEN_SHOT_DELAY));
          if (isMounted.current) await runShot(index + 1);
        } else if (isMounted.current) {
          stopFrameCapture();
          setIsCapturing(false);
          setTimeout(() => isMounted.current && setAppState('review'), 800);
        }
      }
    };

    await runShot(capturedCount);
    if (isMounted.current) {
      stopFrameCapture();
      setIsCapturing(false);
    }
  };

  return (
    <div className={cls(styles['camera-view'], 'flex flex-col items-center gap-6 w-full max-w-3xl mx-auto')}>
      <div className={cls(styles['camera-view__header'], 'flex items-center justify-between w-full')}>
        <h2 className={cls(styles['camera-view__title'], 'text-2xl font-bold text-white')}>
          {selectedLayout.name}
        </h2>
        <div className={cls(styles['camera-view__progress'], 'flex gap-2')}>
          {Array.from({ length: totalPhotos }).map((_, i) => (
            <div
              key={i}
              className={cls(
                `${styles['camera-view__dot']} ${i < capturedCount ? styles['camera-view__dot--done'] : i === capturedCount ? styles['camera-view__dot--current'] : ''}`,
                `w-3 h-3 rounded-full transition-colors ${i < capturedCount ? 'bg-pink-500' : i === capturedCount ? 'bg-white' : 'bg-white/30'}`
              )}
            />
          ))}
        </div>
      </div>

      <div className={cls(styles['camera-view__viewport'], 'relative w-full rounded-2xl overflow-hidden bg-black aspect-video')}>
        {error ? (
          <div className={cls(styles['camera-view__error'], 'absolute inset-0 flex items-center justify-center text-red-400 text-center p-6')}>
            <div>
              <div className="text-4xl mb-3">🚫</div>
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cls(styles['camera-view__video'], 'w-full h-full object-cover scale-x-[-1]')}
            />
            {!isReady && (
              <div className={cls(styles['camera-view__loading'], 'absolute inset-0 flex items-center justify-center bg-black')}>
                <div className={cls(styles['camera-view__spinner'], 'w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin')} />
              </div>
            )}
            {flash && (
              <div className={cls(styles['camera-view__flash'], 'absolute inset-0 bg-white z-30 pointer-events-none')} />
            )}
            <Countdown count={count} photoIndex={currentPhotoIndex} totalPhotos={totalPhotos} />
          </>
        )}
      </div>

      <div className={cls(styles['camera-view__controls'], 'flex flex-col items-center gap-4 w-full')}>
        {!isDone ? (
          <button
            onClick={handleCapture}
            disabled={isCapturing || !isReady || !!error}
            className={cls(
              `${styles['camera-view__btn']} ${isCapturing || !isReady ? styles['camera-view__btn--disabled'] : ''}`,
              `px-10 py-4 rounded-full font-bold text-lg transition-all text-white ${isCapturing || !isReady ? 'bg-white/20 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 active:scale-95 shadow-lg shadow-pink-500/30'}`
            )}
          >
            {isCapturing ? `📸 Capturing ${currentPhotoIndex + 1}/${totalPhotos}…` : 'Start Session'}
          </button>
        ) : (
          <div className={cls(styles['camera-view__done'], 'text-green-400 font-semibold text-lg')}>
            ✓ All photos captured! Preparing review…
          </div>
        )}

        <p className={cls(styles['camera-view__tip'], 'text-white/40 text-sm text-center')}>
          {isCapturing
            ? 'Smile and stay still when the countdown reaches 0'
            : isReady
            ? `${totalPhotos} photo${totalPhotos > 1 ? 's' : ''} will be taken automatically`
            : 'Requesting camera access…'}
        </p>
      </div>
    </div>
  );
}
