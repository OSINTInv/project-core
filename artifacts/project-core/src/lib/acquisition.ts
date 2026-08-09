/**
 * Acquisition method utilities — human-readable labels and descriptions.
 * This is the single place that knows about acquisition method types.
 */

export type AcquisitionMethodId =
  | "direct-download"
  | "official-website"
  | "package-repository"
  | "offline-database"
  | "offline-archive"
  | "installer"
  | "documentation-download"
  | "manual"
  | "local-model-download"
  | "other"

export interface AcquisitionMethodMeta {
  id: AcquisitionMethodId
  label: string
  description: string
  actionLabel: string   // verb for the GET RESOURCE button
}

export const ACQUISITION_METHODS: Record<string, AcquisitionMethodMeta> = {
  "direct-download": {
    id: "direct-download",
    label: "Direct Download",
    description: "Download the file directly from the official source.",
    actionLabel: "DOWNLOAD",
  },
  "official-website": {
    id: "official-website",
    label: "Official Website",
    description: "Visit the official website to access or download this resource.",
    actionLabel: "VISIT SOURCE",
  },
  "package-repository": {
    id: "package-repository",
    label: "App / Package",
    description: "Install from an app store or package repository.",
    actionLabel: "GET APP",
  },
  "offline-database": {
    id: "offline-database",
    label: "Offline Database",
    description: "Download via an offline database reader such as Kiwix.",
    actionLabel: "OPEN LIBRARY",
  },
  "offline-archive": {
    id: "offline-archive",
    label: "Offline Archive",
    description: "Download a complete offline archive (ISO, ZIM, or archive file).",
    actionLabel: "DOWNLOAD ARCHIVE",
  },
  "installer": {
    id: "installer",
    label: "Installer",
    description: "Download and run the official installer for your platform.",
    actionLabel: "DOWNLOAD INSTALLER",
  },
  "documentation-download": {
    id: "documentation-download",
    label: "Documentation",
    description: "Download official documentation in PDF or HTML format.",
    actionLabel: "GET DOCUMENTATION",
  },
  "manual": {
    id: "manual",
    label: "Manual Process",
    description: "Requires manual steps to obtain and configure. See instructions below.",
    actionLabel: "VIEW SOURCE",
  },
  "local-model-download": {
    id: "local-model-download",
    label: "Local AI Model",
    description: "Download and run locally using a model runtime such as Ollama.",
    actionLabel: "GET MODEL",
  },
  "other": {
    id: "other",
    label: "Other",
    description: "See the official source for acquisition details.",
    actionLabel: "VIEW SOURCE",
  },
}

export function getAcquisitionMeta(method: string | null | undefined): AcquisitionMethodMeta {
  if (!method) return ACQUISITION_METHODS["other"]
  return ACQUISITION_METHODS[method] ?? ACQUISITION_METHODS["other"]
}
