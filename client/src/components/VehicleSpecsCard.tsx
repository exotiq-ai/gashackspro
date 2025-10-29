import { Car, Gauge, Zap, Fuel } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { getVehicleSpecs } from "@/lib/performance";

interface VehicleSpecsCardProps {
  vehicleModel: string;
}

export function VehicleSpecsCard({ vehicleModel }: VehicleSpecsCardProps) {
  const specs = getVehicleSpecs(vehicleModel);

  if (!specs || !vehicleModel) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Car className="h-5 w-5 text-accent" />
          {vehicleModel}
        </h3>
        {specs.isTurbocharged ? (
          <Badge className="bg-accent/20 text-accent border-accent/30">
            Turbocharged
          </Badge>
        ) : (
          <Badge variant="secondary">Naturally Aspirated</Badge>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" />
            <span>Power</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{specs.baseHP}</p>
          <p className="text-xs text-muted-foreground">HP (stock)</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Gauge className="h-3 w-3" />
            <span>Torque</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {specs.baseTorque}
          </p>
          <p className="text-xs text-muted-foreground">lb-ft (stock)</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Fuel className="h-3 w-3" />
            <span>Displacement</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {specs.displacement.toFixed(1)}
          </p>
          <p className="text-xs text-muted-foreground">liters</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Compression</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {specs.compressionRatio.toFixed(1)}
          </p>
          <p className="text-xs text-muted-foreground">:1 ratio</p>
        </div>
      </div>

      <div className="pt-2 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Fuel System</span>
          <span className="font-medium text-foreground capitalize">
            {specs.fuelSystem === "both"
              ? "Port + Direct Injection"
              : `${specs.fuelSystem} Injection`}
          </span>
        </div>
      </div>
    </Card>
  );
}

