import { useEffect, useState } from "react";
import { Droplet, Gauge, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircularFuelGauge } from "@/components/ui/circular-fuel-gauge";
import { OctaneMeter } from "@/components/ui/octane-meter";
import { PremiumSlider } from "@/components/PremiumSlider";
import { VehicleSelector } from "@/components/VehicleSelector";
import { FuelGauge } from "@/components/FuelGauge";
import { CostCalculator } from "@/components/CostCalculator";
import { PerformanceDashboard } from "@/components/PerformanceDashboard";
import { OctaneGauge } from "@/components/OctaneGauge";
import { VehicleSpecsCard } from "@/components/VehicleSpecsCard";
import { PresetModes, PresetMode } from "@/components/PresetModes";
import { TuneStageSelector } from "@/components/TuneStageSelector";
import { TuneProviderSelector } from "@/components/TuneProviderSelector";
import { CarShowcase } from "@/components/CarShowcase";
import { calculatePerformance } from "@/lib/performance";
import type { TuneStage } from "@/lib/types";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useAuth } from "@/_core/hooks/useAuth";
import { TankHistoryModal } from "@/components/TankHistoryModal";
import SafetyDisclaimer from "@/components/SafetyDisclaimer";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { History, Save, Settings as SettingsIcon } from "lucide-react";
import {
  calculateBlend,
  calculateEthanolOnlyBlend,
} from "@/lib/calculator";
import { CalculatorState, DEFAULT_CALCULATOR_STATE } from "@/lib/types";
import { useLocation } from "wouter";
import {
  loadCalculatorState,
  saveCalculatorState,
} from "@/lib/storage";
import { useTheme } from "@/contexts/ThemeContext";

