'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useCountdown() {
  const [count, setCount] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(
    (from: number, onComplete: () => void) => {
      clear();
      onCompleteRef.current = onComplete;
      setIsRunning(true);
      setCount(from);
    },
    [clear]
  );

  const stop = useCallback(() => {
    clear();
    setIsRunning(false);
    setCount(null);
  }, [clear]);

  useEffect(() => {
    if (!isRunning || count === null) return;

    if (count === 0) {
      timerRef.current = setTimeout(() => {
        setIsRunning(false);
        setCount(null);
        onCompleteRef.current?.();
      }, 500);
      return;
    }

    timerRef.current = setTimeout(() => {
      setCount((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return clear;
  }, [count, isRunning, clear]);

  return { count, isRunning, start, stop };
}
