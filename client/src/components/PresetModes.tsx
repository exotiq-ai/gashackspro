import { Flame, Car, DollarSign, Snowflake } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export interface PresetMode {
  name: string;
  description: string;
  icon: React.ReactNode;
  targetEthanol: number;
  color: string;
}

interface PresetModesProps {
  onPresetSelect: (preset: PresetMode) => void;
  currentTarget: number;
}

export const PRESET_MODES: PresetMode[] = [
  {
    name: "Track Day",
    description: "Maximum performance",
    icon: <Flame className="h-4 w-4" />,
    targetEthanol: 85,
    color: "from-red-500/20 to-orange-500/20 border-red-500/30",
  },
  {
    name: "Daily Driver",
    description: "Balanced mix",
    icon: <Car className="h-4 w-4" />,
    targetEthanol: 30,
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  },
  {
    name: "Economy",
    description: "Cost-effective",
    icon: <DollarSign className="h-4 w-4" />,
    targetEthanol: 10,
    color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
  },
  {
    name: "Winter",
    description: "Cold weather safe",
    icon: <Snowflake className="h-4 w-4" />,
    targetEthanol: 20,
    color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
  },
];

export function PresetModes({
  onPresetSelect,
  currentTarget,
}: PresetModesProps) {
  return (
    <Card className="p-6 bg-card border-border space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Quick Presets</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PRESET_MODES.map((preset) => {
          const isActive = currentTarget === preset.targetEthanol;

          return (
            <button
              key={preset.name}
              onClick={() => onPresetSelect(preset)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-300 min-h-[88px] touch-manipulation
                ${
                  isActive
                    ? `bg-gradient-to-br ${preset.color} scale-105`
                    : "bg-muted/30 border-border hover:border-accent/50 hover:scale-102"
                }
              `}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div
                  className={`
                  p-2 rounded-full 
                  ${isActive ? "bg-accent/30" : "bg-muted"}
                `}
                >
                  {preset.icon}
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      isActive ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {preset.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {preset.description}
                  </p>
                  <p className="text-xs font-mono text-accent mt-1">
                    E{preset.targetEthanol}
                  </p>
                </div>
              </div>
              {isActive && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

