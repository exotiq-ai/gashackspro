export interface Vehicle {
  name: string;
  tankSize: number;
  year: string;
}

export interface VehicleMake {
  make: string;
  models: Vehicle[];
}

export interface VehicleDatabase {
  vehicles: VehicleMake[];
}

export type TuneStage = "stock" | "stage1" | "stage2" | "stage3";
export type TuneProvider = "IE" | "DS1";

export interface CalculatorState {
  tankSize: number;
  currentLevel: number;
  currentEthanol: number;
  targetEthanol: number;
  pumpGasEthanol: number;
  ethanolFuelPercent: number;
  pumpGasOctane: number;
  ethanolFuelOctane: number;
  selectedMake: string;
  selectedModel: string;
  fuelPriceEthanol: number;
  fuelPricePumpGas: number;
  tuneStage: TuneStage;
  tuneProvider: "IE" | "DS1";
}

export const DEFAULT_CALCULATOR_STATE: CalculatorState = {
  tankSize: 15.9,
  currentLevel: 50,
  currentEthanol: 10,
  targetEthanol: 30,
  pumpGasEthanol: 10,
  ethanolFuelPercent: 85,
  pumpGasOctane: 91,
  ethanolFuelOctane: 102,
  selectedMake: "",
  selectedModel: "",
  fuelPriceEthanol: 3.5,
  fuelPricePumpGas: 4.2,
  tuneStage: "stock",
  tuneProvider: "IE",
};

