'use client';

import { useCallback, useState } from 'react';

export function useGif() {
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGif = useCallback(
    async (images: string[], width = 400, height = 300) => {
      setIsCreating(true);
      setError(null);

      try {
        const gifshot = (await import('gifshot')).default;
        gifshot.createGIF(
          {
            images,
            gifWidth: width,
            gifHeight: height,
            interval: 0.6,
            numFrames: images.length,
            frameDuration: 1,
            sampleInterval: 10,
          },
          (result) => {
            setIsCreating(false);
            if (result.error) {
              setError(result.errorMsg ?? 'Failed to create GIF');
            } else {
              setGifUrl(result.image ?? null);
            }
          }
        );
      } catch (err) {
        setIsCreating(false);
        setError(err instanceof Error ? err.message : 'Failed to create GIF');
      }
    },
    []
  );

  return { gifUrl, setGifUrl, isCreating, error, createGif };
}
