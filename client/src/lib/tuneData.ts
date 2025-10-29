import type { TuneStage } from "@/lib/types";
import ieTuneDataRaw from "../../public/ie_tune_data.json";
import ds1TuneDataRaw from "../../public/ds1_tune_data.json";

export interface TuneSpec {
  stage: string;
  fuel: string;
  hp: number;
  torque: number;
  hpGain: number;
  torqueGain: number;
  percentGain: number;
  notes?: string;
}

export interface VehicleTuneData {
  make: string;
  model: string;
  engine: string;
  years: string;
  stockHP: number;
  stockTorque: number;
  tunes: TuneSpec[];
}

// Convert DS1 format to unified format
function convertDS1ToUnified(ds1Data: any): { models: VehicleTuneData[] } {
  const models: VehicleTuneData[] = ds1Data.vehicles.map((vehicle: any) => {
    const tunes: TuneSpec[] = [];
    
    vehicle.tunes.forEach((tune: any) => {
      // Add 93 octane tune
      if (tune.fuel93) {
        tunes.push({
          stage: tune.stage,
          fuel: "93 Octane",
          hp: tune.fuel93.hp,
          torque: tune.fuel93.tq,
          hpGain: tune.fuel93.hpGain,
          torqueGain: tune.fuel93.tqGain,
          percentGain: tune.fuel93.percentGain,
          notes: tune.description,
        });
      }
      
      // Add E85 tune
      if (tune.fuelE85) {
        tunes.push({
          stage: tune.stage,
          fuel: "E85",
          hp: tune.fuelE85.hp,
          torque: tune.fuelE85.tq,
          hpGain: tune.fuelE85.hpGain,
          torqueGain: tune.fuelE85.tqGain,
          percentGain: tune.fuelE85.percentGain,
          notes: tune.description,
        });
      }
    });
    
    return {
      make: vehicle.make,
      model: vehicle.model,
      engine: vehicle.engine,
      years: "Various",
      stockHP: vehicle.stockPower.hp,
      stockTorque: vehicle.stockPower.tq,
      tunes,
    };
  });
  
  return { models };
}

const ieTuneData = ieTuneDataRaw as { models: VehicleTuneData[] };
const ds1TuneData = convertDS1ToUnified(ds1TuneDataRaw);

/**
 * Get tune data for a specific vehicle model
 */
export function getTuneDataForVehicle(
  vehicleModel: string,
  provider: "IE" | "DS1" = "IE"
): VehicleTuneData | null {
  if (!vehicleModel) return null;

  const data = provider === "IE" ? ieTuneData : ds1TuneData;
  return (
    data.models.find((v) =>
      vehicleModel.toLowerCase().includes(v.model.toLowerCase())
    ) || null
  );
}

/**
 * Get estimated power for a specific tune stage and ethanol percentage
 */
export function getEstimatedPower(
  vehicleModel: string,
  tuneStage: TuneStage,
  ethanolPercent: number,
  provider: "IE" | "DS1" = "IE"
): { hp: number; torque: number; hpGain: number; torqueGain: number } | null {
  const vehicleData = getTuneDataForVehicle(vehicleModel, provider);
  if (!vehicleData) return null;

  // Map tune stage to stage name
  const stageMap: Record<TuneStage, string> = {
    stock: "Stock",
    stage1: "Stage 1",
    stage2: "Stage 2",
    stage3: "Stage 3",
  };

  if (tuneStage === "stock") {
    return {
      hp: vehicleData.stockHP,
      torque: vehicleData.stockTorque,
      hpGain: 0,
      torqueGain: 0,
    };
  }

  const stageName = stageMap[tuneStage];

  // Determine fuel type based on ethanol percentage
  let fuelType: string;
  if (ethanolPercent >= 60) {
    fuelType = "E85";
  } else if (ethanolPercent >= 25) {
    // Interpolate between 93 and E85
    const e93Tune = vehicleData.tunes.find(
      (t) => t.stage === stageName && t.fuel === "93 Octane"
    );
    const e85Tune = vehicleData.tunes.find(
      (t) => t.stage === stageName && t.fuel === "E85"
    );

    if (e93Tune && e85Tune) {
      // Linear interpolation between E30 (93 octane) and E60 (E85)
      const ratio = (ethanolPercent - 25) / 35; // 0 at E25, 1 at E60
      return {
        hp: Math.round(e93Tune.hp + (e85Tune.hp - e93Tune.hp) * ratio),
        torque: Math.round(
          e93Tune.torque + (e85Tune.torque - e93Tune.torque) * ratio
        ),
        hpGain: Math.round(
          e93Tune.hpGain + (e85Tune.hpGain - e93Tune.hpGain) * ratio
        ),
        torqueGain: Math.round(
          e93Tune.torqueGain +
            (e85Tune.torqueGain - e93Tune.torqueGain) * ratio
        ),
      };
    }
    fuelType = "93 Octane";
  } else {
    fuelType = "93 Octane";
  }

  // Find matching tune
  const tune = vehicleData.tunes.find(
    (t) => t.stage === stageName && t.fuel === fuelType
  );

  if (!tune) return null;

  return {
    hp: tune.hp,
    torque: tune.torque,
    hpGain: tune.hpGain,
    torqueGain: tune.torqueGain,
  };
}

/**
 * Get all available tune stages for a vehicle
 */
export function getAvailableTuneStages(
  vehicleModel: string,
  provider: "IE" | "DS1" = "IE"
): TuneStage[] {
  const vehicleData = getTuneDataForVehicle(vehicleModel, provider);
  if (!vehicleData) return ["stock"];

  const stages: Set<string> = new Set(vehicleData.tunes.map((t) => t.stage));
  const available: TuneStage[] = ["stock"];

  if (stages.has("Stage 1")) available.push("stage1");
  if (stages.has("Stage 2")) available.push("stage2");
  if (stages.has("Stage 3")) available.push("stage3");

  return available;
}

/**
 * Compare power between two fuel types for the same tune stage
 */
export function compareFuelTypes(
  vehicleModel: string,
  tuneStage: TuneStage,
  provider: "IE" | "DS1" = "IE"
): {
  octane93: TuneSpec | null;
  e85: TuneSpec | null;
  difference: { hp: number; torque: number; percent: number };
} | null {
  const vehicleData = getTuneDataForVehicle(vehicleModel, provider);
  if (!vehicleData || tuneStage === "stock") return null;

  const stageMap: Record<TuneStage, string> = {
    stock: "Stock",
    stage1: "Stage 1",
    stage2: "Stage 2",
    stage3: "Stage 3",
  };

  const stageName = stageMap[tuneStage];

  const octane93 = vehicleData.tunes.find(
    (t) => t.stage === stageName && t.fuel === "93 Octane"
  );
  const e85 = vehicleData.tunes.find(
    (t) => t.stage === stageName && t.fuel === "E85"
  );

  if (!octane93 || !e85) return null;

  return {
    octane93,
    e85,
    difference: {
      hp: e85.hp - octane93.hp,
      torque: e85.torque - octane93.torque,
      percent: ((e85.hp - octane93.hp) / octane93.hp) * 100,
    },
  };
}

