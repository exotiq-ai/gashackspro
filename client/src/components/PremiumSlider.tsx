import { Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

interface PremiumSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
  decimals?: number;
}

export function PremiumSlider({
  label,
  value,
  min,
  max,
  step,
  unit = "",
  onChange,
  decimals = 1,
}: PremiumSliderProps) {
  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(Number(newValue.toFixed(decimals)));
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(Number(newValue.toFixed(decimals)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(Math.max(min, Math.min(max, newValue)));
    }
  };

  const handleSliderChange = (values: number[]) => {
    onChange(Number(values[0].toFixed(decimals)));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={value.toFixed(decimals)}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            className="w-24 min-h-[44px] text-right font-mono text-base bg-card border-border touch-manipulation"
          />
          {unit && (
            <span className="text-sm text-muted-foreground min-w-[2rem]">
              {unit}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          className="min-h-[44px] min-w-[44px] rounded-full shrink-0 border-2 hover:border-accent hover:bg-accent/10 transition-all duration-200 touch-manipulation"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          className="flex-1"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={value >= max}
          className="min-h-[44px] min-w-[44px] rounded-full shrink-0 border-2 hover:border-accent hover:bg-accent/10 transition-all duration-200 touch-manipulation"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

