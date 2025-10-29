import { useEffect, useState } from "react";
import { Car } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { VehicleDatabase, Vehicle } from "@/lib/types";

interface VehicleSelectorProps {
  selectedMake: string;
  selectedModel: string;
  onMakeChange: (make: string) => void;
  onModelChange: (model: string, tankSize: number) => void;
}

export function VehicleSelector({
  selectedMake,
  selectedModel,
  onMakeChange,
  onModelChange,
}: VehicleSelectorProps) {
  const [database, setDatabase] = useState<VehicleDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableModels, setAvailableModels] = useState<Vehicle[]>([]);

  useEffect(() => {
    fetch("/vehicles.json")
      .then((res) => res.json())
      .then((data: VehicleDatabase) => {
        setDatabase(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load vehicle database:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (database && selectedMake) {
      const make = database.vehicles.find((v) => v.make === selectedMake);
      setAvailableModels(make?.models || []);
    } else {
      setAvailableModels([]);
    }
  }, [database, selectedMake]);

  const handleMakeChange = (make: string) => {
    onMakeChange(make);
    onModelChange("", 0); // Reset model when make changes
  };

  const handleModelChange = (model: string) => {
    const vehicle = availableModels.find((v) => v.name === model);
    if (vehicle) {
      onModelChange(model, vehicle.tankSize);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Car className="h-4 w-4" />
          Loading vehicles...
        </Label>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Car className="h-4 w-4" />
          Vehicle Make
        </Label>
        <Select value={selectedMake} onValueChange={handleMakeChange}>
          <SelectTrigger className="w-full bg-card border-border">
            <SelectValue placeholder="Select make..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Custom Vehicle</SelectItem>
            {database?.vehicles.map((make) => (
              <SelectItem key={make.make} value={make.make}>
                {make.make}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedMake && selectedMake !== "custom" && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Model</Label>
          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger className="w-full bg-card border-border">
              <SelectValue placeholder="Select model..." />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((vehicle) => (
                <SelectItem key={vehicle.name} value={vehicle.name}>
                  {vehicle.name} ({vehicle.tankSize} gal)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

