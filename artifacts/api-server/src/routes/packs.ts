import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, packsTable, packResourcesTable, resourcesTable } from "@workspace/db";
import {
  ListPacksResponse,
  GetPackParams,
  GetPackResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/packs", async (_req, res): Promise<void> => {
  const packs = await db
    .select({
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
    .groupBy(packsTable.id)
    .orderBy(packsTable.name);

  const serialized = packs.map((p) => ({
    ...p,
    categories: p.categories ?? [],
    resourceCount: p.resourceCount ?? 0,
    createdAt: p.createdAt.toISOString(),
  }));

  res.json(ListPacksResponse.parse(serialized));
});

router.get("/packs/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetPackParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid pack ID" });
    return;
  }

  const [pack] = await db.select().from(packsTable).where(eq(packsTable.id, params.data.id));
  if (!pack) {
    res.status(404).json({ error: "Pack not found" });
    return;
  }

  const packResources = await db
    .select({ resource: resourcesTable })
    .from(packResourcesTable)
    .innerJoin(resourcesTable, eq(resourcesTable.id, packResourcesTable.resourceId))
    .where(eq(packResourcesTable.packId, pack.id))
    .orderBy(packResourcesTable.sortOrder);

  const resources = packResources.map(({ resource: r }) => ({
    ...r,
    tags: r.tags ?? [],
    lastReviewedAt: r.lastReviewedAt ? r.lastReviewedAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  res.json(GetPackResponse.parse({
    ...pack,
    categories: pack.categories ?? [],
    resourceCount: resources.length,
    createdAt: pack.createdAt.toISOString(),
    resources,
  }));
});

export default router;
