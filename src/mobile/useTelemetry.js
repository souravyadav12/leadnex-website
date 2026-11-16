import { useState, useEffect, useRef } from 'react';

/**
 * useTelemetry
 * Provides simulated live telemetry for mobile billboards.
 * - Numerical stats update once per second (1 Hz).
 * - Spectrum bar heights and radar angles update at 12 FPS (every ~83ms).
 */
export function useTelemetry() {
  const [telemetry, setTelemetry] = useState(() => ({
    activeCalls: '12,516',
    voiceLatency: '270ms',
    telephonySla: '99.99%',
    speechMos: '4.92',
    regions: [
      { name: 'US-E', ping: '11ms', status: 'HEALTHY' },
      { name: 'US-W', ping: '14ms', status: 'HEALTHY' },
      { name: 'EU-C', ping: '22ms', status: 'HEALTHY' },
      { name: 'AP-NE', ping: '40ms', status: 'HEALTHY' },
    ],
    spectrum: [
      38, 55, 78, 42, 85, 92, 60, 75, 88, 45, 96, 70, 52, 65, 85, 48, 72, 90, 62, 80, 50, 74, 91, 63, 44, 70,
    ],
    radarAngle: 0,
  }));

  const secTickRef = useRef(0);
  const frameTickRef = useRef(0);

  useEffect(() => {
    // 12 FPS loop for spectrum and radar
    const interval12Fps = setInterval(() => {
      frameTickRef.current += 1;
      const t = frameTickRef.current * 0.0833;

      // 26 spectrum bars
      const newSpectrum = [];
      for (let i = 0; i < 26; i++) {
        const f1 = Math.sin(t * 3.5 + i * 0.45);
        const f2 = Math.cos(t * 2.2 - i * 0.32);
        const comp = Math.abs(f1 * 0.6 + f2 * 0.4);
        newSpectrum.push(Math.round(Math.max(18, Math.min(100, comp * 88 + 14))));
      }

      setTelemetry((prev) => ({
        ...prev,
        spectrum: newSpectrum,
        radarAngle: (t * 2.4) % (Math.PI * 2),
      }));
    }, 83); // ~12 FPS

    // 1 Hz loop for numerical stats
    const interval1Hz = setInterval(() => {
      secTickRef.current += 1;
      const s = secTickRef.current;

      const liveCalls = (12500 + Math.floor(Math.sin(s * 1.5) * 35)).toLocaleString();
      const liveLatency = `${268 + Math.floor(Math.sin(s * 2.0) * 5)}ms`;

      const baseRegions = [
        { name: 'US-E', base: 11 },
        { name: 'US-W', base: 14 },
        { name: 'EU-C', base: 22 },
        { name: 'AP-NE', base: 40 },
      ];

      const updatedRegions = baseRegions.map((r, i) => ({
        name: r.name,
        ping: `${r.base + Math.floor(Math.sin(s * 1.2 + i) * 2)}ms`,
        status: 'HEALTHY',
      }));

      setTelemetry((prev) => ({
        ...prev,
        activeCalls: liveCalls,
        voiceLatency: liveLatency,
        telephonySla: '99.99%',
        speechMos: '4.92',
        regions: updatedRegions,
      }));
    }, 1000);

    return () => {
      clearInterval(interval12Fps);
      clearInterval(interval1Hz);
    };
  }, []);

  return telemetry;
}

export default useTelemetry;
