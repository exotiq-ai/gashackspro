/**
 * Premium Octane Meter Component
 * Speedometer-style gauge for octane rating
 * Porsche/Audi dashboard-inspired design
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface OctaneMeterProps {
  /** Octane rating (87-113) */
  octane: number;
  /** Size in pixels */
  size?: number;
  /** Show animated entry */
  animate?: boolean;
  /** Label for the meter */
  label?: string;
}

export function OctaneMeter({
  octane,
  size = 220,
  animate = true,
  label = "Octane Rating",
}: OctaneMeterProps) {
  const [animatedOctane, setAnimatedOctane] = useState(animate ? 87 : octane);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimatedOctane(octane), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedOctane(octane);
    }
  }, [octane, animate]);

  // Convert octane (87-113) to angle (-135 to 135 degrees)
  const minOctane = 87;
  const maxOctane = 113;
  const normalizedOctane = Math.max(minOctane, Math.min(maxOctane, animatedOctane));
  const angle = ((normalizedOctane - minOctane) / (maxOctane - minOctane)) * 270 - 135;

  // Color based on octane level
  const getOctaneColor = () => {
    if (octane >= 100) return "oklch(0.65 0.19 145)"; // Green - High octane
    if (octane >= 93) return "oklch(0.75 0.15 85)"; // Yellow - Premium
    if (octane >= 89) return "oklch(0.7 0.15 40)"; // Orange - Mid-grade
    return "oklch(0.65 0.18 245)"; // Blue - Regular
  };

  // Generate tick marks
  const ticks = [];
  const majorTicks = [87, 91, 93, 95, 100, 105, 110, 113];

  for (let i = minOctane; i <= maxOctane; i += 2) {
    const tickAngle = ((i - minOctane) / (maxOctane - minOctane)) * 270 - 135;
    const isMajor = majorTicks.includes(i);
    const radius = size / 2 - 20;
    const tickLength = isMajor ? 12 : 6;
    const tickWidth = isMajor ? 2 : 1;

    const x1 = size / 2 + Math.cos((tickAngle * Math.PI) / 180) * (radius - tickLength);
    const y1 = size / 2 + Math.sin((tickAngle * Math.PI) / 180) * (radius - tickLength);
    const x2 = size / 2 + Math.cos((tickAngle * Math.PI) / 180) * radius;
    const y2 = size / 2 + Math.sin((tickAngle * Math.PI) / 180) * radius;

    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={tickWidth}
        className="text-muted-foreground/50"
      />
    );

    // Add numbers for major ticks
    if (isMajor) {
      const labelRadius = radius - 26;
      const labelX = size / 2 + Math.cos((tickAngle * Math.PI) / 180) * labelRadius;
      const labelY = size / 2 + Math.sin((tickAngle * Math.PI) / 180) * labelRadius;

      ticks.push(
        <text
          key={`label-${i}`}
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[10px] font-medium fill-muted-foreground"
        >
          {i}
        </text>
      );
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size * 0.75 }}>
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-2xl"
          style={{
            background: `radial-gradient(circle, ${getOctaneColor()} 0%, transparent 70%)`,
            top: "20%",
          }}
        />

        <svg
          width={size}
          height={size}
          className="relative"
          style={{
            filter: "drop-shadow(0 4px 16px oklch(0 0 0 / 0.15))",
            overflow: "visible"
          }}
        >
          {/* Arc background */}
          <path
            d={`M ${size / 2 - size / 2 * 0.7} ${size / 2}
                A ${size / 2 * 0.7} ${size / 2 * 0.7} 0 1 1 ${size / 2 + size / 2 * 0.7} ${size / 2}`}
            fill="none"
            stroke="oklch(0.92 0.004 286.32)"
            strokeWidth={8}
            className="dark:stroke-[oklch(1_0_0_/_10%)]"
          />

          {/* Colored arc (progress) */}
          <motion.path
            d={`M ${size / 2 - size / 2 * 0.7} ${size / 2}
                A ${size / 2 * 0.7} ${size / 2 * 0.7} 0 ${angle > 0 ? 1 : 0} 1
                ${size / 2 + Math.cos((angle * Math.PI) / 180) * (size / 2 * 0.7)}
                ${size / 2 + Math.sin((angle * Math.PI) / 180) * (size / 2 * 0.7)}`}
            fill="none"
            stroke={getOctaneColor()}
            strokeWidth={8}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          />

          {/* Tick marks and numbers */}
          {ticks}

          {/* Needle */}
          <motion.g
            initial={{ rotate: -135 }}
            animate={{ rotate: angle }}
            transition={{
              duration: 1.2,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
          >
            {/* Needle shadow */}
            <path
              d={`M ${size / 2} ${size / 2} L ${size / 2} ${size / 2 - size * 0.32}`}
              stroke="oklch(0 0 0 / 0.2)"
              strokeWidth={3}
              strokeLinecap="round"
              transform={`translate(1, 1)`}
            />
            {/* Needle */}
            <path
              d={`M ${size / 2} ${size / 2} L ${size / 2} ${size / 2 - size * 0.32}`}
              stroke={getOctaneColor()}
              strokeWidth={3}
              strokeLinecap="round"
            />
            {/* Needle cap */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={8}
              fill={getOctaneColor()}
              className="shadow-lg"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={4}
              fill="oklch(1 0 0)"
              className="dark:fill-[oklch(0.12_0.01_270)]"
            />
          </motion.g>
        </svg>

        {/* Center display */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.4,
              ease: [0.68, -0.55, 0.265, 1.55],
            }}
          >
            <div
              className="text-5xl font-bold tabular-nums"
              style={{ color: getOctaneColor() }}
            >
              {Math.round(animatedOctane)}
            </div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
              {label}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Status label */}
      <motion.div
        className="px-4 py-1.5 rounded-full text-xs font-medium"
        style={{
          backgroundColor: `${getOctaneColor()}20`,
          color: getOctaneColor()
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        {octane >= 100 && "Race Gas"}
        {octane >= 93 && octane < 100 && "Premium Plus"}
        {octane >= 89 && octane < 93 && "Premium"}
        {octane < 89 && "Regular"}
      </motion.div>
    </div>
  );
}
