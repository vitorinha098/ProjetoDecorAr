import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const furniture = pgTable("furniture", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  style: text("style").notNull(),
  price: text("price"),
  brand: text("brand"),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomImageUrl: text("room_image_url").notNull(),
  furnitureItems: jsonb("furniture_items").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFurnitureSchema = createInsertSchema(furniture).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export type InsertFurniture = z.infer<typeof insertFurnitureSchema>;
export type Furniture = typeof furniture.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export interface CanvasFurnitureItem {
  furnitureId: string;
  catalogId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotationX?: number;
  rotationY?: number;
  rotation: number;
  zIndex: number;
}