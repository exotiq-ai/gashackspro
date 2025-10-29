import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tank history table - stores user's fuel blend calculations
 */
export const tankHistory = mysqlTable("tank_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Vehicle info
  vehicleMake: varchar("vehicleMake", { length: 100 }),
  vehicleModel: varchar("vehicleModel", { length: 100 }),
  
  // Tank configuration
  tankSize: int("tankSize").notNull(), // in gallons * 10 (e.g., 159 = 15.9 gal)
  currentTankLevel: int("currentTankLevel").notNull(), // percentage * 10
  currentEmix: int("currentEmix").notNull(), // percentage * 10
  targetEmix: int("targetEmix").notNull(), // percentage * 10
  
  // Fuel configuration
  pumpGasEthanol: int("pumpGasEthanol").notNull(), // percentage * 10
  pumpGasOctane: int("pumpGasOctane").notNull(),
  ethanolFuelPercent: int("ethanolFuelPercent").notNull(), // percentage * 10
  ethanolFuelOctane: int("ethanolFuelOctane").notNull(),
  
  // Results
  ethanolToAdd: int("ethanolToAdd").notNull(), // gallons * 100
  pumpGasToAdd: int("pumpGasToAdd").notNull(), // gallons * 100
  resultingMix: int("resultingMix").notNull(), // percentage * 10
  resultingOctane: int("resultingOctane").notNull(), // * 10
  
  // Cost (optional)
  ethanolPrice: int("ethanolPrice"), // price * 100 (e.g., 350 = $3.50)
  pumpGasPrice: int("pumpGasPrice"), // price * 100
  totalCost: int("totalCost"), // price * 100
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TankHistory = typeof tankHistory.$inferSelect;
export type InsertTankHistory = typeof tankHistory.$inferInsert;