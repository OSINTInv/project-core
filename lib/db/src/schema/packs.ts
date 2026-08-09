import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const packsTable = pgTable("packs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  tagline: text("tagline").notNull(),
  approximateTotalSizeMb: integer("approximate_total_size_mb"),
  categories: text("categories").array().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const packResourcesTable = pgTable("pack_resources", {
  id: serial("id").primaryKey(),
  packId: integer("pack_id").notNull(),
  resourceId: integer("resource_id").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertPackSchema = createInsertSchema(packsTable).omit({ id: true, createdAt: true });
export type InsertPack = z.infer<typeof insertPackSchema>;
export type Pack = typeof packsTable.$inferSelect;
export type PackResource = typeof packResourcesTable.$inferSelect;
