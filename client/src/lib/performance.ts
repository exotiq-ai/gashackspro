/**
 * Performance Calculator - Estimates power gains from ethanol content
 * Based on typical gains from ethanol's higher octane and cooling properties
 */

export interface PerformanceEstimate {
  baseHP: number;
  estimatedHP: number;
  hpGain: number;
  hpGainPercent: number;
  baseTorque: number;
  estimatedTorque: number;
  torqueGain: number;
  torqueGainPercent: number;
  knockResistance: number; // 0-100 scale
  safeToTune: boolean;
  timingAdvancePotential: number; // degrees
  boostPotential: number; // psi increase
}

export interface VehiclePerformanceData {
  baseHP: number;
  baseTorque: number;
  isTurbocharged: boolean;
  compressionRatio: number;
  displacement: number; // liters
  fuelSystem: "port" | "direct" | "both";
}

// Default performance data for common vehicles
export const VEHICLE_PERFORMANCE_DB: Record<string, VehiclePerformanceData> = {
  // Audi
  "Audi S3": {
    baseHP: 306,
    baseTorque: 295,
    isTurbocharged: true,
    compressionRatio: 9.6,
    displacement: 2.0,
    fuelSystem: "direct",
  },
  "Audi S4": {
    baseHP: 349,
    baseTorque: 369,
    isTurbocharged: true,
    compressionRatio: 9.8,
    displacement: 3.0,
    fuelSystem: "direct",
  },
  "Audi RS3": {
    baseHP: 401,
    baseTorque: 369,
    isTurbocharged: true,
    compressionRatio: 9.6,
    displacement: 2.5,
    fuelSystem: "direct",
  },
  "Audi RS6": {
    baseHP: 591,
    baseTorque: 590,
    isTurbocharged: true,
    compressionRatio: 9.7,
    displacement: 4.0,
    fuelSystem: "direct",
  },
  // BMW
  "BMW M3": {
    baseHP: 473,
    baseTorque: 406,
    isTurbocharged: true,
    compressionRatio: 9.3,
    displacement: 3.0,
    fuelSystem: "direct",
  },
  "BMW M4": {
    baseHP: 473,
    baseTorque: 406,
    isTurbocharged: true,
    compressionRatio: 9.3,
    displacement: 3.0,
    fuelSystem: "direct",
  },
  // Porsche
  "Porsche 911 Turbo": {
    baseHP: 572,
    baseTorque: 553,
    isTurbocharged: true,
    compressionRatio: 9.8,
    displacement: 3.7,
    fuelSystem: "direct",
  },
  // Subaru
  "Subaru WRX STI": {
    baseHP: 310,
    baseTorque: 290,
    isTurbocharged: true,
    compressionRatio: 8.0,
    displacement: 2.5,
    fuelSystem: "port",
  },
  // Honda
  "Honda Civic Type R": {
    baseHP: 306,
    baseTorque: 295,
    isTurbocharged: true,
    compressionRatio: 9.8,
    displacement: 2.0,
    fuelSystem: "direct",
  },
  // Toyota
  "Toyota Supra": {
    baseHP: 382,
    baseTorque: 368,
    isTurbocharged: true,
    compressionRatio: 10.2,
    displacement: 3.0,
    fuelSystem: "direct",
  },
};

import { getEstimatedPower } from "./tuneData";
import type { TuneStage } from "./types";

/**
 * Calculate estimated performance gains from ethanol content
 * Uses real IE tune data when available, falls back to estimates
 */
