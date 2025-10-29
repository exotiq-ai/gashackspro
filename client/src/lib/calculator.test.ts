/**
 * Comprehensive Test Suite for Calculator
 * Premium test coverage for fuel blending calculations
 */

import { describe, it, expect } from "vitest";
import {
  calculateBlend,
  calculateEmptyTankBlend,
  calculateEthanolOnlyBlend,
  type BlendInput,
  type OctaneConfig,
} from "./calculator";

const DEFAULT_OCTANE: OctaneConfig = {
  pumpGasOctane: 91,
  ethanolFuelOctane: 105,
};

describe("calculateBlend", () => {
  describe("Basic Scenarios", () => {
    it("should calculate E30 blend from E10", () => {
      const input: BlendInput = {
        tankSize: 15,
        currentLevel: 25, // 25% = 3.75 gallons
        currentEthanol: 10,
        targetEthanol: 30,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const result = calculateBlend(input, DEFAULT_OCTANE);

      expect(result.canFillToTarget).toBe(true);
      expect(result.currentFuelVolume).toBeCloseTo(3.75, 2);
      expect(result.resultingMix).toBeCloseTo(30, 0);
      expect(result.ethanolToAdd).toBeGreaterThan(0);
      expect(result.pumpGasToAdd).toBeGreaterThan(0);
      expect(result.totalFuelAfter).toBeLessThanOrEqual(15);
    });

    it("should calculate E85 blend from empty tank", () => {
      const input: BlendInput = {
        tankSize: 16,
        currentLevel: 0,
        currentEthanol: 0,
        targetEthanol: 85,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const result = calculateBlend(input, DEFAULT_OCTANE);

      expect(result.canFillToTarget).toBe(true);
      expect(result.currentFuelVolume).toBe(0);
      expect(result.resultingMix).toBeCloseTo(85, 0);
      expect(result.totalFuelAfter).toBeCloseTo(16, 2);
    });

    it("should calculate E50 blend from quarter tank at E10", () => {
      const input: BlendInput = {
        tankSize: 17.4,
        currentLevel: 25,
        currentEthanol: 10,
        targetEthanol: 50,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const result = calculateBlend(input, DEFAULT_OCTANE);

      expect(result.canFillToTarget).toBe(true);
      expect(result.resultingMix).toBeCloseTo(50, 1);
      expect(result.octaneRating).toBeGreaterThan(91);
    });
  });

  describe("Edge Cases", () => {
    it("should handle already at target ethanol", () => {
      const input: BlendInput = {
        tankSize: 15,
        currentLevel: 50,
        currentEthanol: 30,
        targetEthanol: 30,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const result = calculateBlend(input, DEFAULT_OCTANE);

      expect(result.canFillToTarget).toBe(true);
      expect(result.ethanolToAdd).toBe(0);
      expect(result.pumpGasToAdd).toBe(0);
    });

    it("should reject lowering ethanol content", () => {
      const input: BlendInput = {
        tankSize: 15,
        currentLevel: 50,
        currentEthanol: 50,
        targetEthanol: 30,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const result = calculateBlend(input, DEFAULT_OCTANE);

      expect(result.canFillToTarget).toBe(false);
      expect(result.errorMessage).toContain("Cannot reduce ethanol");
    });

    it("should handle full tank scenario", () => {
      const input: BlendInput = {
        tankSize: 15,
        currentLevel: 100,
        currentEthanol: 30,
        targetEthanol: 50,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const result = calculateBlend(input, DEFAULT_OCTANE);

      expect(result.totalFuelAfter).toBeCloseTo(15, 2);
    });

    it("should handle very small tank levels", () => {
      const input: BlendInput = {
        tankSize: 15,
        currentLevel: 5, // 0.75 gallons
        currentEthanol: 10,
        targetEthanol: 85,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const result = calculateBlend(input, DEFAULT_OCTANE);

      expect(result.canFillToTarget).toBe(true);
      expect(result.currentFuelVolume).toBeCloseTo(0.75, 2);
    });
  });

  describe("Octane Calculations", () => {
    it("should calculate correct octane for E30", () => {
      const input: BlendInput = {
        tankSize: 15,
        currentLevel: 0,
        currentEthanol: 0,
        targetEthanol: 30,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const result = calculateBlend(input, DEFAULT_OCTANE);

      expect(result.octaneRating).toBeGreaterThan(91);
      expect(result.octaneRating).toBeLessThan(105);
    });

    it("should calculate correct octane for E85", () => {
      const input: BlendInput = {
        tankSize: 15,
        currentLevel: 0,
        currentEthanol: 0,
        targetEthanol: 85,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const result = calculateBlend(input, DEFAULT_OCTANE);

      expect(result.octaneRating).toBeGreaterThan(100);
      expect(result.octaneRating).toBeLessThanOrEqual(105);
    });

    it("should use 93 octane pump gas correctly", () => {
      const input: BlendInput = {
        tankSize: 15,
        currentLevel: 0,
        currentEthanol: 0,
        targetEthanol: 30,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const octaneConfig: OctaneConfig = {
        pumpGasOctane: 93,
        ethanolFuelOctane: 105,
      };

      const result = calculateBlend(input, octaneConfig);

      expect(result.octaneRating).toBeGreaterThan(93);
    });
  });

  describe("Physical Constraints", () => {
    it("should not exceed tank capacity", () => {
      const input: BlendInput = {
        tankSize: 10,
        currentLevel: 50,
        currentEthanol: 10,
        targetEthanol: 85,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const result = calculateBlend(input, DEFAULT_OCTANE);

      expect(result.totalFuelAfter).toBeLessThanOrEqual(10);
    });

    it("should return non-negative gallons", () => {
      const input: BlendInput = {
        tankSize: 15,
        currentLevel: 25,
        currentEthanol: 10,
        targetEthanol: 30,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const result = calculateBlend(input, DEFAULT_OCTANE);

      expect(result.ethanolToAdd).toBeGreaterThanOrEqual(0);
      expect(result.pumpGasToAdd).toBeGreaterThanOrEqual(0);
    });

    it("should maintain ethanol percentage bounds (0-100)", () => {
      const input: BlendInput = {
        tankSize: 15,
        currentLevel: 50,
        currentEthanol: 30,
        targetEthanol: 85,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const result = calculateBlend(input, DEFAULT_OCTANE);

      expect(result.resultingMix).toBeGreaterThanOrEqual(0);
      expect(result.resultingMix).toBeLessThanOrEqual(100);
    });
  });

  describe("Real-World Scenarios", () => {
    it("should calculate typical Audi S3 E30 fill", () => {
      const input: BlendInput = {
        tankSize: 13.2, // Audi S3 tank size
        currentLevel: 20,
        currentEthanol: 10,
        targetEthanol: 30,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const result = calculateBlend(input, DEFAULT_OCTANE);

      expect(result.canFillToTarget).toBe(true);
      expect(result.resultingMix).toBeCloseTo(30, 1);
      expect(result.totalFuelAfter).toBeLessThanOrEqual(13.2);
    });

    it("should calculate BMW M3 E50 fill", () => {
      const input: BlendInput = {
        tankSize: 15.6, // BMW M3 tank size
        currentLevel: 15,
        currentEthanol: 10,
        targetEthanol: 50,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const result = calculateBlend(input, DEFAULT_OCTANE);

      expect(result.canFillToTarget).toBe(true);
      expect(result.resultingMix).toBeCloseTo(50, 1);
    });

    it("should calculate Porsche 911 Turbo E85 fill", () => {
      const input: BlendInput = {
        tankSize: 16.9, // Porsche 911 Turbo tank size
        currentLevel: 10,
        currentEthanol: 10,
        targetEthanol: 85,
        pumpGasEthanol: 10,
        ethanolFuelPercent: 85,
      };

      const result = calculateBlend(input, DEFAULT_OCTANE);

      expect(result.canFillToTarget).toBe(true);
      expect(result.resultingMix).toBeCloseTo(85, 1);
      expect(result.octaneRating).toBeGreaterThan(100);
    });
  });
});

describe("calculateEmptyTankBlend", () => {
  it("should calculate E30 for empty tank", () => {
    const result = calculateEmptyTankBlend(15, 30, 10, 85, DEFAULT_OCTANE);

    expect(result.currentFuelVolume).toBe(0);
    expect(result.resultingMix).toBeCloseTo(30, 1);
    expect(result.totalFuelAfter).toBeCloseTo(15, 2);
  });

  it("should calculate E85 for empty tank", () => {
    const result = calculateEmptyTankBlend(15, 85, 10, 85, DEFAULT_OCTANE);

    expect(result.currentFuelVolume).toBe(0);
    expect(result.resultingMix).toBeCloseTo(85, 1);
    expect(result.ethanolToAdd).toBeGreaterThan(result.pumpGasToAdd);
  });
});

describe("calculateEthanolOnlyBlend", () => {
  it("should fill tank with ethanol only", () => {
    const input: BlendInput = {
      tankSize: 15,
      currentLevel: 25,
      currentEthanol: 30,
      targetEthanol: 85, // Not used in ethanol-only
      pumpGasEthanol: 10,
      ethanolFuelPercent: 85,
    };

    const result = calculateEthanolOnlyBlend(input, DEFAULT_OCTANE);

    expect(result.pumpGasToAdd).toBe(0);
    expect(result.ethanolToAdd).toBeGreaterThan(0);
    expect(result.totalFuelAfter).toBeCloseTo(15, 2);
  });

  it("should increase ethanol percentage when filling with ethanol only", () => {
    const input: BlendInput = {
      tankSize: 15,
      currentLevel: 50,
      currentEthanol: 30,
      targetEthanol: 0, // Not used
      pumpGasEthanol: 10,
      ethanolFuelPercent: 85,
    };

    const result = calculateEthanolOnlyBlend(input, DEFAULT_OCTANE);

    expect(result.resultingMix).toBeGreaterThan(30);
    expect(result.pumpGasToAdd).toBe(0);
  });
});

describe("Precision and Rounding", () => {
  it("should round gallons to 2 decimal places", () => {
    const input: BlendInput = {
      tankSize: 15.789,
      currentLevel: 33.333,
      currentEthanol: 10,
      targetEthanol: 30,
      pumpGasEthanol: 10,
      ethanolFuelPercent: 85,
    };

    const result = calculateBlend(input, DEFAULT_OCTANE);

    const ethanolDecimals = (result.ethanolToAdd.toString().split(".")[1] || "").length;
    const pumpGasDecimals = (result.pumpGasToAdd.toString().split(".")[1] || "").length;

    expect(ethanolDecimals).toBeLessThanOrEqual(2);
    expect(pumpGasDecimals).toBeLessThanOrEqual(2);
  });

  it("should round octane to 1 decimal place", () => {
    const input: BlendInput = {
      tankSize: 15,
      currentLevel: 50,
      currentEthanol: 10,
      targetEthanol: 30,
      pumpGasEthanol: 10,
      ethanolFuelPercent: 85,
    };

    const result = calculateBlend(input, DEFAULT_OCTANE);

    const octaneDecimals = (result.octaneRating.toString().split(".")[1] || "").length;
    expect(octaneDecimals).toBeLessThanOrEqual(1);
  });
});
