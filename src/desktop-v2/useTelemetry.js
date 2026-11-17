import { useState, useEffect, useRef } from 'react';

/**
 * useTelemetry
 * Provides simulated live telemetry for Desktop Hero V2.
 * - Numerical stats update once per second (1 Hz).
 * - Spectrum bar heights and radar angles run at 15 FPS (~66ms).
 */
export function useTelemetry(isPaused = false) {
  const [telemetry, setTelemetry] = useState(() => ({
    activeCalls: 12518,
    activeCallsFormatted: '12,518',
    voiceLatency: '271ms',
    telephonySla: '99.99%',
    speechMos: '4.92',
    regions: [
      { name: 'US East', code: 'US-E', ping: '12ms', status: 'HEALTHY' },
      { name: 'US West', code: 'US-W', ping: '19ms', status: 'HEALTHY' },
      { name: 'EU Central', code: 'EU-C', ping: '23ms', status: 'HEALTHY' },
      { name: 'AP Northeast', code: 'AP-NE', ping: '36ms', status: 'HEALTHY' },
    ],
    spectrum: [
      42, 65, 82, 48, 92, 78, 62, 85, 94, 52, 88, 70, 58, 66, 84, 50, 76, 92, 64, 82, 54, 76, 90, 65, 48, 72,
    ],
    radarAngle: 0,
  }));

  const secTickRef = useRef(0);
  const frameTickRef = useRef(0);

  useEffect(() => {
    if (isPaused) return;

    // 15 FPS loop for spectrum and radar (every ~66ms)
    const interval15Fps = setInterval(() => {
      frameTickRef.current += 1;
      const t = frameTickRef.current * 0.0667;

      // 26 spectrum bars
      const newSpectrum = [];
      for (let i = 0; i < 26; i++) {
        const f1 = Math.sin(t * 3.8 + i * 0.42);
        const f2 = Math.cos(t * 2.4 - i * 0.28);
        const comp = Math.abs(f1 * 0.6 + f2 * 0.4);
        newSpectrum.push(Math.round(Math.max(16, Math.min(100, comp * 86 + 14))));
      }

      setTelemetry((prev) => ({
        ...prev,
        spectrum: newSpectrum,
        radarAngle: (t * 2.8) % (Math.PI * 2),
      }));
    }, 66);

    // 1 Hz loop for numerical stats
    const interval1Hz = setInterval(() => {
      secTickRef.current += 1;
      const s = secTickRef.current;

      const rawCalls = 12518 + Math.floor(Math.sin(s * 1.5) * 35);
      const liveLatency = `${271 + Math.floor(Math.sin(s * 2.1) * 4)}ms`;

      const baseRegions = [
        { name: 'US East', code: 'US-E', base: 12 },
        { name: 'US West', code: 'US-W', base: 19 },
        { name: 'EU Central', code: 'EU-C', base: 23 },
        { name: 'AP Northeast', code: 'AP-NE', base: 36 },
      ];

      const updatedRegions = baseRegions.map((r, i) => ({
        name: r.name,
        code: r.code,
        ping: `${r.base + Math.floor(Math.sin(s * 1.3 + i) * 2)}ms`,
        status: 'HEALTHY',
      }));

      setTelemetry((prev) => ({
        ...prev,
        activeCalls: rawCalls,
        activeCallsFormatted: rawCalls.toLocaleString(),
        voiceLatency: liveLatency,
        telephonySla: '99.99%',
        speechMos: '4.92',
        regions: updatedRegions,
      }));
    }, 1000);

    return () => {
      clearInterval(interval15Fps);
      clearInterval(interval1Hz);
    };
  }, [isPaused]);

  return telemetry;
}

export default useTelemetry;
