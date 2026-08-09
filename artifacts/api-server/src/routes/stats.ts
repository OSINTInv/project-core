import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, resourcesTable, packsTable, profilesTable } from "@workspace/db";
import { GetStatsResponse } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [
    resourceCount,
    packCount,
    profileCount,
    categoryCount,
    verifiedCount,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(resourcesTable),
    db.select({ count: sql<number>`count(*)::int` }).from(packsTable),
    db.select({ count: sql<number>`count(*)::int` }).from(profilesTable),
    db.select({ count: sql<number>`count(distinct ${resourcesTable.category})::int` }).from(resourcesTable),
    db.select({ count: sql<number>`count(*)::int` }).from(resourcesTable).where(eq(resourcesTable.verificationStatus, "verified")),
  ]);

  res.json(GetStatsResponse.parse({
    totalResources: resourceCount[0]?.count ?? 0,
    totalPacks: packCount[0]?.count ?? 0,
    totalProfiles: profileCount[0]?.count ?? 0,
    totalCategories: categoryCount[0]?.count ?? 0,
    totalCommunityMembers: 1247, // static for now
    verifiedResources: verifiedCount[0]?.count ?? 0,
  }));
});

export default router;
