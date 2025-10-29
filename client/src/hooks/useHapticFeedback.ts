import { useCallback } from "react";

export type HapticIntensity = "light" | "medium" | "heavy";

export function useHapticFeedback() {
  const vibrate = useCallback((intensity: HapticIntensity = "medium") => {
    // Check if Vibration API is supported
    if (!("vibrate" in navigator)) {
      return;
    }

    // Different vibration patterns for different intensities
    const patterns: Record<HapticIntensity, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: [30, 10, 30],
    };

    try {
      navigator.vibrate(patterns[intensity]);
    } catch (error) {
      console.warn("Haptic feedback failed:", error);
    }
  }, []);

  const vibrateClick = useCallback(() => vibrate("light"), [vibrate]);
  const vibrateSuccess = useCallback(() => vibrate("medium"), [vibrate]);
  const vibrateError = useCallback(() => vibrate("heavy"), [vibrate]);

  return {
    vibrate,
    vibrateClick,
    vibrateSuccess,
    vibrateError,
  };
}

