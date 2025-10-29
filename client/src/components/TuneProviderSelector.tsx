import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface TuneProviderSelectorProps {
  selectedProvider: "IE" | "DS1";
  onProviderChange: (provider: "IE" | "DS1") => void;
}

const PROVIDERS = [
  {
    id: "IE" as const,
    name: "IE (Integrated Engineering)",
    description: "Standardized dyno-proven power numbers",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  },
  {
    id: "DS1" as const,
    name: "DS1 (Dyno Spectrum)",
    description: "Real-time custom tuning platform",
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  },
];

export function TuneProviderSelector({
  selectedProvider,
  onProviderChange,
}: TuneProviderSelectorProps) {
  return (
    <Card className="p-6 bg-card border-border space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Tune Provider</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PROVIDERS.map((provider) => {
          const isActive = selectedProvider === provider.id;

          return (
            <Button
              key={provider.id}
              variant="outline"
              className={`relative h-auto p-4 flex flex-col items-start gap-2 transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-br ${provider.color} border-2 shadow-lg`
                  : "bg-muted/20 hover:bg-muted/40"
              }`}
              onClick={() => onProviderChange(provider.id)}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-accent animate-pulse" />
              )}

              {/* Provider name */}
              <div className="text-left">
                <p className="font-semibold text-foreground">{provider.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {provider.description}
                </p>
              </div>
            </Button>
          );
        })}
      </div>
      
      {selectedProvider === "DS1" && (
        <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> DS1 focuses on custom real-time tuning. Power numbers shown are typical results and may vary based on individual tuning.
          </p>
        </div>
      )}
    </Card>
  );
}

