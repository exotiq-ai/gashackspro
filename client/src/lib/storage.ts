import { CalculatorState, DEFAULT_CALCULATOR_STATE } from "./types";

const STORAGE_KEY = "ethanol-calculator-state";

export function saveCalculatorState(state: CalculatorState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save calculator state:", error);
  }
}

export function loadCalculatorState(): CalculatorState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle new fields
      return { ...DEFAULT_CALCULATOR_STATE, ...parsed };
    }
  } catch (error) {
    console.error("Failed to load calculator state:", error);
  }
  return DEFAULT_CALCULATOR_STATE;
}

export function clearCalculatorState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear calculator state:", error);
  }
}

