'use client';

import { useCallback, useState } from 'react';
import { CapturedPhoto, DesignConfig, LayoutConfig } from '@/types';
import { composeGifFrame, composePoseFrame } from '@/utils/imageUtils';

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
   * Build a per-pose strip GIF.
   *
   * Structure of output GIF:
   *   For each pose i in 0..N-1:
   *     Getting-ready frames: strip with slots 0..i-1 = captured photos,
   *       slot i = live frame (sub-sampled), slots i+1..N-1 = placeholder.
   *   Final frame: complete strip with all captured photos.
   *
   * This gives a single animated GIF that tells the story of the whole session
   * — getting ready for each shot in sequence.
   */
  const createPoseStripGif = useCallback(
    async (
      poseFrames: string[][],
      capturedPhotos: CapturedPhoto[],
      layout: LayoutConfig,
      design: DesignConfig | null
    ) => {
      const totalPoses = layout.photoCount;
      if (poseFrames.length === 0 && capturedPhotos.length === 0) {
        setError('No frames available');
        return;
      }

      setIsCreating(true);
      setError(null);

      try {
        const aspect = layout.canvasWidth / layout.canvasHeight;
        const gifW = Math.min(layout.canvasWidth, 480);
        const gifH = Math.round(gifW / aspect);

        const allFrames: string[] = [];

        for (let poseIdx = 0; poseIdx < totalPoses; poseIdx++) {
          const frames = poseFrames[poseIdx] ?? [];
          if (frames.length === 0) continue;

          // Sub-sample to max 8 frames per pose to keep GIF size reasonable
          const maxPerPose = 8;
          const step = Math.max(1, Math.floor(frames.length / maxPerPose));
          const sampled = frames.filter((_, i) => i % step === 0).slice(0, maxPerPose);

          const capturedSoFar = capturedPhotos.slice(0, poseIdx).map((p) => p.dataUrl);

          for (const liveFrame of sampled) {
            const url = await composePoseFrame(
              layout,
              poseIdx,
              liveFrame,
              capturedSoFar,
              design,
              gifW,
              gifH
            );
            allFrames.push(url);
          }
        }

        // Final frame: complete strip with all photos
        if (capturedPhotos.length > 0) {
          const { composeStrip } = await import('@/utils/imageUtils');
          const finalUrl = await composeStrip(
            layout,
            capturedPhotos.map((p) => p.dataUrl),
            design,
            gifW / layout.canvasWidth
          );
          allFrames.push(finalUrl);
        }

        if (allFrames.length === 0) {
          setError('No frames to animate');
          setIsCreating(false);
          return;
        }

        const gifshot = (await import('gifshot')).default;
        gifshot.createGIF(
          {
            images: allFrames,
            gifWidth: gifW,
            gifHeight: gifH,
            interval: 0.2,
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

  return { gifUrl, setGifUrl, isCreating, error, createGif, createFrameGif, createPoseStripGif };
}