export default function Calculator() {
  const { theme, toggleTheme } = useTheme();
  const { playClick, playEngineStart, playSuccess } = useSoundEffects();
  const { vibrateClick, vibrateSuccess } = useHapticFeedback();
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [state, setState] = useState<CalculatorState>(DEFAULT_CALCULATOR_STATE);
  const [showHistory, setShowHistory] = useState(false);

  const saveTankMutation = trpc.tankHistory.save.useMutation({
    onSuccess: () => {
      toast.success("Tank saved to history!");
      playSuccess();
    },
    onError: (error) => {
      toast.error("Failed to save: " + error.message);
    },
  });

  // Load saved state on mount
  useEffect(() => {
    const savedState = loadCalculatorState();
    setState(savedState);
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    saveCalculatorState(state);
  }, [state]);

  const updateState = (updates: Partial<CalculatorState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleVehicleChange = (model: string, tankSize: number) => {
    playEngineStart();
    vibrateSuccess();
    if (tankSize > 0) {
      updateState({ selectedModel: model, tankSize });
    } else {
      updateState({ selectedModel: model });
    }
  };

  const handleSaveTank = () => {
    if (!isAuthenticated) {
      toast.error("Please login to save history");
      window.location.href = getLoginUrl();
      return;
    }

    saveTankMutation.mutate({
      vehicleMake: state.selectedMake,
      vehicleModel: state.selectedModel,
      tankSize: Math.round(state.tankSize * 10),
      currentTankLevel: Math.round(state.currentLevel * 10),
      currentEmix: Math.round(state.currentEthanol * 10),
      targetEmix: Math.round(state.targetEthanol * 10),
      pumpGasEthanol: Math.round(state.pumpGasEthanol * 10),
      pumpGasOctane: state.pumpGasOctane,
      ethanolFuelPercent: Math.round(state.ethanolFuelPercent * 10),
      ethanolFuelOctane: state.ethanolFuelOctane,
      ethanolToAdd: Math.round(blendResult.ethanolToAdd * 100),
      pumpGasToAdd: Math.round(blendResult.pumpGasToAdd * 100),
      resultingMix: Math.round(blendResult.resultingMix * 10),
      resultingOctane: Math.round(blendResult.octaneRating * 10),
      ethanolPrice: state.fuelPriceEthanol ? Math.round(state.fuelPriceEthanol * 100) : undefined,
      pumpGasPrice: state.fuelPricePumpGas ? Math.round(state.fuelPricePumpGas * 100) : undefined,
      totalCost: state.fuelPriceEthanol && state.fuelPricePumpGas
        ? Math.round(
            (blendResult.ethanolToAdd * state.fuelPriceEthanol +
              blendResult.pumpGasToAdd * state.fuelPricePumpGas) *
              100
          )
        : undefined,
    });
  };

  const handleLoadHistory = (historyData: any) => {
    updateState(historyData);
  };

  const handlePresetSelect = (preset: PresetMode) => {
    playClick();
    vibrateClick();
    updateState({ targetEthanol: preset.targetEthanol });
  };

  // Calculate blend results
  const blendResult = calculateBlend(
    {
      tankSize: state.tankSize,
      currentLevel: state.currentLevel,
      currentEthanol: state.currentEthanol,
      targetEthanol: state.targetEthanol,
      pumpGasEthanol: state.pumpGasEthanol,
      ethanolFuelPercent: state.ethanolFuelPercent,
    },
    {
      pumpGasOctane: state.pumpGasOctane,
      ethanolFuelOctane: state.ethanolFuelOctane,
    }
  );

  const ethanolOnlyResult = calculateEthanolOnlyBlend(
    {
      tankSize: state.tankSize,
      currentLevel: state.currentLevel,
      currentEthanol: state.currentEthanol,
      targetEthanol: state.targetEthanol,
      pumpGasEthanol: state.pumpGasEthanol,
      ethanolFuelPercent: state.ethanolFuelPercent,
    },
    {
      pumpGasOctane: state.pumpGasOctane,
      ethanolFuelOctane: state.ethanolFuelOctane,
    }
  );

  // Calculate performance estimates
  const performance = calculatePerformance(
    state.selectedModel || "",
    blendResult.resultingMix,
    blendResult.octaneRating,
    state.tuneStage,
    state.tuneProvider
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass-morphism sticky top-0 z-50 shadow-premium-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/gas-hacks-icon.png" alt="Gas Hacks Pro" className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent">
                Gas Hacks Pro
              </h1>
              <p className="text-xs text-muted-foreground">Professional Performance Fuel Optimization</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/settings")}
                title="Settings"
                className="min-h-[44px] min-w-[44px] touch-manipulation"
              >
                <SettingsIcon className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(true)}
              className="gap-1.5 min-h-[44px] touch-manipulation hidden sm:flex"
            >
              <History className="h-4 w-4" />
              <span className="hidden md:inline">History</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowHistory(true)}
              title="History"
              className="min-h-[44px] min-w-[44px] touch-manipulation sm:hidden"
            >
              <History className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveTank}
              disabled={saveTankMutation.isPending}
              className="gap-1.5 min-h-[44px] touch-manipulation bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hidden sm:flex"
            >
              <Save className="h-4 w-4" />
              {saveTankMutation.isPending ? "Saving..." : "Save Tank"}
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={handleSaveTank}
              disabled={saveTankMutation.isPending}
              title="Save Tank"
              className="min-h-[44px] min-w-[44px] touch-manipulation bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 sm:hidden"
            >
              <Save className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full min-h-[44px] min-w-[44px] touch-manipulation"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Vehicle Selection */}
          <Card className="p-6 glass hover-lift smooth-entrance stagger-1 shadow-premium-lg border-border/50 state-overlay">
            <VehicleSelector
              selectedMake={state.selectedMake}
              selectedModel={state.selectedModel}
              onMakeChange={(make) => updateState({ selectedMake: make })}
              onModelChange={handleVehicleChange}
            />
          </Card>

          {/* Vehicle Specs Card */}
          {/* Car Showcase */}
          {state.selectedModel && (
            <CarShowcase vehicleModel={state.selectedModel} />
          )}

          {state.selectedModel && (
            <VehicleSpecsCard vehicleModel={state.selectedModel} />
          )}

          {/* Tune Provider Selector - Hidden until performance data is re-enabled */}
          {/* <div className="smooth-entrance stagger-2">
          <TuneProviderSelector
            selectedProvider={state.tuneProvider}
            onProviderChange={(provider) => updateState({ tuneProvider: provider })}
          />
          </div> */}

          {/* Tune Stage Selector - Hidden until performance data is re-enabled */}
          {/* {state.selectedModel && (
            <TuneStageSelector
              selectedStage={state.tuneStage}
              onStageChange={(stage: TuneStage) =>
                updateState({ tuneStage: stage })
              }
              vehicleModel={state.selectedModel}
              tuneProvider={state.tuneProvider}
            />
          )} */}

          {/* Preset Modes */}
          <PresetModes
            onPresetSelect={handlePresetSelect}
            currentTarget={state.targetEthanol}
          />

          {/* Premium Visualizations */}
          {state.selectedModel && (
            <Card className="p-8 shadow-premium-xl border-border/50 relative overflow-hidden">
              <div className="gradient-mesh-orange absolute inset-0 opacity-50" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Premium Fuel Analytics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
                  <CircularFuelGauge
                    fuelLevel={state.currentLevel}
                    ethanolPercent={blendResult.resultingMix}
                    size={220}
                    label="Current Mix"
                  />
                  <OctaneMeter
                    octane={blendResult.octaneRating}
                    size={220}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Tank Configuration */}
          <Card className="p-6 bg-card border-border space-y-6 shadow-premium-lg hover-lift state-overlay">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Gauge className="h-5 w-5 text-accent" />
              Tank Configuration
            </h2>

            <PremiumSlider
              label="Fuel Tank Size"
              value={state.tankSize}
              min={5}
              max={30}
              step={0.1}
              unit="gal"
              onChange={(value) => updateState({ tankSize: value })}
              decimals={1}
            />

            <PremiumSlider
              label="Current Tank Level"
              value={state.currentLevel}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(value) => updateState({ currentLevel: value })}
              decimals={0}
            />

            <FuelGauge
              currentLevel={state.currentLevel}
              tankSize={state.tankSize}
            />

            <PremiumSlider
              label="Current E-mix"
              value={state.currentEthanol}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(value) => updateState({ currentEthanol: value })}
              decimals={0}
            />

            <PremiumSlider
              label="Target E-mix"
              value={state.targetEthanol}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(value) => updateState({ targetEthanol: value })}
              decimals={0}
            />
          </Card>

          {/* Fuel Configuration */}
          <Card className="p-6 bg-card border-border space-y-6 shadow-premium-lg hover-lift state-overlay">
            <h2 className="text-lg font-semibold text-foreground">
              Fuel Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PremiumSlider
                label="Pump Gas Ethanol %"
                value={state.pumpGasEthanol}
                min={0}
                max={15}
                step={1}
                unit="%"
                onChange={(value) => updateState({ pumpGasEthanol: value })}
                decimals={0}
              />

              <PremiumSlider
                label="Ethanol Fuel %"
                value={state.ethanolFuelPercent}
                min={50}
                max={100}
                step={1}
                unit="%"
                onChange={(value) =>
                  updateState({ ethanolFuelPercent: value })
                }
                decimals={0}
              />

              <PremiumSlider
                label="Pump Gas Octane"
                value={state.pumpGasOctane}
                min={87}
                max={93}
                step={1}
                onChange={(value) => updateState({ pumpGasOctane: value })}
                decimals={0}
              />

              <PremiumSlider
                label="Ethanol Fuel Octane"
                value={state.ethanolFuelOctane}
                min={95}
                max={113}
                step={1}
                onChange={(value) => updateState({ ethanolFuelOctane: value })}
                decimals={0}
              />
            </div>
          </Card>

          {/* Results */}
          <Card className="p-6 bg-card border-border space-y-6 shadow-premium-xl hover-glow state-overlay relative overflow-hidden">
            <div className="gradient-mesh-blue absolute inset-0 opacity-30" />
            <div className="relative z-10 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Blend Results</h2>

            {!blendResult.canFillToTarget && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">
                  {blendResult.errorMessage}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">
                    Ethanol to Add
                  </p>
                  <p className="text-2xl font-bold text-accent">
                    {blendResult.ethanolToAdd}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    gal @ {state.ethanolFuelPercent}%
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">
                    Pump Gas to Add
                  </p>
                  <p className="text-2xl font-bold text-accent">
                    {blendResult.pumpGasToAdd}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    gal @ {state.pumpGasEthanol}%
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">
                    Resulting Mix
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {blendResult.resultingMix}%
                  </p>
                  <p className="text-xs text-muted-foreground">Ethanol</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Octane</p>
                  <p className="text-2xl font-bold text-foreground">
                    {blendResult.octaneRating}
                  </p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>
            </div>
          </Card>

          {/* Performance Dashboard - Temporarily hidden until data is verified */}
          {/* <PerformanceDashboard
            performance={performance}
            vehicleModel={state.selectedModel || ""}
          /> */}

          {/* Octane Gauge - Temporarily hidden */}
          {/* <div className="flex justify-center p-8 bg-card border border-border rounded-lg">
            <OctaneGauge octane={blendResult.octaneRating} size={240} />
          </div> */}

          {/* Cost Calculator */}
          <CostCalculator
            ethanolToAdd={blendResult.ethanolToAdd}
            pumpGasToAdd={blendResult.pumpGasToAdd}
            ethanolPrice={state.fuelPriceEthanol}
            pumpGasPrice={state.fuelPricePumpGas}
            onEthanolPriceChange={(price) =>
              updateState({ fuelPriceEthanol: price })
            }
            onPumpGasPriceChange={(price) =>
              updateState({ fuelPricePumpGas: price })
            }
          />
        </div>
      </main>

      {/* Tank History Modal */}
      <TankHistoryModal
        open={showHistory}
        onOpenChange={setShowHistory}
        onLoadHistory={handleLoadHistory}
      />

      {/* Safety Disclaimer */}
      <SafetyDisclaimer />

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-12">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <img src="/gas-hacks-icon.png" alt="Gas Hacks Pro" className="w-5 h-5" />
              <span className="font-semibold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Gas Hacks Pro</span>
            </div>
            <div className="text-center md:text-right">
              <span>Unlock your engine's potential</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

