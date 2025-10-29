import { Zap } from "lucide-react";
import { Card } from "./ui/card";
import type { TuneStage, TuneProvider } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TuneStageSelectorProps {
  selectedStage: TuneStage;
  onStageChange: (stage: TuneStage) => void;
  vehicleModel: string;
  tuneProvider: TuneProvider;
}

const IE_STAGE_DESCRIPTIONS: Record<TuneStage, string> = {
  stock: "Factory configuration",
  stage1: "Flash tune only",
  stage2: "Tune + downpipe",
  stage3: "Hybrid turbo + supporting mods",
};

const DS1_STAGE_DESCRIPTIONS: Record<TuneStage, string> = {
  stock: "Factory configuration",
  stage1: "Tune only",
  stage2: "Intake+elbow, high flow catted downpipe and/or intercooler",
  stage3: "Advanced modifications",
};

export function TuneStageSelector({
  selectedStage,
  onStageChange,
  vehicleModel,
  tuneProvider,
}: TuneStageSelectorProps) {
  const isIE = tuneProvider === "IE";
  const descriptions = isIE ? IE_STAGE_DESCRIPTIONS : DS1_STAGE_DESCRIPTIONS;
  const providerName = isIE ? "IE" : "DS1";
  const providerFullName = isIE
    ? "Integrated Engineering"
    : "Dyno Spectrum (DS1)";

  return (
    <Card className="p-6 bg-card border-border space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">
          Tune Configuration
        </h3>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">
          Select Tune Stage ({providerName})
        </label>
        <Select value={selectedStage} onValueChange={onStageChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select tune stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stock">
              <div className="flex flex-col items-start">
                <span className="font-medium">Stock</span>
                <span className="text-xs text-muted-foreground">
                  {descriptions.stock}
                </span>
              </div>
            </SelectItem>
            <SelectItem value="stage1">
              <div className="flex flex-col items-start">
                <span className="font-medium">Stage 1 ({providerName})</span>
                <span className="text-xs text-muted-foreground">
                  {descriptions.stage1}
                </span>
              </div>
            </SelectItem>
            <SelectItem value="stage2">
              <div className="flex flex-col items-start">
                <span className="font-medium">Stage 2 ({providerName})</span>
                <span className="text-xs text-muted-foreground">
                  {descriptions.stage2}
                </span>
              </div>
            </SelectItem>
            <SelectItem value="stage3">
              <div className="flex flex-col items-start">
                <span className="font-medium">Stage 3 ({providerName})</span>
                <span className="text-xs text-muted-foreground">
                  {descriptions.stage3}
                </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedStage !== "stock" && (
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-accent">
              {providerName} Tune Active:
            </span>{" "}
            Power estimates based on {providerFullName} calibrations for{" "}
            {vehicleModel || "your vehicle"}.
          </p>
        </div>
      )}
    </Card>
  );
}

