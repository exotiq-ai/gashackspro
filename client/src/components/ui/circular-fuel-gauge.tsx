/**
 * Premium Circular Fuel Gauge Component
 * Apple/Porsche-style data visualization
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CircularFuelGaugeProps {
  /** Current fuel level percentage (0-100) */
  fuelLevel: number;
  /** Ethanol percentage (0-100) */
  ethanolPercent: number;
  /** Size in pixels */
  size?: number;
  /** Optional label */
  label?: string;
  /** Show animated entry */
  animate?: boolean;
}

export function CircularFuelGauge({
  fuelLevel,
  ethanolPercent,
  size = 200,
  label,
  animate = true,
}: CircularFuelGaugeProps) {
  const [animatedFuelLevel, setAnimatedFuelLevel] = useState(animate ? 0 : fuelLevel);
  const [animatedEthanolPercent, setAnimatedEthanolPercent] = useState(
    animate ? 0 : ethanolPercent
  );

  useEffect(() => {
    if (animate) {
      // Animate to target values with spring physics
      const fuelTimer = setTimeout(() => setAnimatedFuelLevel(fuelLevel), 100);
      const ethanolTimer = setTimeout(() => setAnimatedEthanolPercent(ethanolPercent), 200);
      return () => {
        clearTimeout(fuelTimer);
        clearTimeout(ethanolTimer);
      };
    } else {
      setAnimatedFuelLevel(fuelLevel);
      setAnimatedEthanolPercent(ethanolPercent);
    }
  }, [fuelLevel, ethanolPercent, animate]);

  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dash offsets for circular progress
  const fuelOffset = circumference - (animatedFuelLevel / 100) * circumference;
  const ethanolOffset = circumference - (animatedEthanolPercent / 100) * circumference;

  // Color based on ethanol level
  const getEthanolColor = () => {
    if (ethanolPercent >= 70) return "oklch(0.65 0.19 145)"; // Green - E85
    if (ethanolPercent >= 40) return "oklch(0.7 0.15 40)"; // Orange - E50
    if (ethanolPercent >= 20) return "oklch(0.75 0.15 85)"; // Yellow - E30
    return "oklch(0.65 0.18 245)"; // Blue - Low ethanol
  };

  // Color based on fuel level
  const getFuelColor = () => {
    if (fuelLevel >= 50) return "oklch(0.65 0.19 145)"; // Green
    if (fuelLevel >= 25) return "oklch(0.75 0.15 85)"; // Yellow
    return "oklch(0.577 0.245 27.325)"; // Red - Low fuel
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full opacity-30 blur-xl"
          style={{
            background: `radial-gradient(circle, ${getEthanolColor()} 0%, transparent 70%)`,
          }}
        />

        <svg
          width={size}
          height={size}
          className="relative transform -rotate-90"
          style={{ filter: "drop-shadow(0 4px 12px oklch(0 0 0 / 0.1))" }}
        >
          {/* Background circles */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.92 0.004 286.32)"
            strokeWidth={strokeWidth}
            className="dark:stroke-[oklch(1_0_0_/_10%)]"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - strokeWidth * 1.5}
            fill="none"
            stroke="oklch(0.92 0.004 286.32)"
            strokeWidth={strokeWidth * 0.6}
            className="dark:stroke-[oklch(1_0_0_/_10%)]"
          />

          {/* Fuel level ring (outer) */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getFuelColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={fuelOffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: fuelOffset }}
            transition={{
              duration: 1.2,
              ease: [0.34, 1.56, 0.64, 1], // Spring easing
            }}
          />

          {/* Ethanol percentage ring (inner) */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius - strokeWidth * 1.5}
            fill="none"
            stroke={getEthanolColor()}
            strokeWidth={strokeWidth * 0.6}
            strokeDasharray={circumference * 0.85}
            strokeDashoffset={ethanolOffset * 0.85}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: ethanolOffset * 0.85 }}
            transition={{
              duration: 1.4,
              ease: [0.34, 1.56, 0.64, 1], // Spring easing
              delay: 0.2,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.4,
              ease: [0.68, -0.55, 0.265, 1.55],
            }}
          >
            <div className="text-4xl font-bold bg-gradient-to-br from-orange-500 to-orange-600 bg-clip-text text-transparent">
              E{Math.round(animatedEthanolPercent)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {Math.round(animatedFuelLevel)}% Full
            </div>
          </motion.div>
        </div>
      </div>

      {label && (
        <motion.p
          className="text-sm font-medium text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          {label}
        </motion.p>
      )}

      {/* Legend */}
      <motion.div
        className="flex gap-4 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getFuelColor() }}
          />
          <span className="text-muted-foreground">Fuel Level</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getEthanolColor() }}
          />
          <span className="text-muted-foreground">Ethanol %</span>
        </div>
      </motion.div>
    </div>
  );
}
