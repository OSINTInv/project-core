import { useRef, useState } from "react"
import { Link, useLocation } from "wouter"
import { useProfiles } from "@/context/ProfileContext"
import { parseManifestJson } from "@/lib/manifest"
import { formatSizeMb } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Layers, Plus, Trash2, Copy, Calendar, HardDrive,
  Upload, Package, ExternalLink, FileJson
} from "lucide-react"

export default function MyCOREs() {
  const { profiles, deleteProfile, duplicateProfile, createProfile } = useProfiles()
  const [, setLocation] = useLocation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [importPreview, setImportPreview] = useState<{ name: string; resources: number; size: string } | null>(null)
  const [pendingImport, setPendingImport] = useState<ReturnType<typeof parseManifestJson>["manifest"]>(undefined)

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteProfile(id)
    }
  }

  const handleDuplicate = (id: string) => {
    const copy = duplicateProfile(id)
    setLocation(`/my-cores/${copy.id}`)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportError(null)
    setPendingImport(undefined)
    setImportPreview(null)

    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      const result = parseManifestJson(text)
      if (!result.ok || !result.manifest) {
        setImportError(result.error ?? "Unknown error")
        return
      }
      const m = result.manifest
      setImportPreview({
        name: m.name,
        resources: m.resources.length,
        size: m.estimatedStorageFormatted,
      })
      setPendingImport(m)
    }
    reader.readAsText(file)
    // Reset the input so same file can be re-imported
    e.target.value = ""
  }

  const handleConfirmImport = () => {
    if (!pendingImport) return
    const m = pendingImport
    const profile = createProfile({
      name: m.name,
      description: m.description,
      purpose: m.purpose,
      author: m.author,
      version: m.version,
      targetPlatforms: m.targetPlatforms,
      selectedResources: m.resources.map(r => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        category: r.category,
        categoryName: r.categoryName,
        approximateSizeMb: r.estimatedSizeMb,
        offlineCapability: r.offlineCapability,
        resourceType: r.resourceType,
        description: "",
        officialUrl: r.acquisitionUrl ?? "",
        acquisitionUrl: r.acquisitionUrl,
        acquisitionMethod: r.acquisitionMethod,
        sourceOrganization: r.source,
      })),
      selectedPacks: m.packs.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        approximateTotalSizeMb: p.estimatedSizeMb,
      })),
      estimatedStorageMb: m.estimatedStorageMb,
    })
    setPendingImport(undefined)
    setImportPreview(null)
    setLocation(`/my-cores/${profile.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 pb-8 border-b border-border flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">My COREs</h1>
          <p className="text-muted-foreground text-lg">Your saved offline environments. Portable and yours.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            className="font-mono text-xs gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" /> Import Manifest
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.core.json"
            className="hidden"
            onChange={handleFileChange}
          />
          <Link href="/builder">
            <Button className="font-mono font-bold gap-2">
              <Plus className="w-4 h-4" /> New CORE
            </Button>
          </Link>
        </div>
      </div>

      {/* Import error */}
      {importError && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-sm text-sm font-mono text-destructive flex items-start gap-3">
          <span className="font-bold">IMPORT ERROR:</span> {importError}
          <button onClick={() => setImportError(null)} className="ml-auto text-muted-foreground hover:text-foreground">✕</button>
        </div>
      )}

      {/* Import preview / confirm */}
      {importPreview && pendingImport && (
        <div className="mb-6 p-5 bg-primary/5 border border-primary/30 rounded-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                <FileJson className="w-3.5 h-3.5" /> Manifest Ready to Import
              </p>
              <h3 className="font-bold text-lg">{importPreview.name}</h3>
              <p className="text-sm text-muted-foreground font-mono mt-1">
                {importPreview.resources} resources · {importPreview.size}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" className="font-mono text-xs"
                onClick={() => { setPendingImport(undefined); setImportPreview(null) }}>
                Cancel
              </Button>
              <Button size="sm" className="font-mono font-bold text-xs" onClick={handleConfirmImport}>
                Import as New CORE
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {profiles.length === 0 && (
        <div className="py-24 border border-dashed border-border rounded-sm text-center">
          <Layers className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No saved COREs yet</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Add resources from the Atlas, then save your selection as a portable CORE configuration.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/atlas">
              <Button variant="outline" className="font-mono text-xs">Browse Atlas</Button>
            </Link>
            <Link href="/builder">
              <Button className="font-mono font-bold text-xs">Start Building</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Profile list */}
      <div className="space-y-4">
        {profiles.map(profile => (
          <div key={profile.id} className="border border-border bg-card rounded-sm overflow-hidden hover:border-primary/40 transition-colors group">
            <div className="p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <Link href={`/my-cores/${profile.id}`}>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors cursor-pointer">
                      {profile.name}
                    </h3>
                  </Link>
                  <span className="font-mono text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-[2px]">
                    v{profile.version}
                  </span>
                </div>
                {profile.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{profile.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" /> {profile.selectedResources.length} resources
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5" /> {formatSizeMb(profile.estimatedStorageMb)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(profile.updatedAt).toLocaleDateString()}
                  </span>
                  {profile.purpose && (
                    <span className="capitalize">{profile.purpose.toLowerCase()}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/my-cores/${profile.id}`}>
                  <Button size="sm" variant="outline" className="font-mono text-xs gap-1.5">
                    Open <ExternalLink className="w-3 h-3" />
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  className="font-mono text-xs text-muted-foreground hover:text-foreground gap-1.5"
                  onClick={() => handleDuplicate(profile.id)}
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="font-mono text-xs text-muted-foreground hover:text-destructive gap-1.5"
                  onClick={() => handleDelete(profile.id, profile.name)}
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Category chips */}
            {profile.selectedResources.length > 0 && (
              <div className="px-5 pb-4 flex flex-wrap gap-1.5">
                {Array.from(new Set(profile.selectedResources.map(r => r.categoryName))).map(cat => (
                  <span key={cat} className="text-[10px] font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-[2px]">
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
