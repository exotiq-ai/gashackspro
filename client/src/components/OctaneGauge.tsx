import { useEffect, useState } from "react";

interface OctaneGaugeProps {
  octane: number;
  size?: number;
}

export function OctaneGauge({ octane, size = 200 }: OctaneGaugeProps) {
  const [animatedOctane, setAnimatedOctane] = useState(87);

  useEffect(() => {
    // Animate the needle to the target octane
    const duration = 800; // ms
    const steps = 60;
    const increment = (octane - animatedOctane) / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setAnimatedOctane(octane);
        clearInterval(interval);
      } else {
        setAnimatedOctane((prev) => prev + increment);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [octane]);

  // Calculate needle rotation (-90deg = 87 octane, 90deg = 110+ octane)
  const minOctane = 87;
  const maxOctane = 110;
  const clampedOctane = Math.max(minOctane, Math.min(maxOctane, animatedOctane));
  const normalizedValue = (clampedOctane - minOctane) / (maxOctane - minOctane);
  const rotation = -90 + normalizedValue * 180; // -90 to 90 degrees

  // Color based on octane rating
  const getColor = (oct: number) => {
    if (oct < 91) return "hsl(var(--destructive))";
    if (oct < 95) return "hsl(var(--warning))";
    if (oct < 100) return "hsl(var(--accent))";
    return "hsl(var(--success))";
  };

  const needleColor = getColor(clampedOctane);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Gauge Background */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="absolute"
      >
        {/* Outer circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />

        {/* Gauge arc background */}
        <path
          d="M 30 100 A 70 70 0 0 1 170 100"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="20"
          strokeLinecap="round"
        />

        {/* Colored gauge arc */}
        <path
          d="M 30 100 A 70 70 0 0 1 170 100"
          fill="none"
          stroke={needleColor}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={`${normalizedValue * 220} 220`}
          className="transition-all duration-300"
        />

        {/* Tick marks */}
        {[87, 91, 93, 95, 98, 100, 105, 110].map((tick) => {
          const tickNormalized = (tick - minOctane) / (maxOctane - minOctane);
          const tickRotation = -90 + tickNormalized * 180;
          const tickLength = tick % 5 === 0 ? 15 : 10;

          return (
            <g key={tick} transform={`rotate(${tickRotation} 100 100)`}>
              <line
                x1="100"
                y1="20"
                x2="100"
                y2={20 + tickLength}
                stroke="hsl(var(--foreground))"
                strokeWidth="2"
              />
              {tick % 5 === 0 && (
                <text
                  x="100"
                  y="50"
                  textAnchor="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize="10"
                  transform={`rotate(${-tickRotation} 100 50)`}
                >
                  {tick}
                </text>
              )}
            </g>
          );
        })}

        {/* Needle */}
        <g
          transform={`rotate(${rotation} 100 100)`}
          className="transition-transform duration-500 ease-out"
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="35"
            stroke={needleColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="6" fill={needleColor} />
        </g>

        {/* Center dot */}
        <circle
          cx="100"
          cy="100"
          r="8"
          fill="hsl(var(--background))"
          stroke={needleColor}
          strokeWidth="2"
        />
      </svg>

      {/* Digital readout */}
      <div className="absolute bottom-8 flex flex-col items-center">
        <div className="text-4xl font-bold text-foreground tabular-nums">
          {Math.round(animatedOctane)}
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">
          Octane
        </div>
      </div>
    </div>
  );
}

