'use client';

import { useCallback, useState } from 'react';
import { DesignConfig, LayoutConfig } from '@/types';
import { composeGifFrame } from '@/utils/imageUtils';

export function useGif() {
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Simple GIF from an array of raw data URLs (no layout compositing). */
  const createGif = useCallback(
    async (images: string[], width = 400, height = 300) => {
      setIsCreating(true);
      setError(null);

      try {
        const gifshot = (await import('gifshot')).default;
        gifshot.createGIF(
          { images, gifWidth: width, gifHeight: height, interval: 0.5, sampleInterval: 10 },
          (result) => {
            setIsCreating(false);
            if (result.error) setError(result.errorMsg ?? 'Failed to create GIF');
            else setGifUrl(result.image ?? null);
          }
        );
      } catch (err) {
        setIsCreating(false);
        setError(err instanceof Error ? err.message : 'Failed to create GIF');
      }
    },
    []
  );

  /**
   * Build a GIF from preparation frames composited into the chosen layout frame.
   * Each frame shows the live camera feed in every photo slot, with the design
   * filling the graphic area — giving a "behind-the-scenes in the frame" feel.
   */
  const createFrameGif = useCallback(
    async (
      frames: string[],
      layout: LayoutConfig,
      design: DesignConfig | null
    ) => {
      if (frames.length === 0) {
        setError('No preparation frames captured');
        return;
      }

      setIsCreating(true);
      setError(null);

      try {
        // Cap the output at a reasonable GIF size
        const aspect = layout.canvasWidth / layout.canvasHeight;
        const gifW = Math.min(layout.canvasWidth, 480);
        const gifH = Math.round(gifW / aspect);

        // Sub-sample frames so GIF isn't too long (max 20 frames)
        const maxFrames = 20;
        const step = Math.max(1, Math.floor(frames.length / maxFrames));
        const sampled = frames.filter((_, i) => i % step === 0).slice(0, maxFrames);

        // Composite each frame into the layout
        const composited: string[] = [];
        for (const frame of sampled) {
          const url = await composeGifFrame(layout, frame, design, gifW, gifH);
          composited.push(url);
        }

        const gifshot = (await import('gifshot')).default;
        gifshot.createGIF(
          {
            images: composited,
            gifWidth: gifW,
            gifHeight: gifH,
            interval: 0.25,
            sampleInterval: 10,
          },
          (result) => {
            setIsCreating(false);
            if (result.error) setError(result.errorMsg ?? 'Failed to create GIF');
            else setGifUrl(result.image ?? null);
          }
        );
      } catch (err) {
        setIsCreating(false);
        setError(err instanceof Error ? err.message : 'Failed to create GIF');
      }
    },
    []
  );

  return { gifUrl, setGifUrl, isCreating, error, createGif, createFrameGif };
}
