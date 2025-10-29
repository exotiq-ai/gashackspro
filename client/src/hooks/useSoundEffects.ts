import { useCallback, useRef } from "react";

/**
 * Sound effects hook for UI interactions
 * Uses Web Audio API to generate subtle sound effects
 */
export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  /**
   * Play a subtle click sound
   */
  const playClick = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + 0.05
      );

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Silently fail if audio context not available
    }
  }, [getAudioContext]);

  /**
   * Play a slider adjustment sound
   */
  const playSlider = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 600;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + 0.03
      );

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.03);
    } catch (e) {
      // Silently fail
    }
  }, [getAudioContext]);

  /**
   * Play an engine start sound (multiple frequencies)
   */
  const playEngineStart = useCallback(() => {
    try {
      const ctx = getAudioContext();

      // Low rumble
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.connect(bassGain);
      bassGain.connect(ctx.destination);
      bass.frequency.value = 80;
      bass.type = "sawtooth";
      bassGain.gain.setValueAtTime(0.15, ctx.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + 0.5
      );

      // Mid tone
      const mid = ctx.createOscillator();
      const midGain = ctx.createGain();
      mid.connect(midGain);
      midGain.connect(ctx.destination);
      mid.frequency.value = 200;
      mid.type = "sawtooth";
      midGain.gain.setValueAtTime(0.1, ctx.currentTime);
      midGain.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + 0.4
      );

      bass.start(ctx.currentTime);
      mid.start(ctx.currentTime + 0.05);
      bass.stop(ctx.currentTime + 0.5);
      mid.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // Silently fail
    }
  }, [getAudioContext]);

  /**
   * Play a success chime
   */
  const playSuccess = useCallback(() => {
    try {
      const ctx = getAudioContext();

      // Play two tones in sequence
      [800, 1000].forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = freq;
        oscillator.type = "sine";

        const startTime = ctx.currentTime + i * 0.1;
        gainNode.gain.setValueAtTime(0.15, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.2);
      });
    } catch (e) {
      // Silently fail
    }
  }, [getAudioContext]);

  /**
   * Play a turbo spool sound (rising frequency)
   */
  const playTurboSpool = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(100, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        400,
        ctx.currentTime + 0.8
      );

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + 0.8
      );

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.8);
    } catch (e) {
      // Silently fail
    }
  }, [getAudioContext]);

  return {
    playClick,
    playSlider,
    playEngineStart,
    playSuccess,
    playTurboSpool,
  };
}

