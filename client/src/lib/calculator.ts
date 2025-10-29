/**
 * Ethanol Blend Calculator - Core Math Engine
 * Calculates optimal fuel blending ratios for target ethanol percentages
 */

export interface BlendInput {
  tankSize: number; // gallons
  currentLevel: number; // percentage (0-100)
  currentEthanol: number; // percentage (0-100)
  targetEthanol: number; // percentage (0-100)
  pumpGasEthanol: number; // percentage (typically 10 for E10)
  ethanolFuelPercent: number; // percentage (typically 85 for E85)
}

export interface BlendResult {
  ethanolToAdd: number; // gallons
  pumpGasToAdd: number; // gallons
  resultingMix: number; // percentage
  octaneRating: number; // calculated octane
  currentFuelVolume: number; // gallons
  totalFuelAfter: number; // gallons
  canFillToTarget: boolean;
  errorMessage?: string;
}

export interface OctaneConfig {
  pumpGasOctane: number; // typically 91-93
  ethanolFuelOctane: number; // typically 102-105 for E85
}

const DEFAULT_OCTANE: OctaneConfig = {
  pumpGasOctane: 91,
  ethanolFuelOctane: 102,
};

/**
 * Calculate ethanol blend using mixing equation
 * Formula: (V_current × E_current + V_pump × E_pump + V_ethanol × E_ethanol) / (V_current + V_pump + V_ethanol) = E_target
 */
export function calculateBlend(
  input: BlendInput,
  octaneConfig: OctaneConfig = DEFAULT_OCTANE
): BlendResult {
  const {
    tankSize,
    currentLevel,
    currentEthanol,
    targetEthanol,
    pumpGasEthanol,
    ethanolFuelPercent,
  } = input;

  // Convert percentages to decimals
  const currentLevelDecimal = currentLevel / 100;
  const currentEthanolDecimal = currentEthanol / 100;
  const targetEthanolDecimal = targetEthanol / 100;
  const pumpGasEthanolDecimal = pumpGasEthanol / 100;
  const ethanolFuelDecimal = ethanolFuelPercent / 100;

  // Calculate current fuel volume
  const currentFuelVolume = tankSize * currentLevelDecimal;

  // Calculate current ethanol content in tank
  const currentEthanolVolume = currentFuelVolume * currentEthanolDecimal;

  // Available space in tank
  const availableSpace = tankSize - currentFuelVolume;

  // Check if target is achievable
  if (targetEthanol < currentEthanol && currentLevel > 0) {
    return {
      ethanolToAdd: 0,
      pumpGasToAdd: 0,
      resultingMix: currentEthanol,
      octaneRating: 0,
      currentFuelVolume,
      totalFuelAfter: currentFuelVolume,
      canFillToTarget: false,
      errorMessage:
        "Cannot reduce ethanol percentage without draining current fuel",
    };
  }

  // Solve for ethanol and pump gas volumes
  // Let x = ethanol to add, y = pump gas to add
  // Equation 1: (currentEthanolVolume + x*ethanolFuelDecimal + y*pumpGasEthanolDecimal) / (currentFuelVolume + x + y) = targetEthanolDecimal
  // Equation 2: x + y <= availableSpace

  // Rearranging equation 1:
  // currentEthanolVolume + x*ethanolFuelDecimal + y*pumpGasEthanolDecimal = targetEthanolDecimal * (currentFuelVolume + x + y)
  // currentEthanolVolume + x*ethanolFuelDecimal + y*pumpGasEthanolDecimal = targetEthanolDecimal*currentFuelVolume + targetEthanolDecimal*x + targetEthanolDecimal*y
  // x*ethanolFuelDecimal - targetEthanolDecimal*x + y*pumpGasEthanolDecimal - targetEthanolDecimal*y = targetEthanolDecimal*currentFuelVolume - currentEthanolVolume
  // x*(ethanolFuelDecimal - targetEthanolDecimal) + y*(pumpGasEthanolDecimal - targetEthanolDecimal) = targetEthanolDecimal*currentFuelVolume - currentEthanolVolume

  const rightSide =
    targetEthanolDecimal * currentFuelVolume - currentEthanolVolume;
  const ethanolCoeff = ethanolFuelDecimal - targetEthanolDecimal;
  const pumpGasCoeff = pumpGasEthanolDecimal - targetEthanolDecimal;

  // Strategy 1: Fill to capacity with optimal mix
  let ethanolToAdd = 0;
  let pumpGasToAdd = 0;

  if (Math.abs(ethanolCoeff) < 0.0001 && Math.abs(pumpGasCoeff) < 0.0001) {
    // Already at target, can add any combination
    ethanolToAdd = 0;
    pumpGasToAdd = 0;
  } else if (Math.abs(ethanolCoeff) < 0.0001) {
    // Can only use pump gas
    pumpGasToAdd = rightSide / pumpGasCoeff;
    ethanolToAdd = 0;
  } else if (Math.abs(pumpGasCoeff) < 0.0001) {
    // Can only use ethanol
    ethanolToAdd = rightSide / ethanolCoeff;
    pumpGasToAdd = 0;
  } else {
    // Use as much space as possible while maintaining target ratio
    // Maximize: x + y subject to equation above
    // From equation: y = (rightSide - x*ethanolCoeff) / pumpGasCoeff
    // Total: x + (rightSide - x*ethanolCoeff) / pumpGasCoeff <= availableSpace
    // Solve for x when total = availableSpace:
    // x + (rightSide - x*ethanolCoeff) / pumpGasCoeff = availableSpace
    // x*pumpGasCoeff + rightSide - x*ethanolCoeff = availableSpace*pumpGasCoeff
    // x*(pumpGasCoeff - ethanolCoeff) = availableSpace*pumpGasCoeff - rightSide
    // x = (availableSpace*pumpGasCoeff - rightSide) / (pumpGasCoeff - ethanolCoeff)

    ethanolToAdd =
      (availableSpace * pumpGasCoeff - rightSide) /
      (pumpGasCoeff - ethanolCoeff);
    pumpGasToAdd = availableSpace - ethanolToAdd;

    // Validate solution
    if (ethanolToAdd < 0 || pumpGasToAdd < 0) {
      // Try filling with only ethanol
      ethanolToAdd = rightSide / ethanolCoeff;
      pumpGasToAdd = 0;

      if (ethanolToAdd < 0 || ethanolToAdd > availableSpace) {
        // Try filling with only pump gas
        ethanolToAdd = 0;
        pumpGasToAdd = rightSide / pumpGasCoeff;

        if (pumpGasToAdd < 0 || pumpGasToAdd > availableSpace) {
          return {
            ethanolToAdd: 0,
            pumpGasToAdd: 0,
            resultingMix: currentEthanol,
            octaneRating: 0,
            currentFuelVolume,
            totalFuelAfter: currentFuelVolume,
            canFillToTarget: false,
            errorMessage: "Cannot achieve target ethanol percentage",
          };
        }
      }
    }
  }

  // Round to 2 decimal places
  ethanolToAdd = Math.max(0, Math.round(ethanolToAdd * 100) / 100);
  pumpGasToAdd = Math.max(0, Math.round(pumpGasToAdd * 100) / 100);

  // Calculate resulting mix
  const totalFuelAfter = currentFuelVolume + ethanolToAdd + pumpGasToAdd;
  const totalEthanolAfter =
    currentEthanolVolume +
    ethanolToAdd * ethanolFuelDecimal +
    pumpGasToAdd * pumpGasEthanolDecimal;
  const resultingMix =
    totalFuelAfter > 0 ? (totalEthanolAfter / totalFuelAfter) * 100 : 0;

  // Calculate octane rating (weighted average of ALL fuel in tank)
  // Estimate current fuel octane based on ethanol content
  const currentFuelOctane = octaneConfig.pumpGasOctane + 
    (octaneConfig.ethanolFuelOctane - octaneConfig.pumpGasOctane) * currentEthanolDecimal;
  
  const octaneRating =
    totalFuelAfter > 0
      ? (currentFuelVolume * currentFuelOctane +
          ethanolToAdd * octaneConfig.ethanolFuelOctane +
          pumpGasToAdd * octaneConfig.pumpGasOctane) /
        totalFuelAfter
      : currentFuelOctane;

  return {
    ethanolToAdd,
    pumpGasToAdd,
    resultingMix: Math.round(resultingMix * 10) / 10,
    octaneRating: Math.round(octaneRating * 10) / 10,
    currentFuelVolume: Math.round(currentFuelVolume * 100) / 100,
    totalFuelAfter: Math.round(totalFuelAfter * 100) / 100,
    canFillToTarget: true,
  };
}

