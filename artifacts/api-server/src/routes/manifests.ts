import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, profilesTable, profileResourcesTable, profilePacksTable, resourcesTable, packsTable } from "@workspace/db";
import { GetManifestParams, GetManifestResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/manifests/:profileId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.profileId) ? req.params.profileId[0] : req.params.profileId;
  const params = GetManifestParams.safeParse({ profileId: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid profile ID" });
    return;
  }

  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.id, params.data.profileId));
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const [resourceRows, packRows] = await Promise.all([
    db
      .select({ resource: resourcesTable })
      .from(profileResourcesTable)
      .innerJoin(resourcesTable, eq(resourcesTable.id, profileResourcesTable.resourceId))
      .where(eq(profileResourcesTable.profileId, profile.id)),
    db
      .select({ pack: packsTable })
      .from(profilePacksTable)
      .innerJoin(packsTable, eq(packsTable.id, profilePacksTable.packId))
      .where(eq(profilePacksTable.profileId, profile.id)),
  ]);

  const resources = resourceRows.map(({ resource: r }) => ({
    name: r.name,
    category: r.categoryName,
    officialUrl: r.officialUrl,
    version: r.version ?? null,
    license: r.license ?? null,
    approximateSizeMb: r.approximateSizeMb ?? null,
    verificationStatus: r.verificationStatus,
  }));

  const packs = packRows.map(({ pack }) => pack.name);
  const estimatedSizeMb = resourceRows.reduce((sum, { resource }) => sum + (resource.approximateSizeMb ?? 0), 0);

  const manifest = {
    version: "1.0.0",
    name: profile.name,
    description: profile.description,
    author: profile.authorName,
    purpose: profile.purpose,
    targetDevice: profile.targetDevice ?? null,
    storageCapacityGb: profile.storageCapacityGb ?? null,
    createdAt: profile.createdAt.toISOString(),
    totalResources: resources.length,
    estimatedSizeMb,
    resources,
    packs,
  };

  res.json(GetManifestResponse.parse(manifest));
});

export default router;
