import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, profilesTable, packsTable, packResourcesTable } from "@workspace/db";
import { GetFeaturedCommunityResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/community/featured", async (_req, res): Promise<void> => {
  const [featuredProfiles, recentProfiles, featuredPacks] = await Promise.all([
    db.select().from(profilesTable)
      .where(eq(profilesTable.isPublic, true))
      .orderBy(desc(profilesTable.forkCount))
      .limit(4),
    db.select().from(profilesTable)
      .where(eq(profilesTable.isPublic, true))
      .orderBy(desc(profilesTable.createdAt))
      .limit(6),
    db.select({
      id: packsTable.id,
      name: packsTable.name,
      slug: packsTable.slug,
      description: packsTable.description,
      tagline: packsTable.tagline,
      approximateTotalSizeMb: packsTable.approximateTotalSizeMb,
      categories: packsTable.categories,
      featured: packsTable.featured,
      createdAt: packsTable.createdAt,
      resourceCount: sql<number>`count(${packResourcesTable.id})::int`,
    })
    .from(packsTable)
    .leftJoin(packResourcesTable, eq(packResourcesTable.packId, packsTable.id))
    .where(eq(packsTable.featured, true))
    .groupBy(packsTable.id)
    .orderBy(packsTable.name)
    .limit(6),
  ]);

  const serializeProfile = (p: typeof profilesTable.$inferSelect) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  });

  const serializePack = (p: typeof featuredPacks[0]) => ({
    ...p,
    categories: p.categories ?? [],
    resourceCount: p.resourceCount ?? 0,
    createdAt: p.createdAt.toISOString(),
  });

  res.json(GetFeaturedCommunityResponse.parse({
    featuredProfiles: featuredProfiles.map(serializeProfile),
    featuredPacks: featuredPacks.map(serializePack),
    recentProfiles: recentProfiles.map(serializeProfile),
  }));
});

export default router;
