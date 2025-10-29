import { Activity, Gauge as GaugeIcon, Zap, TrendingUp } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { PerformanceEstimate } from "@/lib/performance";

interface PerformanceDashboardProps {
  performance: PerformanceEstimate;
  vehicleModel: string;
}

export function PerformanceDashboard({
  performance,
  vehicleModel,
}: PerformanceDashboardProps) {
  const {
    baseHP,
    estimatedHP,
    hpGain,
    hpGainPercent,
    baseTorque,
    estimatedTorque,
    torqueGain,
    knockResistance,
    safeToTune,
    timingAdvancePotential,
    boostPotential,
  } = performance;

  return (
    <Card className="p-6 bg-card border-border space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity className="h-5 w-5 text-accent" />
          Performance Estimate
        </h2>
        {safeToTune ? (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Safe to Tune
          </Badge>
        ) : (
          <Badge variant="secondary">Stock Tune Recommended</Badge>
        )}
      </div>

      {vehicleModel && (
        <div className="text-sm text-muted-foreground">
          Based on {vehicleModel} specifications
        </div>
      )}

      {/* Power Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Horsepower */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              Horsepower
            </span>
            <span className="text-xs text-muted-foreground">
              +{hpGain} HP ({hpGainPercent.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-3xl font-bold text-accent">
                {estimatedHP}
              </div>
              <div className="text-xs text-muted-foreground">HP</div>
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground line-through">
                  {baseHP}
                </div>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
            </div>
          </div>
          <Progress value={(hpGain / baseHP) * 100 * 5} className="h-2" />
        </div>

        {/* Torque */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              <GaugeIcon className="h-4 w-4 text-accent" />
              Torque
            </span>
            <span className="text-xs text-muted-foreground">
              +{torqueGain} lb-ft ({performance.torqueGainPercent.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-3xl font-bold text-accent">
                {estimatedTorque}
              </div>
              <div className="text-xs text-muted-foreground">lb-ft</div>
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground line-through">
                  {baseTorque}
                </div>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
            </div>
          </div>
          <Progress
            value={(torqueGain / baseTorque) * 100 * 5}
            className="h-2"
          />
        </div>
      </div>

      {/* Tuning Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">
            Knock Resistance
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-foreground">
              {knockResistance}
            </p>
            <p className="text-xs text-muted-foreground pb-1">/100</p>
          </div>
          <Progress value={knockResistance} className="h-1 mt-2" />
        </div>

        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Timing Advance</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-accent">
              +{timingAdvancePotential.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground pb-1">°</p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">degrees</p>
        </div>

        {boostPotential > 0 && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">
              Boost Potential
            </p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-accent">
                +{boostPotential.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground pb-1">psi</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">increase</p>
          </div>
        )}

        <div className="p-4 bg-accent/20 rounded-lg border border-accent/30">
          <p className="text-xs text-muted-foreground mb-1">Power Gain</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-foreground">
              {hpGainPercent.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground pb-1">%</p>
          </div>
          <p className="text-xs text-accent mt-1">vs stock</p>
        </div>
      </div>

      {/* Tuning Recommendations */}
      {safeToTune && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <h3 className="text-sm font-semibold text-green-400 mb-2">
            Tuning Recommendations
          </h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>
              • Consider professional dyno tuning to maximize gains safely
            </li>
            <li>
              • Monitor AFR (target 11.5-12.5:1 under boost for turbo engines)
            </li>
            <li>
              • Upgrade spark plugs to 1-2 steps colder for sustained high
              ethanol use
            </li>
            {boostPotential > 0 && (
              <li>
                • Boost can be increased by up to {boostPotential.toFixed(1)}{" "}
                psi with proper tuning
              </li>
            )}
          </ul>
        </div>
      )}
    </Card>
  );
}

