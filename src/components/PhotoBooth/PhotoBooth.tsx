'use client';

import { useCallback, useState } from 'react';
import { usePhotoBooth } from '@/contexts/PhotoBoothContext';
import { useStyle } from '@/contexts/StyleContext';
import { useGif } from '@/hooks/useGif';
import { downloadDataUrl } from '@/utils/imageUtils';
import { StyleToggle } from '@/components/StyleToggle/StyleToggle';
import { LayoutSelector } from '@/components/LayoutSelector/LayoutSelector';
import { CameraView } from '@/components/CameraView/CameraView';
import { PrintStrip } from '@/components/PrintStrip/PrintStrip';
import { EmailForm } from '@/components/EmailForm/EmailForm';
import { PrintControls } from '@/components/PrintControls/PrintControls';
import { TemplateManager } from '@/components/TemplateManager/TemplateManager';
import styles from './PhotoBooth.module.scss';

export function PhotoBooth() {
  const { cls } = useStyle();
  const {
    appState,
    setAppState,
    capturedPhotos,
    selectedLayout,
    resetSession,
  } = usePhotoBooth();
  const { gifUrl, isCreating: isCreatingGif, createGif, setGifUrl } = useGif();
  const [compositeUrl, setCompositeUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'email' | 'print' | 'template'>('email');

  const handleComposed = useCallback((url: string) => {
    setCompositeUrl(url);
  }, []);

  const handleCreateGif = async () => {
    if (capturedPhotos.length === 0) return;
    const photos = capturedPhotos.map((p) => p.dataUrl);
    const w = selectedLayout?.canvasWidth ?? 600;
    const h = selectedLayout?.canvasHeight ?? 400;
    await createGif(photos, Math.min(w, 600), Math.min(h, 400));
  };

  const handleReset = () => {
    setCompositeUrl(null);
    setGifUrl(null);
    resetSession();
  };

  return (
    <div className={cls(styles.photobooth, 'min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white')}>
      <StyleToggle />

      <div className={cls(styles.photobooth__container, 'max-w-6xl mx-auto px-4 py-8')}>

        {/* Header */}
        <header className={cls(styles.photobooth__header, 'text-center mb-10')}>
          <div className={cls(styles['photobooth__logo'], 'inline-flex items-center gap-3 mb-3')}>
            <span className="text-4xl">📸</span>
            <h1 className={cls(styles['photobooth__title'], 'text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent')}>
              Photo Booth
            </h1>
          </div>
          {appState !== 'welcome' && (
            <nav className={cls(styles['photobooth__breadcrumb'], 'flex items-center justify-center gap-2 mt-4 text-sm text-white/40')}>
              {(['layout-select', 'capturing', 'review', 'share', 'print'] as const).map((s, i) => {
                const labels: Record<string, string> = {
                  'layout-select': 'Layout',
                  capturing: 'Camera',
                  review: 'Review',
                  share: 'Share',
                  print: 'Print',
                };
                const states = ['layout-select', 'capturing', 'review', 'share', 'print'];
                const current = states.indexOf(appState);
                const isActive = s === appState;
                const isPast = states.indexOf(s) < current;

                return (
                  <span key={s} className="flex items-center gap-2">
                    {i > 0 && <span className="text-white/20">›</span>}
                    <span className={cls(
                      '',
                      `${isActive ? 'text-pink-400 font-semibold' : isPast ? 'text-white/60' : 'text-white/30'}`
                    )}>
                      {labels[s]}
                    </span>
                  </span>
                );
              })}
            </nav>
          )}
        </header>

        {/* Welcome */}
        {appState === 'welcome' && (
          <div className={cls(styles['photobooth__welcome'], 'flex flex-col items-center gap-8 text-center max-w-xl mx-auto')}>
            <div className={cls(styles['photobooth__welcome-hero'], 'text-8xl animate-bounce')}>📸</div>
            <div>
              <h2 className={cls(styles['photobooth__welcome-title'], 'text-3xl font-black text-white mb-3')}>
                Strike a Pose!
              </h2>
              <p className={cls(styles['photobooth__welcome-text'], 'text-white/60 text-lg leading-relaxed')}>
                Choose your layout, smile for the camera, and get a beautiful photo strip printed in seconds.
              </p>
            </div>
            <div className={cls(styles['photobooth__features'], 'grid grid-cols-3 gap-4 text-center text-sm')}>
              {[
                { icon: '🎞', label: '2×6 & 4×6 strips' },
                { icon: '✉️', label: 'Email your photos' },
                { icon: '🖨', label: 'Print on any printer' },
              ].map((f) => (
                <div key={f.label} className={cls('', 'bg-white/5 rounded-xl p-3')}>
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <div className="text-white/60">{f.label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setAppState('layout-select')}
              className={cls(
                styles['photobooth__start-btn'],
                'px-12 py-5 rounded-full text-xl font-black text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-2xl shadow-purple-500/30 hover:scale-105 active:scale-95 transition-transform'
              )}
            >
              Get Started →
            </button>
          </div>
        )}

        {/* Layout Select */}
        {appState === 'layout-select' && <LayoutSelector />}

        {/* Capturing */}
        {appState === 'capturing' && <CameraView />}

        {/* Review */}
        {appState === 'review' && selectedLayout && (
          <div className={cls(styles['photobooth__review'], 'flex flex-col lg:flex-row gap-8 items-start justify-center')}>
            <div className={cls(styles['photobooth__review-strip'], 'flex flex-col items-center gap-4')}>
              <h2 className={cls('', 'text-2xl font-bold text-white')}>Your Strip</h2>
              <PrintStrip
                onComposed={handleComposed}
                displayScale={selectedLayout.orientation === 'vertical' ? 0.22 : 0.3}
              />
              <div className={cls('', 'flex gap-3')}>
                <button
                  onClick={() => setAppState('capturing')}
                  className={cls(
                    '',
                    'px-5 py-2.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm font-medium transition-all'
                  )}
                >
                  ↺ Retake
                </button>
                <button
                  onClick={() => setAppState('share')}
                  className={cls(
                    '',
                    'px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-transform'
                  )}
                >
                  Continue →
                </button>
              </div>
            </div>

            <div className={cls(styles['photobooth__review-photos'], 'flex flex-col gap-3')}>
              <h3 className={cls('', 'text-lg font-semibold text-white/80')}>Captured Photos</h3>
              <div className={cls('', 'grid grid-cols-2 gap-2 max-w-xs')}>
                {capturedPhotos.map((photo, i) => (
                  <div key={photo.id} className={cls('', 'relative rounded-lg overflow-hidden aspect-video bg-gray-800')}>
                    <img src={photo.dataUrl} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <div className={cls('', 'absolute bottom-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white text-xs font-bold')}>
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>
              <TemplateManager />
            </div>
          </div>
        )}

        {/* Share */}
        {appState === 'share' && (
          <div className={cls(styles['photobooth__share'], 'flex flex-col lg:flex-row gap-8 items-start justify-center')}>
            <div className={cls('', 'flex flex-col items-center gap-4')}>
              <h2 className={cls('', 'text-2xl font-bold text-white')}>Your Strip</h2>
              <PrintStrip
                onComposed={handleComposed}
                displayScale={selectedLayout?.orientation === 'vertical' ? 0.22 : 0.3}
              />

              {/* GIF section */}
              <div className={cls('', 'w-full bg-white/5 border border-white/10 rounded-2xl p-4')}>
                <h3 className={cls('', 'text-sm font-bold text-white/80 mb-3')}>🎞 Animated GIF</h3>
                {gifUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={gifUrl} alt="Animated GIF" className="w-32 rounded-lg" />
                    <button
                      onClick={() => downloadDataUrl(gifUrl, 'photobooth.gif')}
                      className="text-xs text-pink-400 hover:text-pink-300 font-medium"
                    >
                      ⬇ Download GIF
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleCreateGif}
                    disabled={isCreatingGif}
                    className={cls('', `w-full py-2 rounded-xl text-sm font-medium transition-all ${isCreatingGif ? 'bg-white/10 text-white/40 cursor-wait' : 'bg-white/10 hover:bg-white/15 text-white/70 hover:text-white'}`)}
                  >
                    {isCreatingGif ? 'Creating GIF…' : 'Create Animated GIF'}
                  </button>
                )}
              </div>
            </div>

            <div className={cls('', 'flex flex-col gap-4 w-full max-w-sm')}>
              <div className={cls('', 'flex flex-col gap-2')}>
                {/* Download PNG */}
                <button
                  onClick={() => compositeUrl && downloadDataUrl(compositeUrl, `photobooth-${Date.now()}.png`)}
                  disabled={!compositeUrl}
                  className={cls('', `w-full py-3 px-6 rounded-xl font-bold text-white transition-all ${!compositeUrl ? 'bg-white/10 opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 active:scale-95'}`)}
                >
                  ⬇ Download PNG
                </button>
              </div>

              <EmailForm compositeUrl={compositeUrl} gifUrl={gifUrl} />

              <div className={cls('', 'border-t border-white/10 pt-4 flex justify-between items-center')}>
                <button
                  onClick={() => setAppState('print')}
                  className={cls('', 'px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors')}
                >
                  🖨 Print
                </button>
                <button
                  onClick={handleReset}
                  className={cls('', 'px-4 py-2.5 rounded-xl border border-white/20 text-white/50 hover:text-white/80 text-sm transition-colors')}
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Print */}
        {appState === 'print' && (
          <div className={cls(styles['photobooth__print'], 'flex flex-col lg:flex-row gap-8 items-start justify-center')}>
            <div className={cls('', 'flex flex-col items-center gap-4')}>
              <PrintStrip
                onComposed={handleComposed}
                displayScale={selectedLayout?.orientation === 'vertical' ? 0.22 : 0.3}
              />
            </div>
            <div className={cls('', 'flex flex-col gap-4 w-full max-w-sm')}>
              <PrintControls compositeUrl={compositeUrl} />
              <button
                onClick={() => setAppState('share')}
                className={cls('', 'px-6 py-3 rounded-xl border border-white/20 text-white/60 hover:text-white text-sm transition-colors')}
              >
                ← Back to Share
              </button>
              <button
                onClick={handleReset}
                className={cls('', 'px-6 py-3 rounded-xl border border-red-500/30 text-red-400/70 hover:text-red-400 text-sm transition-colors')}
              >
                Start New Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
