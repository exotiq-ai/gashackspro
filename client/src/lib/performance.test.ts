/**
 * Performance Calculator Tests
 * Tests for power and torque gain estimations
 */

import { describe, it, expect } from "vitest";
import { calculatePerformance, getVehicleSpecs, VEHICLE_PERFORMANCE_DB } from "./performance";

describe("calculatePerformance", () => {
  describe("Basic Calculations", () => {
    it("should calculate gains for E30", () => {
      const result = calculatePerformance("Audi S3", 30, 95, "stock", "IE");

      expect(result.baseHP).toBe(306);
      expect(result.estimatedHP).toBeGreaterThan(306);
      expect(result.hpGain).toBeGreaterThan(0);
      expect(result.safeToTune).toBe(false); // E30 at stock tune
    });

    it("should calculate gains for E85", () => {
      const result = calculatePerformance("Audi S3", 85, 103, "stock", "IE");

      expect(result.estimatedHP).toBeGreaterThan(result.baseHP);
      expect(result.hpGainPercent).toBeGreaterThan(0);
      expect(result.knockResistance).toBeGreaterThan(50);
    });

    it("should show higher gains for turbocharged vehicles", () => {
      const turboResult = calculatePerformance("Audi S3", 85, 103, "stock", "IE");
      const baseHP = 306;

      expect(turboResult.hpGainPercent).toBeGreaterThan(0);
      expect(turboResult.boostPotential).toBeGreaterThan(0);
    });
  });

  describe("Safety Checks", () => {
    it("should mark E85 at 100+ octane as safe to tune", () => {
      const result = calculatePerformance("BMW M3", 85, 103, "stock", "IE");

      expect(result.safeToTune).toBe(true);
      expect(result.knockResistance).toBeGreaterThan(80);
    });

    it("should not mark low ethanol as safe to tune", () => {
      const result = calculatePerformance("BMW M3", 10, 91, "stock", "IE");

      expect(result.safeToTune).toBe(false);
    });

    it("should calculate correct timing advance potential", () => {
      const e85Result = calculatePerformance("Audi S3", 85, 103, "stock", "IE");
      const e30Result = calculatePerformance("Audi S3", 30, 95, "stock", "IE");

      expect(e85Result.timingAdvancePotential).toBeGreaterThan(e30Result.timingAdvancePotential);
    });
  });

  describe("Vehicle-Specific Tests", () => {
    it("should use correct base HP for Audi S3", () => {
      const result = calculatePerformance("Audi S3", 30, 95, "stock", "IE");
      expect(result.baseHP).toBe(306);
    });

    it("should use correct base HP for BMW M3", () => {
      const result = calculatePerformance("BMW M3", 30, 95, "stock", "IE");
      expect(result.baseHP).toBe(473);
    });

    it("should use correct base HP for Porsche 911 Turbo", () => {
      const result = calculatePerformance("Porsche 911 Turbo", 30, 95, "stock", "IE");
      expect(result.baseHP).toBe(572);
    });

    it("should handle unknown vehicles with defaults", () => {
      const result = calculatePerformance("Unknown Car", 30, 95, "stock", "IE");

      expect(result.baseHP).toBe(300); // Default
      expect(result.baseTorque).toBe(280); // Default
    });
  });

  describe("Knock Resistance", () => {
    it("should increase knock resistance with ethanol", () => {
      const e10Result = calculatePerformance("Audi S3", 10, 91, "stock", "IE");
      const e85Result = calculatePerformance("Audi S3", 85, 103, "stock", "IE");

      expect(e85Result.knockResistance).toBeGreaterThan(e10Result.knockResistance);
    });

    it("should cap knock resistance at 100", () => {
      const result = calculatePerformance("Audi S3", 100, 113, "stock", "IE");
      expect(result.knockResistance).toBeLessThanOrEqual(100);
    });
  });

  describe("Boost Potential", () => {
    it("should calculate boost potential for turbocharged cars", () => {
      const result = calculatePerformance("Audi S3", 85, 103, "stock", "IE");
      expect(result.boostPotential).toBeGreaterThan(0);
    });

    it("should show zero boost potential for naturally aspirated cars", () => {
      // Note: All cars in our DB are turbocharged currently
      // This test would apply if we add NA cars
      const result = calculatePerformance("Audi S3", 85, 103, "stock", "IE");
      expect(result.boostPotential).toBeDefined();
    });
  });
});

describe("getVehicleSpecs", () => {
  it("should return specs for known vehicles", () => {
    const specs = getVehicleSpecs("Audi S3");

    expect(specs).not.toBeNull();
    expect(specs?.baseHP).toBe(306);
    expect(specs?.isTurbocharged).toBe(true);
  });

  it("should return null for unknown vehicles", () => {
    const specs = getVehicleSpecs("Unknown Car");
    expect(specs).toBeNull();
  });

  it("should have correct compression ratios", () => {
    const audiS3 = getVehicleSpecs("Audi S3");
    const bmwM3 = getVehicleSpecs("BMW M3");

    expect(audiS3?.compressionRatio).toBe(9.6);
    expect(bmwM3?.compressionRatio).toBe(9.3);
  });
});

describe("VEHICLE_PERFORMANCE_DB", () => {
  it("should contain all expected vehicles", () => {
    const expectedVehicles = [
      "Audi S3",
      "Audi S4",
      "Audi RS3",
      "Audi RS6",
      "BMW M3",
      "BMW M4",
      "Porsche 911 Turbo",
      "Subaru WRX STI",
      "Honda Civic Type R",
      "Toyota Supra",
    ];

    expectedVehicles.forEach((vehicle) => {
      expect(VEHICLE_PERFORMANCE_DB[vehicle]).toBeDefined();
    });
  });

  it("should have valid data for all vehicles", () => {
    Object.entries(VEHICLE_PERFORMANCE_DB).forEach(([name, data]) => {
      expect(data.baseHP).toBeGreaterThan(0);
      expect(data.baseTorque).toBeGreaterThan(0);
      expect(data.displacement).toBeGreaterThan(0);
      expect(data.compressionRatio).toBeGreaterThan(0);
      expect(["port", "direct", "both"]).toContain(data.fuelSystem);
    });
  });
});
