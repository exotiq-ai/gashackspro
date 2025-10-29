/**
 * Security Middleware - Premium Security Features
 * Implements industry-standard security headers and protections
 */

import { Request, Response, NextFunction } from "express";

/**
 * Security Headers Middleware
 * Implements OWASP recommended security headers
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Prevent clickjacking attacks
  res.setHeader("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS filter in browsers
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Enforce HTTPS
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for React/Vite
      "style-src 'self' 'unsafe-inline'", // Required for Tailwind
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  // Permissions Policy (formerly Feature-Policy)
  res.setHeader(
    "Permissions-Policy",
    [
      "accelerometer=()",
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "payment=()",
      "usb=()",
    ].join(", ")
  );

  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  next();
}

/**
 * Rate Limiting Store
 * Simple in-memory rate limiter for API endpoints
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  public isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(identifier) || [];

    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter((timestamp) => now - timestamp < this.windowMs);

    if (validTimestamps.length >= this.maxRequests) {
      return true;
    }

    // Add current timestamp
    validTimestamps.push(now);
    this.requests.set(identifier, validTimestamps);

    return false;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter((timestamp) => now - timestamp < this.windowMs);
      if (validTimestamps.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimestamps);
      }
    }
  }

  public getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const timestamps = this.requests.get(identifier) || [];
    const validTimestamps = timestamps.filter((timestamp) => now - timestamp < this.windowMs);
    return Math.max(0, this.maxRequests - validTimestamps.length);
  }
}

// Create rate limiters for different endpoint types
const apiLimiter = new RateLimiter(60000, 100); // 100 requests per minute
const authLimiter = new RateLimiter(900000, 10); // 10 requests per 15 minutes
const saveLimiter = new RateLimiter(60000, 30); // 30 saves per minute

/**
 * Rate Limiting Middleware Factory
 */
export function createRateLimiter(limiter: RateLimiter, message?: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const identifier = req.ip || req.socket.remoteAddress || "unknown";

    if (limiter.isRateLimited(identifier)) {
      res.status(429).json({
        error: message || "Too many requests, please try again later.",
        retryAfter: 60,
      });
      return;
    }

    // Add rate limit headers
    const remaining = limiter.getRemainingRequests(identifier);
    res.setHeader("X-RateLimit-Remaining", remaining.toString());

    next();
  };
}

// Export pre-configured rate limiters
export const apiRateLimiter = createRateLimiter(
  apiLimiter,
  "Too many API requests. Please slow down."
);

export const authRateLimiter = createRateLimiter(
  authLimiter,
  "Too many authentication attempts. Please try again in 15 minutes."
);

export const saveRateLimiter = createRateLimiter(
  saveLimiter,
  "Too many save requests. Please slow down."
);

/**
 * Input Sanitization Middleware
 * Prevents XSS by sanitizing string inputs
 */
export function sanitizeInput(req: Request, _res: Response, next: NextFunction): void {
  const sanitizeString = (str: string): string => {
    return str
      .replace(/[<>]/g, "") // Remove < and >
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, "") // Remove inline event handlers
      .trim();
  };

  const sanitizeObject = (obj: any): any => {
    if (typeof obj === "string") {
      return sanitizeString(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === "object") {
      const sanitized: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
}

/**
 * CORS Configuration
 * Restrictive CORS policy for production
 */
export function corsPolicy(req: Request, res: Response, next: NextFunction): void {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"];
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(204).send();
    return;
  }

  next();
}
