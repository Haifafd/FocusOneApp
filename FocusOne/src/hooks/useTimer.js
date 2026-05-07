import { useCallback, useEffect, useRef, useState } from "react";

export function useTimer({ totalSeconds, onComplete, autoStart = false }) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const startedAtRef = useRef(null);
  const accumulatedRef = useRef(0); // ms accumulated before current run
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const tick = useCallback(() => {
    if (!startedAtRef.current) return;
    const elapsedMs = accumulatedRef.current + (Date.now() - startedAtRef.current);
    const left = Math.max(0, totalSeconds - Math.floor(elapsedMs / 1000));
    setSecondsLeft(left);
    if (left === 0) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
      setIsPaused(false);
      onCompleteRef.current?.();
    }
  }, [totalSeconds]);

  const start = useCallback(() => {
    if (isRunning) return;
    startedAtRef.current = Date.now();
    setIsRunning(true);
    setIsPaused(false);
    intervalRef.current = setInterval(tick, 250);
  }, [isRunning, tick]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    accumulatedRef.current += Date.now() - startedAtRef.current;
    startedAtRef.current = null;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setIsPaused(true);
  }, [isRunning]);

  const resume = useCallback(() => {
    if (isRunning) return;
    startedAtRef.current = Date.now();
    setIsRunning(true);
    setIsPaused(false);
    intervalRef.current = setInterval(tick, 250);
  }, [isRunning, tick]);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    startedAtRef.current = null;
    accumulatedRef.current = 0;
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
    setIsPaused(false);
  }, [totalSeconds]);

  const stop = useCallback(() => {
    reset();
  }, [reset]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  useEffect(() => {
    reset();
    if (autoStart) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSeconds]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  return { secondsLeft, minutes, seconds, progress, isRunning, isPaused, start, pause, resume, reset, stop };
}
