import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatSizeMb } from "@/lib/utils"
import { X, Save, HardDrive } from "lucide-react"
import type { CoreItem } from "@/context/CoreContext"
import type { SavedPack, ProfileInput } from "@/context/ProfileContext"

const PURPOSES = [
  "Travel",
  "Education / Learning",
  "Field Work",
  "Offline Development",
  "Preparedness",
  "Research",
  "Remote Work",
  "General Purpose",
]

const PLATFORMS = ["Windows", "macOS", "Linux", "Android", "iOS", "Raspberry Pi", "Any"]

interface SaveCOREDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (input: ProfileInput) => void
  resources: CoreItem[]
  packs: SavedPack[]
  estimatedStorageMb: number
  /** Pre-fill values from the Builder step 1 form */
  prefill?: {
    name?: string
    description?: string
    purpose?: string
    author?: string
  }
}

export function SaveCOREDialog({
  isOpen,
  onClose,
  onSave,
  resources,
  packs,
  estimatedStorageMb,
  prefill = {},
}: SaveCOREDialogProps) {
  const [name, setName] = useState(prefill.name || "")
  const [author, setAuthor] = useState(prefill.author || "")
  const [description, setDescription] = useState(prefill.description || "")
  const [purpose, setPurpose] = useState(prefill.purpose || "")
  const [version, setVersion] = useState("1.0")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  if (!isOpen) return null

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      description: description.trim(),
      purpose: purpose || "General Purpose",
      author: author.trim(),
      version: version.trim() || "1.0",
      targetPlatforms: selectedPlatforms,
      selectedResources: resources,
      selectedPacks: packs,
      estimatedStorageMb,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-background border border-border rounded-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div>
            <h2 className="font-mono font-bold text-lg uppercase tracking-wider">Save My CORE</h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {resources.length} resources · {formatSizeMb(estimatedStorageMb)}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              CORE Name <span className="text-destructive">*</span>
            </label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. My Travel CORE"
              className="font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Author</label>
            <Input
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="e.g. J. Simmons"
              className="font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Description</label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What is this CORE for?"
              className="h-20 font-mono text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Purpose</label>
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map(p => (
                <button
                  key={p}
                  onClick={() => setPurpose(p)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-sm border transition-colors ${
                    purpose === p
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Target Platforms</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-sm border transition-colors ${
                    selectedPlatforms.includes(p)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Version</label>
            <Input
              value={version}
              onChange={e => setVersion(e.target.value)}
              placeholder="1.0"
              className="font-mono w-32"
            />
          </div>

          {/* Storage summary */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-sm flex items-center justify-between">
            <span className="text-sm font-mono text-muted-foreground flex items-center gap-2">
              <HardDrive className="w-4 h-4" /> Estimated storage
            </span>
            <span className="font-mono font-bold text-primary">{formatSizeMb(estimatedStorageMb)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-card flex justify-between gap-3">
          <Button variant="outline" onClick={onClose} className="font-mono text-xs">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="font-mono font-bold gap-2"
          >
            <Save className="w-4 h-4" /> SAVE MY CORE
          </Button>
        </div>
      </div>
    </div>
  )
}
