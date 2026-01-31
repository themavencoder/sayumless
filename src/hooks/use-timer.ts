"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface UseTimerProps {
  initialSeconds: number;
  onComplete?: () => void;
}

interface UseTimerReturn {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  formattedTime: string;
  progress: number;
}

export function useTimer({
  initialSeconds,
  onComplete,
}: UseTimerProps): UseTimerReturn {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialSecondsRef = useRef(initialSeconds);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
  }, [isRunning]);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    setIsRunning(false);
    clearTimer();
    setSeconds(initialSecondsRef.current);
  }, [clearTimer]);

  useEffect(() => {
    initialSecondsRef.current = initialSeconds;
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearTimer();
  }, [isRunning, clearTimer, onComplete]);

  const formattedTime = formatTime(seconds);
  const progress = initialSecondsRef.current > 0
    ? ((initialSecondsRef.current - seconds) / initialSecondsRef.current) * 100
    : 0;

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    formattedTime,
    progress,
  };
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