export function calculatePerformance(
  vehicleModel: string,
  ethanolPercent: number,
  octaneRating: number,
  tuneStage: TuneStage = "stock",
  tuneProvider: "IE" | "DS1" = "IE"
): PerformanceEstimate {
  // Try to get real tune data first
  const ieTuneData = getEstimatedPower(vehicleModel, tuneStage, ethanolPercent, tuneProvider);
  if (ieTuneData && tuneStage !== "stock") {
    // Use real IE tune data
    const baseHP = ieTuneData.hp - ieTuneData.hpGain;
    const baseTorque = ieTuneData.torque - ieTuneData.torqueGain;
    return {
      baseHP,
      estimatedHP: ieTuneData.hp,
      hpGain: ieTuneData.hpGain,
      hpGainPercent: (ieTuneData.hpGain / baseHP) * 100,
      baseTorque,
      estimatedTorque: ieTuneData.torque,
      torqueGain: ieTuneData.torqueGain,
      torqueGainPercent: (ieTuneData.torqueGain / baseTorque) * 100,
      knockResistance: Math.min(100, 50 + ethanolPercent * 0.5),
      safeToTune: true,
      timingAdvancePotential: ethanolPercent >= 60 ? 1.5 : ethanolPercent >= 30 ? 1.0 : 0.5,
      boostPotential: ethanolPercent >= 60 ? 5.5 : ethanolPercent >= 30 ? 3.0 : 1.5,
    };
  }

  // Fallback to estimated performance
  const vehicleData =
    VEHICLE_PERFORMANCE_DB[vehicleModel] || getDefaultVehicleData();

  // Base calculations
  const { baseHP, baseTorque, isTurbocharged, compressionRatio } = vehicleData;

  // Ethanol provides cooling effect and higher octane
  // Turbocharged cars benefit more (can run more boost/timing)
  const turboMultiplier = isTurbocharged ? 1.5 : 1.0;

  // Higher compression ratio = more benefit from octane
  const compressionMultiplier = Math.max(0.5, compressionRatio / 10);

  // Calculate gain percentage (typically 5-15% for E85 on turbo cars)
  const baseGainPercent = (ethanolPercent / 100) * 0.12; // 12% max gain at E100
  const adjustedGainPercent =
    baseGainPercent * turboMultiplier * compressionMultiplier;

  // HP and Torque gains
  const hpGain = baseHP * adjustedGainPercent;
  const estimatedHP = baseHP + hpGain;
  const hpGainPercent = (hpGain / baseHP) * 100;

  const torqueGain = baseTorque * adjustedGainPercent;
  const estimatedTorque = baseTorque + torqueGain;
  const torqueGainPercent = (torqueGain / baseTorque) * 100;

  // Knock resistance (0-100 scale)
  // Higher ethanol = better knock resistance
  const knockResistance = Math.min(
    100,
    50 + ethanolPercent * 0.5 + (octaneRating - 91) * 2
  );

  // Safe to tune if ethanol > 30% and octane > 95
  const safeToTune = ethanolPercent >= 30 && octaneRating >= 95;

  // Timing advance potential (degrees)
  // E85 typically allows 3-5 degrees more timing
  const timingAdvancePotential = (ethanolPercent / 85) * 4;

  // Boost potential (psi increase)
  // Turbocharged cars can run 2-4 psi more on E85
  const boostPotential = isTurbocharged ? (ethanolPercent / 85) * 3 : 0;

  return {
    baseHP: Math.round(baseHP),
    estimatedHP: Math.round(estimatedHP),
    hpGain: Math.round(hpGain),
    hpGainPercent: Math.round(hpGainPercent * 10) / 10,
    baseTorque: Math.round(baseTorque),
    estimatedTorque: Math.round(estimatedTorque),
    torqueGain: Math.round(torqueGain),
    torqueGainPercent: Math.round(torqueGainPercent * 10) / 10,
    knockResistance: Math.round(knockResistance),
    safeToTune,
    timingAdvancePotential: Math.round(timingAdvancePotential * 10) / 10,
    boostPotential: Math.round(boostPotential * 10) / 10,
  };
}

function getDefaultVehicleData(): VehiclePerformanceData {
  return {
    baseHP: 300,
    baseTorque: 280,
    isTurbocharged: true,
    compressionRatio: 9.5,
    displacement: 2.0,
    fuelSystem: "direct",
  };
}

/**
 * Get vehicle specs for display
 */
export function getVehicleSpecs(vehicleModel: string) {
  return VEHICLE_PERFORMANCE_DB[vehicleModel] || null;
}

