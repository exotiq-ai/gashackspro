interface FuelGaugeProps {
  currentLevel: number;
  tankSize: number;
}

export function FuelGauge({ currentLevel, tankSize }: FuelGaugeProps) {
  const currentVolume = (tankSize * currentLevel) / 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Current Fuel</span>
        <span className="font-mono text-foreground">
          {currentVolume.toFixed(1)} / {tankSize.toFixed(1)} gal
        </span>
      </div>
      <div className="relative h-12 bg-muted/30 rounded-lg overflow-hidden border border-border">
        {/* Fuel level indicator */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent/60 to-accent transition-all duration-500 ease-out"
          style={{ width: `${currentLevel}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* E and F markers */}
        <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
          <span className="text-xs font-bold text-destructive drop-shadow-lg">
            E
          </span>
          <span className="text-xs font-medium text-muted-foreground/50">
            1/2
          </span>
          <span className="text-xs font-bold text-foreground drop-shadow-lg">
            F
          </span>
        </div>

        {/* Level percentage */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-sm font-bold text-foreground drop-shadow-lg">
            {currentLevel}%
          </span>
        </div>
      </div>
    </div>
  );
}

