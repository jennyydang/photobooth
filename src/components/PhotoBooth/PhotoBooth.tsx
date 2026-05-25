'use client';

import { useCallback, useState } from 'react';
import { usePhotoBooth } from '@/contexts/PhotoBoothContext';
import { useStyle } from '@/contexts/StyleContext';
import { useGif } from '@/hooks/useGif';
import { downloadDataUrl, generateLayoutTemplate } from '@/utils/imageUtils';
import { LAYOUTS } from '@/utils/layoutConfigs';
import { LayoutPreview } from '@/components/LayoutSelector/LayoutPreview';
import { StyleToggle } from '@/components/StyleToggle/StyleToggle';
import { LayoutSelector } from '@/components/LayoutSelector/LayoutSelector';
import { DesignSelector } from '@/components/DesignSelector/DesignSelector';
import { CameraView } from '@/components/CameraView/CameraView';
import { PrintStrip } from '@/components/PrintStrip/PrintStrip';
import { EmailForm } from '@/components/EmailForm/EmailForm';
import { PrintControls } from '@/components/PrintControls/PrintControls';
import styles from './PhotoBooth.module.scss';

const STEPS = ['layout-select', 'design-select', 'capturing', 'review', 'share', 'print'] as const;
const STEP_LABELS: Record<string, string> = {
  'layout-select': 'Layout',
  'design-select': 'Design',
  capturing: 'Camera',
  review: 'Review',
  share: 'Share',
  print: 'Print',
};

function getDisplayScale(layout: { orientation: string; size: string } | null): number {
  if (!layout) return 0.22;
  if (layout.orientation === 'vertical') return 0.2;
  return 0.26;
}

