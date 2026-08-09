import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, profilesTable, profileResourcesTable, profilePacksTable, resourcesTable, packsTable } from "@workspace/db";
import {
  ListProfilesResponse,
  CreateProfileBody,
  CreateProfileResponse,
  GetProfileParams,
  GetProfileResponse,
  UpdateProfileParams,
  UpdateProfileBody,
  UpdateProfileResponse,
  DeleteProfileParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeProfile(p: typeof profilesTable.$inferSelect) {
  return {
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

function serializeResource(r: typeof resourcesTable.$inferSelect) {
  return {
    ...r,
    tags: r.tags ?? [],
    lastReviewedAt: r.lastReviewedAt ? r.lastReviewedAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

function serializePack(p: typeof packsTable.$inferSelect, resourceCount: number) {
  return {
    ...p,
    categories: p.categories ?? [],
    resourceCount,
    createdAt: p.createdAt.toISOString(),
  };
}

async function getProfileResources(profileId: number) {
  const rows = await db
    .select({ resource: resourcesTable })
    .from(profileResourcesTable)
    .innerJoin(resourcesTable, eq(resourcesTable.id, profileResourcesTable.resourceId))
    .where(eq(profileResourcesTable.profileId, profileId));
  return rows.map(({ resource }) => serializeResource(resource));
}

async function getProfilePacks(profileId: number) {
  const rows = await db
    .select({ pack: packsTable })
    .from(profilePacksTable)
    .innerJoin(packsTable, eq(packsTable.id, profilePacksTable.packId))
    .where(eq(profilePacksTable.profileId, profileId));
  return rows.map(({ pack }) => serializePack(pack, 0));
}

router.get("/profiles", async (_req, res): Promise<void> => {
  const profiles = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.isPublic, true))
    .orderBy(profilesTable.createdAt);

  res.json(ListProfilesResponse.parse(profiles.map(serializeProfile)));
});

router.post("/profiles", async (req, res): Promise<void> => {
  const parsed = CreateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { resourceIds = [], packIds = [], ...profileData } = parsed.data;

  const [profile] = await db
    .insert(profilesTable)
    .values({
      ...profileData,
      allocatedSizeMb: 0,
      forkCount: 0,
    })
    .returning();

  if (resourceIds.length > 0) {
    await db.insert(profileResourcesTable).values(
      resourceIds.map((rid) => ({ profileId: profile.id, resourceId: rid }))
    );
    // Update allocated size
    const resources = await db.select().from(resourcesTable).where(
      eq(resourcesTable.id, resourceIds[0]) // just update with sum
    );
    const totalSize = resources.reduce((sum, r) => sum + (r.approximateSizeMb ?? 0), 0);
    await db.update(profilesTable).set({ allocatedSizeMb: totalSize }).where(eq(profilesTable.id, profile.id));
  }

  if (packIds.length > 0) {
    await db.insert(profilePacksTable).values(
      packIds.map((pid) => ({ profileId: profile.id, packId: pid }))
    );
  }

  const [updated] = await db.select().from(profilesTable).where(eq(profilesTable.id, profile.id));
  res.status(201).json(CreateProfileResponse.parse(serializeProfile(updated)));
});

router.get("/profiles/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProfileParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid profile ID" });
    return;
  }

  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.id, params.data.id));
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const [resources, packs] = await Promise.all([
    getProfileResources(profile.id),
    getProfilePacks(profile.id),
  ]);

  res.json(GetProfileResponse.parse({
    ...serializeProfile(profile),
    resources,
    packs,
  }));
});

router.patch("/profiles/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateProfileParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid profile ID" });
    return;
  }

  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(profilesTable).where(eq(profilesTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const { resourceIds, packIds, ...profileData } = parsed.data;

  if (Object.keys(profileData).length > 0) {
    await db.update(profilesTable).set(profileData).where(eq(profilesTable.id, params.data.id));
  }

  if (resourceIds !== undefined) {
    await db.delete(profileResourcesTable).where(eq(profileResourcesTable.profileId, params.data.id));
    if (resourceIds.length > 0) {
      await db.insert(profileResourcesTable).values(
        resourceIds.map((rid) => ({ profileId: params.data.id, resourceId: rid }))
      );
    }
  }

  if (packIds !== undefined) {
    await db.delete(profilePacksTable).where(eq(profilePacksTable.profileId, params.data.id));
    if (packIds.length > 0) {
      await db.insert(profilePacksTable).values(
        packIds.map((pid) => ({ profileId: params.data.id, packId: pid }))
      );
    }
  }

  const [updated] = await db.select().from(profilesTable).where(eq(profilesTable.id, params.data.id));
  res.json(UpdateProfileResponse.parse(serializeProfile(updated)));
});

router.delete("/profiles/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteProfileParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid profile ID" });
    return;
  }

  const [existing] = await db.select().from(profilesTable).where(eq(profilesTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  await db.delete(profileResourcesTable).where(eq(profileResourcesTable.profileId, params.data.id));
  await db.delete(profilePacksTable).where(eq(profilePacksTable.profileId, params.data.id));
  await db.delete(profilesTable).where(eq(profilesTable.id, params.data.id));

  res.sendStatus(204);
});

export default router;
