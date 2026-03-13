import { useState, useEffect, useCallback } from 'react';

interface CountdownResult {
  timeLeft: number;
  formatted: string;
  isExpired: boolean;
  isWarning: boolean;
  reset: (seconds?: number) => void;
}

/**
 * Custom hook for a countdown timer.
 * @param {number} initialSeconds - Starting seconds (default: 24 hours)
 * @returns {CountdownResult}
 */
export function useCountdown(initialSeconds: number = 86400): CountdownResult {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft > 0]);

  const reset = useCallback((seconds = 86400) => {
    setTimeLeft(seconds);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatted = [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');

  return {
    timeLeft,
    formatted,
    isExpired: timeLeft <= 0,
    isWarning: timeLeft < 3600, // less than 1 hour
    reset,
  };
}
