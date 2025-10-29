/**
 * Material Design 3 Ripple Effect Component
 * Premium micro-interaction for buttons and interactive elements
 */

import { motion } from "framer-motion";
import { useCallback, useState } from "react";

interface RippleProps {
  /** Duration of the ripple animation in seconds */
  duration?: number;
  /** Color of the ripple (defaults to white with opacity) */
  color?: string;
  /** Whether the ripple should be centered */
  centered?: boolean;
}

interface RippleState {
  x: number;
  y: number;
  size: number;
  id: number;
}

export function Ripple({
  duration = 0.6,
  color = "oklch(1 0 0 / 0.3)",
  centered = false,
}: RippleProps) {
  const [ripples, setRipples] = useState<RippleState[]>([]);

  const createRipple = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const container = event.currentTarget;
      const rect = container.getBoundingClientRect();

      let x: number;
      let y: number;

      if (centered) {
        x = rect.width / 2;
        y = rect.height / 2;
      } else {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      }

      const size = Math.max(rect.width, rect.height) * 2;

      const newRipple: RippleState = {
        x,
        y,
        size,
        id: Date.now() + Math.random(),
      };

      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, duration * 1000);
    },
    [duration, centered]
  );

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none rounded-inherit"
      style={{ borderRadius: "inherit" }}
      onMouseDown={createRipple as any}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{
            duration,
            ease: [0.4, 0, 0.2, 1], // Material Design easing
          }}
        />
      ))}
    </div>
  );
}

/**
 * Hook for adding ripple effect to any element
 * Usage:
 * const rippleProps = useRipple();
 * <button {...rippleProps}>Click me</button>
 */
export function useRipple(options?: RippleProps) {
  return {
    className: "relative overflow-hidden",
    children: <Ripple {...options} />,
  };
}

/**
 * Higher-order component that adds ripple effect
 * Usage:
 * const RippleButton = withRipple(Button);
 */
export function withRipple<P extends object>(
  Component: React.ComponentType<P>,
  rippleOptions?: RippleProps
) {
  return function RippleComponent(props: P) {
    return (
      <div className="relative inline-block">
        <Component {...props} />
        <Ripple {...rippleOptions} />
      </div>
    );
  };
}
