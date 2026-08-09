import { Router, type IRouter } from "express";
import { ilike, eq, and, sql } from "drizzle-orm";
import { db, resourcesTable } from "@workspace/db";
import {
  ListResourcesQueryParams,
  ListResourcesResponse,
  ListCategoriesResponse,
  ListFeaturedResourcesResponse,
  GetResourceParams,
  GetResourceResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// Category metadata
const CATEGORIES = [
  { slug: "knowledge", name: "Knowledge", description: "Offline encyclopedias, references, and educational material", icon: "BookOpen" },
  { slug: "documentation", name: "Documentation", description: "Technical documentation, manuals, and guides", icon: "FileText" },
  { slug: "software", name: "Software", description: "Offline-capable applications and tools", icon: "Package" },
  { slug: "operating-systems", name: "Operating Systems", description: "Full operating system distributions", icon: "Monitor" },
  { slug: "maps", name: "Maps", description: "Offline mapping and navigation resources", icon: "Map" },
  { slug: "technical", name: "Technical", description: "Engineering, science, and technical references", icon: "Cpu" },
  { slug: "recovery", name: "Recovery", description: "System recovery and repair tools", icon: "RefreshCw" },
  { slug: "education", name: "Education", description: "Learning resources and curriculum", icon: "GraduationCap" },
  { slug: "health", name: "Health & First Aid", description: "Medical references and emergency health guides", icon: "Heart" },
  { slug: "emergency", name: "Emergency", description: "Emergency preparedness and response information", icon: "AlertTriangle" },
  { slug: "local-ai", name: "Local AI", description: "AI models and runtimes that work offline", icon: "Brain" },
  { slug: "communications", name: "Communications", description: "Radio, mesh networking, and offline communication tools", icon: "Radio" },
  { slug: "media", name: "Media", description: "Offline media players and content management", icon: "Film" },
  { slug: "privacy", name: "Privacy", description: "Privacy and security tools", icon: "Shield" },
  { slug: "utilities", name: "Utilities", description: "General-purpose offline utilities", icon: "Wrench" },
  { slug: "other", name: "Other", description: "Miscellaneous resources", icon: "Grid" },
];

router.get("/resources", async (req, res): Promise<void> => {
  const parsed = ListResourcesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search, category, platform, limit, offset } = parsed.data;

  const conditions = [];
  if (search) {
    conditions.push(
      sql`(${ilike(resourcesTable.name, `%${search}%`)} OR ${ilike(resourcesTable.description, `%${search}%`)})`
    );
  }
  if (category) {
    conditions.push(eq(resourcesTable.category, category));
  }
  if (platform) {
    conditions.push(eq(resourcesTable.platform, platform));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [resources, countResult] = await Promise.all([
    db
      .select()
      .from(resourcesTable)
      .where(whereClause)
      .orderBy(resourcesTable.name)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(resourcesTable)
      .where(whereClause),
  ]);

  const total = countResult[0]?.count ?? 0;

  const serialized = resources.map((r) => ({
    ...r,
    tags: r.tags ?? [],
    lastReviewedAt: r.lastReviewedAt ? r.lastReviewedAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  res.json(ListResourcesResponse.parse({ resources: serialized, total, offset, limit }));
});

router.get("/resources/categories", async (req, res): Promise<void> => {
  const counts = await db
    .select({ category: resourcesTable.category, count: sql<number>`count(*)::int` })
    .from(resourcesTable)
    .groupBy(resourcesTable.category);

  const countMap = Object.fromEntries(counts.map((c) => [c.category, c.count]));

  const categories = CATEGORIES.map((cat) => ({
    ...cat,
    resourceCount: countMap[cat.slug] ?? 0,
  }));

  res.json(ListCategoriesResponse.parse(categories));
});

router.get("/resources/featured", async (_req, res): Promise<void> => {
  const resources = await db
    .select()
    .from(resourcesTable)
    .where(eq(resourcesTable.featured, true))
    .orderBy(resourcesTable.name)
    .limit(12);

  const serialized = resources.map((r) => ({
    ...r,
    tags: r.tags ?? [],
    lastReviewedAt: r.lastReviewedAt ? r.lastReviewedAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  res.json(ListFeaturedResourcesResponse.parse(serialized));
});

router.get("/resources/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetResourceParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid resource ID" });
    return;
  }

  const [resource] = await db
    .select()
    .from(resourcesTable)
    .where(eq(resourcesTable.id, params.data.id));

  if (!resource) {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  const serialized = {
    ...resource,
    tags: resource.tags ?? [],
    lastReviewedAt: resource.lastReviewedAt ? resource.lastReviewedAt.toISOString() : null,
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  };

  res.json(GetResourceResponse.parse(serialized));
});

export default router;
