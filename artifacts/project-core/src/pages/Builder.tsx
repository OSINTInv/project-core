import { useState } from "react"
import { useCreateProfile, useListResources, useListPacks } from "@workspace/api-client-react"
import { useLocation, Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, CheckCircle2, Package, Database, ShieldAlert, Cpu, HardDrive, X, Layers } from "lucide-react"
import { formatSizeMb } from "@/lib/utils"
import { useCORE } from "@/context/CoreContext"

type Step = 1 | 2 | 3 | 4

export default function Builder() {
  const [, setLocation] = useLocation()
  const [step, setStep] = useState<Step>(1)
  const { items: coreItems, removeItem, totalSizeMb, categories: coreCategories, addItem, hasItem } = useCORE()

  const createProfile = useCreateProfile()
  
  const { data: resourceData, isLoading: resLoading } = useListResources({ limit: 100 })
  const { data: packsData, isLoading: packsLoading } = useListPacks()

  const [formData, setFormData] = useState({
    name: "",
    authorName: "",
    description: "",
    purpose: "",
    targetDevice: "",
    storageCapacityGb: "",
    isPublic: true
  })

  const [selectedPacks, setSelectedPacks] = useState<Set<number>>(new Set())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const togglePack = (id: number) => {
    setSelectedPacks(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleBuild = () => {
    createProfile.mutate({
      data: {
        name: formData.name || "Unnamed CORE",
        authorName: formData.authorName || "Anonymous",
        description: formData.description,
        purpose: formData.purpose || "general",
        targetDevice: formData.targetDevice,
        storageCapacityGb: formData.storageCapacityGb ? Number(formData.storageCapacityGb) : null,
        isPublic: formData.isPublic,
        resourceIds: coreItems.map(i => i.id),
        packIds: Array.from(selectedPacks)
      }
    }, {
      onSuccess: (profile) => {
        setLocation(`/profiles/${profile.id}`)
      }
    })
  }

  const totalPackSize = Array.from(selectedPacks).reduce((sum, pid) => {
    const pack = packsData?.find(p => p.id === pid)
    return sum + (pack?.approximateTotalSizeMb ?? 0)
  }, 0)
  const estimatedTotal = totalSizeMb + totalPackSize

  // ─── Current CORE Selection Panel ───────────────────────────────────────────
  const CoreSelectionPanel = () => (
    <div className="mb-8 border border-border rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-bold uppercase tracking-wider">Current CORE Selection</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
          <span><strong className="text-foreground">{coreItems.length}</strong> resources</span>
          <span><strong className="text-primary">{formatSizeMb(totalSizeMb)}</strong></span>
          {coreCategories.length > 0 && (
            <span><strong className="text-foreground">{coreCategories.length}</strong> categories</span>
          )}
        </div>
      </div>

      {coreItems.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-muted-foreground font-mono mb-3">No resources added yet.</p>
          <Link href="/atlas">
            <Button variant="outline" size="sm" className="font-mono text-xs">
              Browse the Atlas
            </Button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {coreItems.map(item => (
            <div key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors group">
              <div className="flex-1 min-w-0">
                <Link href={`/atlas/${item.id}`}>
                  <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">{item.name}</span>
                </Link>
                <span className="text-xs font-mono text-muted-foreground ml-2">{item.categoryName}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-muted-foreground">{formatSizeMb(item.approximateSizeMb || 0)}</span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {coreCategories.length > 0 && (
        <div className="px-5 py-3 border-t border-border bg-card/50 flex flex-wrap gap-2">
          {coreCategories.map(cat => (
            <span key={cat.slug} className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-1 rounded-[2px]">
              {cat.name} ({cat.count})
            </span>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 pb-8 border-b border-border">
        <h1 className="text-3xl font-bold mb-2">CORE Builder</h1>
        <p className="text-muted-foreground">Build your Personal Offline World Environment. Your resources. Your hardware. Your configuration.</p>
        
        <div className="flex gap-2 mt-8">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-2 flex-1 rounded-full transition-colors ${step >= s ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          <span>Your CORE</span>
          <span>Resources</span>
          <span>Packs</span>
          <span>Review</span>
        </div>
      </div>

      {/* Always visible — current selection */}
      <CoreSelectionPanel />

      <div className="bg-card border border-border rounded-sm p-6 md:p-8">

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold font-mono border-b border-border pb-2 mb-6">01. YOUR CORE</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-muted-foreground">CORE Name</label>
                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. My Travel CORE" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-muted-foreground">Your Name</label>
                <Input name="authorName" value={formData.authorName} onChange={handleInputChange} placeholder="e.g. J. Simmons" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-mono font-bold uppercase text-muted-foreground">What's this CORE for?</label>
                <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe what you want available when you don't have a connection..." className="h-24" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-muted-foreground">Purpose</label>
                <Select value={formData.purpose} onValueChange={(val) => setFormData(prev => ({...prev, purpose: val}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="education">Education / Learning</SelectItem>
                    <SelectItem value="field-work">Field Work</SelectItem>
                    <SelectItem value="development">Offline Development</SelectItem>
                    <SelectItem value="preparedness">Preparedness</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="general">General Purpose</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-muted-foreground">Device or Hardware</label>
                <Input name="targetDevice" value={formData.targetDevice} onChange={handleInputChange} placeholder="e.g. Laptop, USB Drive, Raspberry Pi" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-muted-foreground">Storage Available (GB)</label>
                <Input name="storageCapacityGb" type="number" value={formData.storageCapacityGb} onChange={handleInputChange} placeholder="Leave empty if unknown" />
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex items-center gap-3 p-3 border border-border rounded-sm w-full bg-background">
                  <input 
                    type="checkbox" 
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({...prev, isPublic: e.target.checked}))}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="isPublic" className="text-sm font-mono cursor-pointer select-none">Share with the community</label>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border flex justify-end">
              <Button onClick={() => setStep(2)} className="font-mono font-bold">
                PROCEED <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end border-b border-border pb-2 mb-6">
              <h2 className="text-xl font-bold font-mono">02. CHOOSE YOUR RESOURCES</h2>
              <span className="font-mono text-xs text-primary">{coreItems.length} Selected</span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">Choose the information, knowledge, software, and tools you want available when you're offline. Resources you've already added from the Atlas are pre-selected.</p>

            <div className="h-[400px] overflow-y-auto pr-2 space-y-2">
              {resLoading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
              ) : resourceData?.resources.map(res => {
                const inCore = hasItem(res.id)
                return (
                  <div 
                    key={res.id} 
                    onClick={() => inCore ? removeItem(res.id) : addItem({
                      id: res.id,
                      name: res.name,
                      slug: res.slug,
                      category: res.category,
                      categoryName: res.categoryName,
                      approximateSizeMb: res.approximateSizeMb ?? null,
                      offlineCapability: res.offlineCapability,
                      resourceType: res.resourceType,
                      description: res.description,
                    })}
                    className={`p-3 border rounded-sm flex items-center gap-4 cursor-pointer transition-colors ${
                      inCore ? 'border-primary bg-primary/10' : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      inCore ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/50'
                    }`}>
                      {inCore && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{res.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{res.categoryName}</p>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground shrink-0">
                      {formatSizeMb(res.approximateSizeMb || 0)}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pt-6 mt-6 border-t border-border flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="font-mono font-bold">
                <ArrowLeft className="w-4 h-4 mr-2" /> BACK
              </Button>
              <Button onClick={() => setStep(3)} className="font-mono font-bold">
                PROCEED <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end border-b border-border pb-2 mb-6">
              <h2 className="text-xl font-bold font-mono">03. ADD A STARTING PACK</h2>
              <span className="font-mono text-xs text-primary">{selectedPacks.size} Selected</span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">Packs are curated starting points. Add one to give your CORE a foundation — then customise from there.</p>

            <div className="h-[400px] overflow-y-auto pr-2 space-y-3">
              {packsLoading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
              ) : packsData?.map(pack => (
                <div 
                  key={pack.id} 
                  onClick={() => togglePack(pack.id)}
                  className={`p-4 border rounded-sm flex gap-4 cursor-pointer transition-colors ${
                    selectedPacks.has(pack.id) ? 'border-primary bg-primary/10' : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  <div className="pt-1 shrink-0">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedPacks.has(pack.id) ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/50'
                    }`}>
                      {selectedPacks.has(pack.id) && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold">{pack.name}</h4>
                      <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-[2px]">{pack.resourceCount} items</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{pack.tagline}</p>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {formatSizeMb(pack.approximateTotalSizeMb || 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-border flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)} className="font-mono font-bold">
                <ArrowLeft className="w-4 h-4 mr-2" /> BACK
              </Button>
              <Button onClick={() => setStep(4)} className="font-mono font-bold">
                PROCEED TO REVIEW <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold font-mono border-b border-border pb-2 mb-6">04. REVIEW YOUR CORE</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-muted-foreground mb-2">Your CORE</h3>
                  <p className="text-lg font-bold">{formData.name || 'Unnamed CORE'}</p>
                  <p className="text-sm text-muted-foreground">by {formData.authorName || 'Anonymous'}</p>
                </div>
                
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-muted-foreground mb-2">Parameters</h3>
                  <dl className="text-sm font-mono space-y-1">
                    <div className="flex justify-between"><dt className="text-muted-foreground">Purpose:</dt><dd>{formData.purpose || 'general'}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Device:</dt><dd>{formData.targetDevice || 'Any'}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Visibility:</dt><dd className={formData.isPublic ? 'text-[#22C55E]' : 'text-[#F97316]'}>{formData.isPublic ? 'PUBLIC' : 'PRIVATE'}</dd></div>
                  </dl>
                </div>

                {coreCategories.length > 0 && (
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase text-muted-foreground mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {coreCategories.map(cat => (
                        <span key={cat.slug} className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-1 rounded-[2px]">
                          {cat.name} ({cat.count})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-background border border-border p-6 rounded-sm space-y-4">
                <h3 className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Storage Estimate
                </h3>
                
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm font-mono flex items-center gap-2"><Database className="w-4 h-4 text-muted-foreground" /> Resources</span>
                  <strong className="font-mono">{coreItems.length} <span className="text-muted-foreground font-normal text-xs">({formatSizeMb(totalSizeMb)})</span></strong>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm font-mono flex items-center gap-2"><Package className="w-4 h-4 text-muted-foreground" /> Packs</span>
                  <strong className="font-mono">{selectedPacks.size} <span className="text-muted-foreground font-normal text-xs">({formatSizeMb(totalPackSize)})</span></strong>
                </div>
                <div className="flex justify-between items-center py-2 pt-4">
                  <span className="text-sm font-mono font-bold flex items-center gap-2"><HardDrive className="w-4 h-4" /> Total Estimated</span>
                  <strong className="font-mono text-lg text-primary">{formatSizeMb(estimatedTotal)}</strong>
                </div>
                
                {formData.storageCapacityGb && (estimatedTotal > Number(formData.storageCapacityGb) * 1024) && (
                  <div className="p-3 bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] text-xs font-mono rounded-sm mt-4">
                    Estimated size exceeds your available storage ({formData.storageCapacityGb} GB). Consider removing some resources.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)} disabled={createProfile.isPending} className="font-mono font-bold">
                <ArrowLeft className="w-4 h-4 mr-2" /> BACK
              </Button>
              <Button 
                onClick={handleBuild} 
                disabled={createProfile.isPending}
                className="font-mono font-bold tracking-wider"
              >
                {createProfile.isPending ? (
                  <>SAVING... <div className="ml-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /></>
                ) : (
                  <>SAVE MY CORE <Cpu className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
