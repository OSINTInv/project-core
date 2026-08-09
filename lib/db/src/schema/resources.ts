import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const resourcesTable = pgTable("resources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  whyUseful: text("why_useful").notNull(),
  category: text("category").notNull(),
  categoryName: text("category_name").notNull(),
  subcategory: text("subcategory"),
  resourceType: text("resource_type").notNull().default("reference"),
  officialUrl: text("official_url").notNull(),
  acquisitionUrl: text("acquisition_url"),
  acquisitionMethod: text("acquisition_method"),
  downloadInstructions: text("download_instructions"),
  offlineMethod: text("offline_method"),
  platform: text("platform").notNull(),
  offlineCapability: text("offline_capability").notNull().default("full"),
  approximateSizeMb: integer("approximate_size_mb"),
  version: text("version"),
  license: text("license"),
  sourceOrganization: text("source_organization"),
  verificationStatus: text("verification_status").notNull().default("unverified"),
  lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
  featured: boolean("featured").notNull().default(false),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertResourceSchema = createInsertSchema(resourcesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resourcesTable.$inferSelect;
