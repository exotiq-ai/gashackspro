import { DollarSign } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface CostCalculatorProps {
  ethanolToAdd: number;
  pumpGasToAdd: number;
  ethanolPrice: number;
  pumpGasPrice: number;
  onEthanolPriceChange: (price: number) => void;
  onPumpGasPriceChange: (price: number) => void;
}

export function CostCalculator({
  ethanolToAdd,
  pumpGasToAdd,
  ethanolPrice,
  pumpGasPrice,
  onEthanolPriceChange,
  onPumpGasPriceChange,
}: CostCalculatorProps) {
  const ethanolCost = ethanolToAdd * ethanolPrice;
  const pumpGasCost = pumpGasToAdd * pumpGasPrice;
  const totalCost = ethanolCost + pumpGasCost;

  const handleEthanolPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onEthanolPriceChange(value);
    }
  };

  const handlePumpGasPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onPumpGasPriceChange(value);
    }
  };

  return (
    <Card className="p-6 bg-card border-border space-y-6">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-accent" />
        Cost Calculator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Ethanol Price (per gallon)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              type="number"
              value={ethanolPrice.toFixed(2)}
              onChange={handleEthanolPriceChange}
              min={0}
              step={0.1}
              className="pl-7 min-h-[44px] bg-card border-border touch-manipulation text-base"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Pump Gas Price (per gallon)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              type="number"
              value={pumpGasPrice.toFixed(2)}
              onChange={handlePumpGasPriceChange}
              min={0}
              step={0.1}
              className="pl-7 min-h-[44px] bg-card border-border touch-manipulation text-base"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Ethanol Cost</p>
          <p className="text-xl font-bold text-accent">
            ${ethanolCost.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {ethanolToAdd.toFixed(2)} gal
          </p>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Pump Gas Cost</p>
          <p className="text-xl font-bold text-accent">
            ${pumpGasCost.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {pumpGasToAdd.toFixed(2)} gal
          </p>
        </div>

        <div className="p-4 bg-accent/20 rounded-lg border border-accent/30">
          <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
          <p className="text-2xl font-bold text-foreground">
            ${totalCost.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {(ethanolToAdd + pumpGasToAdd).toFixed(2)} gal
          </p>
        </div>
      </div>
    </Card>
  );
}