export function PhotoBooth() {
  const { cls } = useStyle();
  const {
    appState,
    setAppState,
    capturedPhotos,
    selectedLayout,
    selectedDesign,
    poseFrames,
    resetSession,
  } = usePhotoBooth();
  const { gifUrl, isCreating: isCreatingGif, createPoseStripGif, setGifUrl } = useGif();
  const [compositeUrl, setCompositeUrl] = useState<string | null>(null);
  const [downloadingTemplate, setDownloadingTemplate] = useState<string | null>(null);

  const handleComposed = useCallback((url: string) => {
    setCompositeUrl(url);
  }, []);

  const handleCreateGif = async () => {
    if (!selectedLayout) return;
    await createPoseStripGif(poseFrames, capturedPhotos, selectedLayout, selectedDesign);
  };

  const handleReset = () => {
    setCompositeUrl(null);
    setGifUrl(null);
    resetSession();
  };

  const handleDownloadTemplate = async (layoutId: string) => {
    const layout = LAYOUTS.find((l) => l.id === layoutId);
    if (!layout) return;
    setDownloadingTemplate(layoutId);
    try {
      const url = await generateLayoutTemplate(layout);
      downloadDataUrl(url, `template-layout-${layout.number}-${layout.size}.png`);
    } finally {
      setDownloadingTemplate(null);
    }
  };

  const currentStepIdx = STEPS.indexOf(appState as typeof STEPS[number]);

  return (
    <div className={cls(
      styles.photobooth,
      'min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950 text-gray-900 dark:text-white'
    )}>
      <StyleToggle />

      <div className={cls(styles.photobooth__container, 'max-w-6xl mx-auto px-4 py-8')}>

        {/* ─── Header ─────────────────────────────────────────────────────── */}
        <header className={cls(styles.photobooth__header, 'text-center mb-10')}>
          <div className={cls(styles['photobooth__logo'], 'inline-flex items-center gap-3 mb-3')}>
            <span className="text-4xl">📸</span>
            <h1 className={cls(styles['photobooth__title'], 'text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent')}>
              Photo Booth
            </h1>
          </div>

          {appState !== 'welcome' && (
            <nav className={cls(styles['photobooth__breadcrumb'], 'flex items-center justify-center gap-2 mt-4 text-sm text-gray-400 dark:text-white/40')}>
              {STEPS.map((s, i) => {
                const isActive = s === appState;
                const isPast = i < currentStepIdx;
                return (
                  <span key={s} className="flex items-center gap-2">
                    {i > 0 && <span className="text-gray-300 dark:text-white/20">›</span>}
                    <span className={
                      isActive ? 'text-pink-500 font-semibold' : isPast ? 'text-gray-500 dark:text-white/60' : 'text-gray-300 dark:text-white/25'
                    }>
                      {STEP_LABELS[s]}
                    </span>
                  </span>
                );
              })}
            </nav>
          )}
        </header>

        {/* ─── Welcome ────────────────────────────────────────────────────── */}
        {appState === 'welcome' && (
          <div className={cls(styles['photobooth__welcome'], 'flex flex-col items-center gap-8 text-center max-w-xl mx-auto')}>
            <div className={cls(styles['photobooth__welcome-hero'], 'text-8xl')}>📸</div>
            <div>
              <h2 className={cls(styles['photobooth__welcome-title'], 'text-3xl font-black text-gray-900 dark:text-white mb-3')}>
                Strike a Pose!
              </h2>
              <p className={cls(styles['photobooth__welcome-text'], 'text-gray-500 dark:text-white/60 text-lg leading-relaxed')}>
                Pick a layout, choose your design, smile for the camera — then download, share, or print your strip.
              </p>
            </div>
            <div className={cls(styles['photobooth__features'], 'grid grid-cols-3 gap-4 w-full')}>
              {[
                { icon: '🎞', label: '11 layouts', sub: '2×6 & 4×6' },
                { icon: '🎨', label: '3 designs', sub: '+ custom upload' },
                { icon: '🎬', label: 'GIF included', sub: 'per-pose moments' },
              ].map((f) => (
                <div key={f.label} className={cls(styles['photobooth__feature-card'], 'bg-black/5 dark:bg-white/5 rounded-2xl p-4 text-center')}>
                  <div className="text-3xl mb-2">{f.icon}</div>
                  <div className={cls(styles['photobooth__feature-label'], 'text-gray-800 dark:text-white font-semibold text-sm')}>{f.label}</div>
                  <div className={cls(styles['photobooth__feature-sub'], 'text-gray-400 dark:text-white/40 text-xs mt-0.5')}>{f.sub}</div>
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

            {/* ─── Layout Template Downloads ─────────────────────────────── */}
            <div className={cls(styles['photobooth__templates'], 'w-full border-t border-black/10 dark:border-white/10 pt-8 mt-2')}>
              <p className={cls(styles['photobooth__templates-title'], 'text-sm font-semibold text-gray-500 dark:text-white/50 text-center mb-4')}>
                📐 Download layout templates to customize in Canva or Photoshop
              </p>
              <div className={cls(styles['photobooth__templates-grid'], 'grid grid-cols-4 sm:grid-cols-6 gap-2')}>
                {LAYOUTS.map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => handleDownloadTemplate(layout.id)}
                    disabled={downloadingTemplate === layout.id}
                    className={cls(
                      styles['photobooth__template-btn'],
                      'flex flex-col items-center gap-1 p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 hover:border-pink-400/40 rounded-xl text-xs text-gray-500 dark:text-white/50 font-medium transition-all disabled:opacity-50'
                    )}
                    title={`Download ${layout.name} template`}
                  >
                    <LayoutPreview layout={layout} />
                    <span className="leading-tight text-center">
                      {downloadingTemplate === layout.id ? '…' : `#${layout.number}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Layout Select ───────────────────────────────────────────────── */}
        {appState === 'layout-select' && <LayoutSelector />}

        {/* ─── Design Select ───────────────────────────────────────────────── */}
        {appState === 'design-select' && <DesignSelector />}

        {/* ─── Capturing ──────────────────────────────────────────────────── */}
        {appState === 'capturing' && <CameraView />}

        {/* ─── Review ─────────────────────────────────────────────────────── */}
        {appState === 'review' && selectedLayout && (
          <div className={cls(styles['photobooth__review'], 'flex flex-col lg:flex-row gap-8 items-start justify-center')}>
            <div className={cls(styles['photobooth__review-strip'], 'flex flex-col items-center gap-4')}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Strip</h2>
              <PrintStrip onComposed={handleComposed} displayScale={getDisplayScale(selectedLayout)} />
              <div className="flex gap-3">
                <button
                  onClick={() => { setCompositeUrl(null); setAppState('capturing'); }}
                  className={cls('', 'px-5 py-2.5 rounded-full border border-black/20 dark:border-white/20 text-gray-500 dark:text-white/70 hover:text-gray-800 dark:hover:text-white hover:border-black/40 dark:hover:border-white/40 text-sm font-medium transition-all')}
                >
                  ↺ Retake
                </button>
                <button
                  onClick={() => setAppState('share')}
                  className={cls('', 'px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-transform')}
                >
                  Continue →
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-gray-600 dark:text-white/80">Captured Photos</h3>
              <div className="grid grid-cols-2 gap-2 max-w-xs">
                {capturedPhotos.map((photo, i) => (
                  <div key={photo.id} className="relative rounded-lg overflow-hidden aspect-video bg-gray-200 dark:bg-gray-800">
                    <img src={photo.dataUrl} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>

              {selectedDesign && (
                <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3 flex gap-3 items-center">
                  <div className="text-2xl">🎨</div>
                  <div>
                    <div className="text-gray-800 dark:text-white text-sm font-semibold">{selectedDesign.name}</div>
                    <button
                      onClick={() => setAppState('design-select')}
                      className="text-pink-500 text-xs hover:text-pink-400"
                    >
                      Change design
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Share ──────────────────────────────────────────────────────── */}
        {appState === 'share' && (
          <div className={cls(styles['photobooth__share'], 'flex flex-col lg:flex-row gap-8 items-start justify-center')}>
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Strip</h2>
              <PrintStrip onComposed={handleComposed} displayScale={getDisplayScale(selectedLayout)} />

              {/* GIF panel */}
              <div className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3">🎬 Getting-Ready GIF</h3>
                {gifUrl ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={gifUrl}
                      alt="Animated GIF"
                      className="rounded-xl border border-black/10 dark:border-white/10 max-w-full"
                      style={{ maxHeight: 180 }}
                    />
                    <button
                      onClick={() => downloadDataUrl(gifUrl, `photobooth-gif-${Date.now()}.gif`)}
                      className="text-sm text-pink-500 hover:text-pink-400 font-medium"
                    >
                      ⬇ Download GIF
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-400 dark:text-white/40 text-xs">
                      {poseFrames.flat().length > 0
                        ? `${poseFrames.flat().length} frames captured across ${poseFrames.filter(Boolean).length} pose${poseFrames.filter(Boolean).length !== 1 ? 's' : ''}`
                        : 'No getting-ready frames recorded'}
                    </p>
                    <button
                      onClick={handleCreateGif}
                      disabled={isCreatingGif || poseFrames.flat().length === 0}
                      className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isCreatingGif || poseFrames.flat().length === 0
                          ? 'bg-black/10 dark:bg-white/10 text-gray-400 dark:text-white/30 cursor-not-allowed'
                          : 'bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 text-gray-700 dark:text-white hover:scale-[1.02]'
                      }`}
                    >
                      {isCreatingGif ? 'Creating GIF…' : 'Create Getting-Ready GIF'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button
                onClick={() => compositeUrl && downloadDataUrl(compositeUrl, `photobooth-${Date.now()}.png`)}
                disabled={!compositeUrl}
                className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all ${
                  !compositeUrl
                    ? 'bg-black/10 dark:bg-white/10 opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 active:scale-95'
                }`}
              >
                ⬇ Download PNG Strip
              </button>

              <EmailForm compositeUrl={compositeUrl} gifUrl={gifUrl} />

              <div className="border-t border-black/10 dark:border-white/10 pt-4 flex justify-between items-center">
                <button
                  onClick={() => setAppState('print')}
                  className={cls('', 'px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors')}
                >
                  🖨 Print
                </button>
                <button
                  onClick={handleReset}
                  className={cls('', 'px-4 py-2.5 rounded-xl border border-black/20 dark:border-white/20 text-gray-400 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/80 text-sm transition-colors')}
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Print ──────────────────────────────────────────────────────── */}
        {appState === 'print' && (
          <div className={cls(styles['photobooth__print'], 'flex flex-col lg:flex-row gap-8 items-start justify-center')}>
            <div className="flex flex-col items-center gap-4">
              <PrintStrip onComposed={handleComposed} displayScale={getDisplayScale(selectedLayout)} />
            </div>
            <div className="flex flex-col gap-4 w-full max-w-sm">
              <PrintControls compositeUrl={compositeUrl} />
              <button
                onClick={() => setAppState('share')}
                className={cls('', 'px-6 py-3 rounded-xl border border-black/20 dark:border-white/20 text-gray-400 dark:text-white/60 hover:text-gray-700 dark:hover:text-white text-sm transition-colors')}
              >
                ← Back to Share
              </button>
              <button
                onClick={handleReset}
                className={cls('', 'px-6 py-3 rounded-xl border border-red-300 dark:border-red-500/30 text-red-400 dark:text-red-400/70 hover:text-red-500 dark:hover:text-red-400 text-sm transition-colors')}
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
