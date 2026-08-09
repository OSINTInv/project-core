import { useState } from "react"
import { Link, useLocation, useParams } from "wouter"
import { useProfiles } from "@/context/ProfileContext"
import { useCORE } from "@/context/CoreContext"
import { downloadManifestJson, downloadHumanReadable } from "@/lib/manifest"
import { formatSizeMb } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, Edit2, Save, X, Copy, Trash2, Download,
  FileJson, FileText, HardDrive, Package, Calendar,
  ExternalLink, Tag, Globe, Layers
} from "lucide-react"

const PURPOSES = ["Travel", "Education / Learning", "Field Work", "Offline Development", "Preparedness", "Research", "Remote Work", "General Purpose"]
const PLATFORMS = ["Windows", "macOS", "Linux", "Android", "iOS", "Raspberry Pi", "Any"]

export default function MyCOREDetail() {
  const params = useParams()
  const { id } = params
  const [, setLocation] = useLocation()
  const { getProfile, updateProfile, deleteProfile, duplicateProfile } = useProfiles()
  const { addItem, hasItem } = useCORE()

  const profile = getProfile(id!)
  const [editing, setEditing] = useState(false)

  // Edit state
  const [editName, setEditName] = useState("")
  const [editAuthor, setEditAuthor] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editPurpose, setEditPurpose] = useState("")
  const [editVersion, setEditVersion] = useState("")
  const [editPlatforms, setEditPlatforms] = useState<string[]>([])

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/my-cores">
          <Button variant="ghost" size="sm" className="mb-6 font-mono text-xs text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to My COREs
          </Button>
        </Link>
        <div className="py-20 text-center border border-dashed border-border rounded-sm">
          <p className="text-muted-foreground font-mono">CORE not found.</p>
          <Link href="/my-cores">
            <Button variant="link" className="mt-2 font-mono text-xs">View My COREs</Button>
          </Link>
        </div>
      </div>
    )
  }

  const startEditing = () => {
    setEditName(profile.name)
    setEditAuthor(profile.author)
    setEditDescription(profile.description)
    setEditPurpose(profile.purpose)
    setEditVersion(profile.version)
    setEditPlatforms([...profile.targetPlatforms])
    setEditing(true)
  }

  const saveEdit = () => {
    updateProfile(profile.id, {
      name: editName || profile.name,
      author: editAuthor,
      description: editDescription,
      purpose: editPurpose,
      version: editVersion || profile.version,
      targetPlatforms: editPlatforms,
    })
    setEditing(false)
  }

  const cancelEdit = () => setEditing(false)

  const handleDelete = () => {
    if (confirm(`Delete "${profile.name}"? This cannot be undone.`)) {
      deleteProfile(profile.id)
      setLocation("/my-cores")
    }
  }

  const handleDuplicate = () => {
    const copy = duplicateProfile(profile.id)
    setLocation(`/my-cores/${copy.id}`)
  }

  const handleLoadIntoBuilder = () => {
    profile.selectedResources.forEach(r => {
      if (!hasItem(r.id)) addItem(r)
    })
    setLocation("/builder")
  }

  const togglePlatform = (p: string) =>
    setEditPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

  const categories = Array.from(
    profile.selectedResources.reduce<Map<string, number>>((acc, r) => {
      acc.set(r.categoryName, (acc.get(r.categoryName) ?? 0) + 1)
      return acc
    }, new Map())
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/my-cores">
        <Button variant="ghost" size="sm" className="mb-6 font-mono text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> BACK TO MY CORES
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8 pb-8 border-b border-border">
        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Name</label>
                <Input value={editName} onChange={e => setEditName(e.target.value)} className="text-2xl font-bold h-12" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Author</label>
                <Input value={editAuthor} onChange={e => setEditAuthor(e.target.value)} placeholder="Anonymous" className="h-12" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Description</label>
              <Textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} className="h-20 text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Purpose</label>
                <div className="flex flex-wrap gap-1.5">
                  {PURPOSES.map(p => (
                    <button key={p} onClick={() => setEditPurpose(p)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-sm border transition-colors ${editPurpose === p ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Target Platforms</label>
                <div className="flex flex-wrap gap-1.5">
                  {PLATFORMS.map(p => (
                    <button key={p} onClick={() => togglePlatform(p)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-sm border transition-colors ${editPlatforms.includes(p) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-1.5 w-32">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Version</label>
              <Input value={editVersion} onChange={e => setEditVersion(e.target.value)} placeholder="1.0" className="font-mono" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={saveEdit} className="font-mono font-bold gap-2"><Save className="w-4 h-4" /> Save Changes</Button>
              <Button variant="outline" onClick={cancelEdit} className="font-mono text-xs gap-2"><X className="w-4 h-4" /> Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-4xl font-bold">{profile.name}</h1>
                <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-1 rounded-[2px]">v{profile.version}</span>
              </div>
              {profile.author && <p className="text-sm font-mono text-muted-foreground mb-3">by {profile.author}</p>}
              {profile.description && <p className="text-muted-foreground leading-relaxed mb-4">{profile.description}</p>}
              <div className="flex flex-wrap gap-3 text-xs font-mono text-muted-foreground">
                {profile.purpose && <span className="capitalize">{profile.purpose.toLowerCase()}</span>}
                {profile.targetPlatforms.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    {profile.targetPlatforms.join(", ")}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> Created {new Date(profile.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  Updated {new Date(profile.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              <Button variant="outline" size="sm" className="font-mono text-xs gap-1.5" onClick={startEditing}>
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="font-mono text-xs gap-1.5" onClick={handleDuplicate}>
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </Button>
              <Button variant="outline" size="sm" className="font-mono text-xs gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60" onClick={handleDelete}>
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">

          {/* Resource list */}
          <section>
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <Package className="w-3.5 h-3.5" /> Resources ({profile.selectedResources.length})
            </h2>
            {profile.selectedResources.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-border rounded-sm">
                <p className="text-sm text-muted-foreground font-mono">No resources in this CORE.</p>
              </div>
            ) : (
              <div className="border border-border rounded-sm overflow-hidden divide-y divide-border/50">
                {profile.selectedResources.map(resource => (
                  <div key={resource.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/atlas/${resource.id}`}>
                          <span className="font-medium text-sm hover:text-primary transition-colors cursor-pointer">
                            {resource.name}
                          </span>
                        </Link>
                        <Badge variant="secondary" className="font-mono text-[10px] capitalize">
                          {resource.resourceType?.replace(/-/g, " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-[11px] font-mono text-muted-foreground">
                        <span>{resource.categoryName}</span>
                        {resource.sourceOrganization && <span>{resource.sourceOrganization}</span>}
                        {resource.acquisitionMethod && <span className="capitalize">{resource.acquisitionMethod.replace(/-/g, " ")}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-muted-foreground">
                        {formatSizeMb(resource.approximateSizeMb ?? 0)}
                      </span>
                      {(resource.acquisitionUrl || resource.officialUrl) && (
                        <a
                          href={resource.acquisitionUrl || resource.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Acquisition source"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <Link href={`/atlas/${resource.id}`}>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Packs */}
          {profile.selectedPacks.length > 0 && (
            <section className="border-t border-border pt-8">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" /> Packs ({profile.selectedPacks.length})
              </h2>
              <div className="border border-border rounded-sm overflow-hidden divide-y divide-border/50">
                {profile.selectedPacks.map(pack => (
                  <div key={pack.id} className="flex items-center justify-between px-5 py-3">
                    <span className="font-medium text-sm">{pack.name}</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {formatSizeMb(pack.approximateTotalSizeMb ?? 0)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Categories */}
          {categories.length > 0 && (
            <section className="border-t border-border pt-8">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" /> Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(([cat, count]) => (
                  <div key={cat} className="flex items-center gap-1.5 bg-muted/50 border border-border px-3 py-1.5 rounded-sm">
                    <span className="text-sm font-medium">{cat}</span>
                    <span className="text-xs font-mono text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Summary */}
          <div className="border border-border bg-card rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/30">
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Summary</h3>
            </div>
            <div className="p-5">
              <dl className="space-y-3 text-sm font-mono">
                <div className="flex justify-between items-center pb-3 border-b border-border/40">
                  <dt className="text-muted-foreground">Resources</dt>
                  <dd className="font-bold">{profile.selectedResources.length}</dd>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/40">
                  <dt className="text-muted-foreground">Packs</dt>
                  <dd className="font-bold">{profile.selectedPacks.length}</dd>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/40">
                  <dt className="text-muted-foreground">Est. Storage</dt>
                  <dd className="font-bold text-primary flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
                    {formatSizeMb(profile.estimatedStorageMb)}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Categories</dt>
                  <dd className="font-bold">{categories.length}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Export */}
          <div className="border border-border bg-card rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/30">
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Export Manifest</h3>
            </div>
            <div className="p-5 space-y-2">
              <Button
                variant="outline"
                className="w-full font-mono text-xs gap-2 justify-start"
                onClick={() => downloadManifestJson(profile)}
              >
                <FileJson className="w-4 h-4" /> Export JSON Manifest
              </Button>
              <Button
                variant="ghost"
                className="w-full font-mono text-xs gap-2 justify-start text-muted-foreground"
                onClick={() => downloadHumanReadable(profile)}
              >
                <FileText className="w-4 h-4" /> Export Human-Readable
              </Button>
              <p className="text-[10px] font-mono text-muted-foreground leading-relaxed pt-2">
                Your manifest is portable — it works independently of the CORE website.
              </p>
            </div>
          </div>

          {/* Load into Builder */}
          <div className="border border-border bg-card rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/30">
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Actions</h3>
            </div>
            <div className="p-5 space-y-2">
              <Button
                className="w-full font-mono font-bold gap-2"
                onClick={handleLoadIntoBuilder}
              >
                <Download className="w-4 h-4" /> Load into Builder
              </Button>
              <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
                Loads all resources from this CORE into your active Builder session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