/**
 * Calculate blend for empty tank scenario
 */
export function calculateEmptyTankBlend(
  tankSize: number,
  targetEthanol: number,
  pumpGasEthanol: number,
  ethanolFuelPercent: number,
  octaneConfig: OctaneConfig = DEFAULT_OCTANE
): BlendResult {
  return calculateBlend(
    {
      tankSize,
      currentLevel: 0,
      currentEthanol: 0,
      targetEthanol,
      pumpGasEthanol,
      ethanolFuelPercent,
    },
    octaneConfig
  );
}

/**
 * Calculate ethanol-only fill (no pump gas)
 */
export function calculateEthanolOnlyBlend(
  input: BlendInput,
  octaneConfig: OctaneConfig = DEFAULT_OCTANE
): BlendResult {
  const { tankSize, currentLevel, currentEthanol, ethanolFuelPercent } = input;

  const currentLevelDecimal = currentLevel / 100;
  const currentEthanolDecimal = currentEthanol / 100;
  const ethanolFuelDecimal = ethanolFuelPercent / 100;

  const currentFuelVolume = tankSize * currentLevelDecimal;
  const currentEthanolVolume = currentFuelVolume * currentEthanolDecimal;
  const availableSpace = tankSize - currentFuelVolume;

  const ethanolToAdd = availableSpace;
  const pumpGasToAdd = 0;

  const totalFuelAfter = currentFuelVolume + ethanolToAdd;
  const totalEthanolAfter =
    currentEthanolVolume + ethanolToAdd * ethanolFuelDecimal;
  const resultingMix = (totalEthanolAfter / totalFuelAfter) * 100;

  return {
    ethanolToAdd: Math.round(ethanolToAdd * 100) / 100,
    pumpGasToAdd: 0,
    resultingMix: Math.round(resultingMix * 10) / 10,
    octaneRating: octaneConfig.ethanolFuelOctane,
    currentFuelVolume: Math.round(currentFuelVolume * 100) / 100,
    totalFuelAfter: Math.round(totalFuelAfter * 100) / 100,
    canFillToTarget: true,
  };
}

