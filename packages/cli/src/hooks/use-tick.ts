import { useEffect, useState } from 'react';

export function useTick(intervalMs = 100) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((value) => value + 1);
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);

  return tick;
}

export function usePulse(on = true, intervalMs = 650) {
  const tick = useTick(intervalMs);
  if (!on) return true;
  return tick % 2 === 0;
}

export function usePulseWave(intervalMs = 60) {
  const tick = useTick(intervalMs);
  return (Math.sin(tick * 0.12) + 1) / 2;
}
