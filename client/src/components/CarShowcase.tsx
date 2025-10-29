import { useEffect, useState } from "react";
import { Card } from "./ui/card";

interface CarShowcaseProps {
  vehicleModel: string;
}

// Map vehicle models to image paths
const CAR_IMAGES: Record<string, string> = {
  "Audi RS3": "/cars/audi-rs3-blue.jpg",
  "Audi TTRS": "/cars/audi-ttrs-blue.jpg",
  "Audi S3": "/cars/audi-s3-blue.jpg",
  "Audi S4": "/cars/audi-s4-blue.jpg",
  "Audi S5": "/cars/audi-s5-red.jpg",
  "Audi SQ5": "/cars/audi-sq5-grey.jpg",
};

export function CarShowcase({ vehicleModel }: CarShowcaseProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Find matching image
  const imagePath = Object.keys(CAR_IMAGES).find((key) =>
    vehicleModel.includes(key)
  )
    ? CAR_IMAGES[
        Object.keys(CAR_IMAGES).find((key) => vehicleModel.includes(key))!
      ]
    : null;

  useEffect(() => {
    if (imagePath) {
      setIsVisible(false);
      setImageLoaded(false);
      // Trigger entrance animation
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [imagePath]);

  if (!imagePath) return null;

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-br from-card via-card to-accent/5 border-border transition-all duration-700 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-95"
      }`}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-accent/20 animate-pulse" />

      {/* Car image container */}
      <div className="relative p-8 group">
        {/* Parallax effect wrapper */}
        <div className="relative overflow-hidden rounded-lg">
          {/* Glow effect behind car */}
          <div className="absolute inset-0 bg-gradient-radial from-accent/30 via-transparent to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Car image */}
          <img
            src={imagePath}
            alt={vehicleModel}
            className={`w-full h-auto rounded-lg transition-all duration-700 transform group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            style={{
              filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))",
            }}
          />

          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-pulse rounded-lg" />
          )}

          {/* Shine effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        </div>

        {/* Vehicle name badge */}
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full border border-accent/30 shadow-lg">
          <p className="text-sm font-semibold text-foreground">
            {vehicleModel}
          </p>
        </div>

        {/* Performance badge */}
        <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <p className="text-sm font-bold text-accent-foreground">
            Performance
          </p>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      </div>

      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-lg border-2 border-accent/0 group-hover:border-accent/50 transition-colors duration-500 pointer-events-none" />
    </Card>
  );
}

