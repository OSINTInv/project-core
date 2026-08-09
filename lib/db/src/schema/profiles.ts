import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profilesTable = pgTable("profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  authorName: text("author_name").notNull(),
  description: text("description").notNull(),
  purpose: text("purpose").notNull(),
  storageCapacityGb: integer("storage_capacity_gb"),
  targetDevice: text("target_device"),
  allocatedSizeMb: integer("allocated_size_mb").notNull().default(0),
  isPublic: boolean("is_public").notNull().default(true),
  forkCount: integer("fork_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const profileResourcesTable = pgTable("profile_resources", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  resourceId: integer("resource_id").notNull(),
  addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
});

export const profilePacksTable = pgTable("profile_packs", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  packId: integer("pack_id").notNull(),
  addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profilesTable).omit({ id: true, createdAt: true, updatedAt: true, allocatedSizeMb: true, forkCount: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profilesTable.$inferSelect;
export type ProfileResource = typeof profileResourcesTable.$inferSelect;
export type ProfilePack = typeof profilePacksTable.$inferSelect;
