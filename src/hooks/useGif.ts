'use client';

import { useCallback, useState } from 'react';
import { CapturedPhoto, DesignConfig, LayoutConfig } from '@/types';
import { composeGifFrame, composeAllPosesFrame, composeStrip } from '@/utils/imageUtils';

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
   * Each frame shows the live camera feed in every photo slot — "behind-the-scenes in the frame" feel.
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
        const aspect = layout.canvasWidth / layout.canvasHeight;
        const gifW = Math.min(layout.canvasWidth, 480);
        const gifH = Math.round(gifW / aspect);

        const maxFrames = 20;
        const step = Math.max(1, Math.floor(frames.length / maxFrames));
        const sampled = frames.filter((_, i) => i % step === 0).slice(0, maxFrames);

        const composited: string[] = [];
        for (const frame of sampled) {
          const url = await composeGifFrame(layout, frame, design, gifW, gifH);
          composited.push(url);
        }

        const gifshot = (await import('gifshot')).default;
        gifshot.createGIF(
          { images: composited, gifWidth: gifW, gifHeight: gifH, interval: 0.25, sampleInterval: 10 },
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
   * Build a strip GIF where ALL poses' getting-ready clips play simultaneously.
   *
   * Each GIF frame composites one time-step from every pose's frame array at once —
   * slot 0 shows pose-0's frame, slot 1 shows pose-1's frame, etc. — so all
   * the "getting ready" moments animate in sync across the full strip.
   * A final held frame shows the completed strip with every captured photo.
   */
  const createPoseStripGif = useCallback(
    async (
      poseFrames: string[][],
      capturedPhotos: CapturedPhoto[],
      layout: LayoutConfig,
      design: DesignConfig | null
    ) => {
      const totalPoses = layout.photoCount;
      const capturedPhotoUrls = capturedPhotos.map((p) => p.dataUrl);

      if (poseFrames.flat().length === 0 && capturedPhotos.length === 0) {
        setError('No frames available');
        return;
      }

      setIsCreating(true);
      setError(null);

      try {
        const aspect = layout.canvasWidth / layout.canvasHeight;
        const gifW = Math.min(layout.canvasWidth, 480);
        const gifH = Math.round(gifW / aspect);

        // Normalise every pose's frame array to the same target length so all
        // slots step in sync. Poses with no frames get null placeholders.
        const TARGET = 14;
        const normalized: (string | null)[][] = [];
        for (let i = 0; i < totalPoses; i++) {
          const frames = poseFrames[i] ?? [];
          if (frames.length === 0) {
            normalized.push(Array(TARGET).fill(null));
          } else {
            const step = Math.max(1, Math.floor(frames.length / TARGET));
            const sampled = frames.filter((_, idx) => idx % step === 0).slice(0, TARGET);
            // Pad to TARGET by repeating the last frame
            while (sampled.length < TARGET) sampled.push(sampled[sampled.length - 1]);
            normalized.push(sampled);
          }
        }

        // Compose TARGET frames where every slot animates simultaneously
        const allFrames: string[] = [];
        for (let t = 0; t < TARGET; t++) {
          const slotFrames = normalized.map((frames) => frames[t] ?? null);
          const url = await composeAllPosesFrame(
            layout, slotFrames, capturedPhotoUrls, design, gifW, gifH
          );
          allFrames.push(url);
        }

        // Hold the completed strip for ~1 s at the end (5 identical frames × 0.2 s)
        if (capturedPhotos.length > 0) {
          const finalUrl = await composeStrip(
            layout, capturedPhotoUrls, design, gifW / layout.canvasWidth
          );
          for (let i = 0; i < 5; i++) allFrames.push(finalUrl);
        }

        const gifshot = (await import('gifshot')).default;
        gifshot.createGIF(
          { images: allFrames, gifWidth: gifW, gifHeight: gifH, interval: 0.18, sampleInterval: 10 },
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

  return { gifUrl, setGifUrl, isCreating, error, createGif, createFrameGif, createPoseStripGif };
}
