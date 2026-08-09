import { Router } from "express";
import { createReadStream, existsSync } from "fs";
import { resolve } from "path";

const router = Router();

router.get("/download/project-core.zip", (req, res) => {
  const zipPath = "/tmp/project-core.zip";
  if (!existsSync(zipPath)) {
    res.status(404).json({ error: "ZIP not found. Ask the agent to regenerate it." });
    return;
  }
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", 'attachment; filename="project-core.zip"');
  createReadStream(zipPath).pipe(res);
});

export default router;
