import { useState, useEffect, useRef } from 'react';

/**
 * useTelemetry
 * Provides continuous live-updating simulated telemetry for Desktop Hero V2.
 * - Numerical stats update every 1-1.5 seconds.
 * - Spectrum bar heights run at 20 FPS (~50ms) with natural speech modulation and brief pauses.
 */
export function useTelemetry(isPaused = false) {
  const [telemetry, setTelemetry] = useState(() => ({
    activeCalls: 12518,
    activeCallsFormatted: '12,518',
    voiceLatency: '268ms',
    telephonySla: '99.99%',
    speechMos: '4.92',
    regions: [
      { name: 'US East · iad', ping: '11ms', isAmber: false },
      { name: 'US West · sfo', ping: '18ms', isAmber: false },
      { name: 'EU Central · fra', ping: '22ms', isAmber: false },
      { name: 'AP Northeast · nrt', ping: '38ms', isAmber: true },
    ],
    // 28 speech cluster bars simulating active voice streaming
    spectrum: [
      15, 45, 82, 95, 68, 30, 8, 8, 8, 25, 60, 92, 100, 78, 45, 8, 8, 35, 75, 90, 85, 55, 8, 8, 28, 62, 40, 15
    ],
    radarAngle: 0,
  }));

  const secTickRef = useRef(0);
  const frameTickRef = useRef(0);

  useEffect(() => {
    if (isPaused) return;

    // 20 FPS loop for real-time speech waveform modulation (~50ms)
    const interval20Fps = setInterval(() => {
      frameTickRef.current += 1;
      const t = frameTickRef.current * 0.05;

      // Realistic speech envelope: natural syllable bursts with brief conversational pauses
      const speechCycle = (t * 0.45) % (Math.PI * 2);
      // Natural silence pause when sin < -0.6
      const isPause = Math.sin(speechCycle) < -0.65;
      const envelope = isPause ? 0.12 : (0.55 + 0.45 * Math.sin(t * 2.2));

      // 28 speech waveform bars with 4 phoneme cluster peaks
      const basePhonemes = [
        0.18, 0.48, 0.85, 0.96, 0.72, 0.35, // Syllable 1
        0.08, 0.08, 0.08,                   // Silence gap
        0.28, 0.65, 0.92, 0.98, 0.78, 0.45, // Syllable 2
        0.08, 0.08,                         // Silence gap
        0.35, 0.78, 0.92, 0.85, 0.52,       // Syllable 3
        0.08, 0.08,                         // Silence gap
        0.25, 0.62, 0.42, 0.18              // Syllable 4
      ];

      const newSpectrum = basePhonemes.map((base, idx) => {
        if (base <= 0.10) {
          // In silence gap, keep minimal baseline bar
          return Math.round(6 + Math.random() * 4);
        }
        const jitter = Math.sin(t * 8.0 + idx * 0.6) * 0.18;
        const h = Math.round(Math.max(8, Math.min(100, (base + jitter) * envelope * 100)));
        return h;
      });

      setTelemetry((prev) => ({
        ...prev,
        spectrum: newSpectrum,
        radarAngle: (t * 2.5) % (Math.PI * 2),
      }));
    }, 50);

    // 1.2s loop for live numerical stats updates
    const interval1Hz = setInterval(() => {
      secTickRef.current += 1;
      const s = secTickRef.current;

      // Active calls gentle fluctuation around 12,518
      const rawCalls = 12518 + Math.floor(Math.sin(s * 1.7) * 14) + ((s % 3) - 1);
      
      // Edge latency jitter between 266ms and 273ms
      const latencyVal = 268 + Math.floor(Math.sin(s * 2.3) * 4);
      
      // MOS score subtle variance 4.91 to 4.93
      const mosVariance = (4.92 + Math.sin(s * 1.1) * 0.01).toFixed(2);

      const baseRegions = [
        { name: 'US East · iad', base: 11, isAmber: false },
        { name: 'US West · sfo', base: 18, isAmber: false },
        { name: 'EU Central · fra', base: 22, isAmber: false },
        { name: 'AP Northeast · nrt', base: 38, isAmber: true },
      ];

      const updatedRegions = baseRegions.map((r, i) => {
        const jitter = Math.floor(Math.sin(s * 1.5 + i * 1.2) * 1.5);
        return {
          name: r.name,
          ping: `${Math.max(8, r.base + jitter)}ms`,
          isAmber: r.isAmber,
        };
      });

      setTelemetry((prev) => ({
        ...prev,
        activeCalls: rawCalls,
        activeCallsFormatted: rawCalls.toLocaleString(),
        voiceLatency: `${latencyVal}ms`,
        telephonySla: '99.99%',
        speechMos: `${mosVariance} / 5.0`,
        regions: updatedRegions,
      }));
    }, 1200);

    return () => {
      clearInterval(interval20Fps);
      clearInterval(interval1Hz);
    };
  }, [isPaused]);

  return telemetry;
}

export default useTelemetry;
