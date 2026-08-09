import { useGetResource } from "@workspace/api-client-react"
import { useParams, Link } from "wouter"
import { LoadingSpinner, ErrorState } from "@/components/States"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VerificationBadge } from "@/components/VerificationBadge"
import { OfflineCapabilityIcon } from "@/components/OfflineCapabilityIcon"
import { formatSizeMb } from "@/lib/utils"
import { getAcquisitionMeta } from "@/lib/acquisition"
import { useCORE } from "@/context/CoreContext"
import {
  ArrowLeft, ExternalLink, HardDrive, Share2, Tag,
  Calendar, Scale, CheckCircle2, Plus, Building2,
  Download, Globe, BookOpen, Server
} from "lucide-react"

export default function ResourceDetail() {
  const params = useParams()
  const id = Number(params.id)
  const { addItem, removeItem, hasItem } = useCORE()

  const { data: resource, isLoading, error, refetch } = useGetResource(id)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorState error={error as Error} retry={refetch} />
  if (!resource) return null

  const inCore = hasItem(resource.id)
  const acquisitionMeta = getAcquisitionMeta(resource.acquisitionMethod)
  const getUrl = resource.acquisitionUrl || resource.officialUrl

  const handleToggleCORE = () => {
    if (inCore) {
      removeItem(resource.id)
    } else {
      addItem({
        id: resource.id,
        name: resource.name,
        slug: resource.slug,
        category: resource.category,
        categoryName: resource.categoryName,
        approximateSizeMb: resource.approximateSizeMb ?? null,
        offlineCapability: resource.offlineCapability,
        resourceType: resource.resourceType,
        description: resource.description,
        officialUrl: resource.officialUrl,
        acquisitionUrl: resource.acquisitionUrl ?? null,
        acquisitionMethod: resource.acquisitionMethod ?? null,
        sourceOrganization: resource.sourceOrganization ?? null,
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/atlas">
        <Button variant="ghost" size="sm" className="mb-6 font-mono text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> RETURN TO ATLAS
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8 pb-8 border-b border-border">
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <VerificationBadge status={resource.verificationStatus} className="text-sm px-3 py-1" />
          <Badge variant="outline" className="font-mono text-xs capitalize">
            {resource.categoryName}
          </Badge>
          {resource.resourceType && (
            <Badge variant="secondary" className="font-mono text-xs capitalize">
              {resource.resourceType.replace(/-/g, " ")}
            </Badge>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">{resource.name}</h1>

        {resource.sourceOrganization && (
          <p className="text-sm font-mono text-muted-foreground flex items-center gap-1.5 mb-3">
            <Building2 className="w-3.5 h-3.5" /> {resource.sourceOrganization}
          </p>
        )}

        <p className="text-xl text-muted-foreground leading-relaxed">{resource.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Why offline */}
          <section>
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4">Why keep this offline?</h2>
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-sm text-foreground leading-relaxed">
              {resource.whyUseful}
            </div>
          </section>

          {/* Offline capability */}
          <section className="border-t border-border pt-8">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <Server className="w-3.5 h-3.5" /> Offline Capability
            </h2>
            <div className="flex items-center gap-3 p-4 border border-border rounded-sm bg-card">
              <OfflineCapabilityIcon capability={resource.offlineCapability} className="w-5 h-5 text-[#22C55E]" />
              <div>
                <p className="font-bold capitalize">{resource.offlineCapability === "full" ? "Fully Offline" : resource.offlineCapability === "partial" ? "Partially Offline" : "Reference Only"}</p>
                <p className="text-sm text-muted-foreground">
                  {resource.offlineCapability === "full"
                    ? "This resource works completely without internet connectivity after initial download."
                    : resource.offlineCapability === "partial"
                    ? "Core features work offline. Some functionality may require connectivity."
                    : "Useful as an offline reference. Some features require a connection."}
                </p>
              </div>
            </div>
            {resource.offlineMethod && (
              <p className="mt-3 text-sm text-muted-foreground font-mono flex items-center gap-2">
                <HardDrive className="w-3.5 h-3.5" />
                Method: <span className="capitalize text-foreground">{resource.offlineMethod.replace(/-/g, " ")}</span>
              </p>
            )}
          </section>

          {/* About */}
          {resource.longDescription && (
            <section className="border-t border-border pt-8">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4">About this resource</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>{resource.longDescription}</p>
              </div>
            </section>
          )}

          {/* How to acquire */}
          {resource.downloadInstructions && (
            <section className="border-t border-border pt-8">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Download className="w-3.5 h-3.5" /> How to Obtain This Resource
              </h2>
              <div className="bg-card border border-border rounded-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {acquisitionMeta.label}
                  </span>
                  <a href={getUrl} target="_blank" rel="noreferrer">
                    <Button size="sm" className="font-mono text-xs h-7 gap-1.5">
                      {acquisitionMeta.actionLabel} <ExternalLink className="w-3 h-3" />
                    </Button>
                  </a>
                </div>
                <div className="p-5">
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line font-mono">
                    {resource.downloadInstructions}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Tags */}
          {resource.tags.length > 0 && (
            <section className="border-t border-border pt-8">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="font-mono font-normal">
                    <Tag className="w-3 h-3 mr-1" /> {tag}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* ACQUIRE panel */}
          <div className="border border-border bg-card rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/30">
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Acquire</h3>
            </div>
            <div className="p-5 space-y-3">
              <a href={getUrl} target="_blank" rel="noreferrer" className="block">
                <Button className="w-full font-mono font-bold h-11 gap-2">
                  <Globe className="w-4 h-4" /> {acquisitionMeta.actionLabel}
                </Button>
              </a>
              {resource.acquisitionMethod && (
                <p className="text-[11px] font-mono text-muted-foreground text-center">
                  {acquisitionMeta.description}
                </p>
              )}
              {resource.officialUrl !== getUrl && (
                <a href={resource.officialUrl} target="_blank" rel="noreferrer" className="block">
                  <Button variant="ghost" size="sm" className="w-full font-mono text-xs text-muted-foreground gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Official Homepage
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* ADD TO CORE panel */}
          <div className="border border-border bg-card rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/30">
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Your CORE</h3>
            </div>
            <div className="p-5 space-y-2">
              <Button
                onClick={handleToggleCORE}
                className={`w-full font-mono font-bold h-11 gap-2 transition-all ${
                  inCore
                    ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/40 hover:bg-[#22C55E]/20"
                    : ""
                }`}
                variant={inCore ? "outline" : "default"}
              >
                {inCore ? (
                  <><CheckCircle2 className="w-4 h-4" /> IN YOUR CORE</>
                ) : (
                  <><Plus className="w-4 h-4" /> ADD TO MY CORE</>
                )}
              </Button>
              {inCore && (
                <button
                  onClick={() => removeItem(resource.id)}
                  className="w-full text-[11px] font-mono text-muted-foreground hover:text-destructive transition-colors text-center"
                >
                  Remove from CORE
                </button>
              )}
            </div>
          </div>

          {/* Resource Details panel */}
          <div className="border border-border bg-card rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/30">
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Resource Details</h3>
            </div>
            <div className="p-5">
              <dl className="space-y-3 text-sm font-mono">
                <div className="flex justify-between items-start gap-2 pb-3 border-b border-border/40">
                  <dt className="text-muted-foreground shrink-0">Platform</dt>
                  <dd className="font-bold text-right">{resource.platform}</dd>
                </div>
                <div className="flex justify-between items-center gap-2 pb-3 border-b border-border/40">
                  <dt className="text-muted-foreground shrink-0">Size</dt>
                  <dd className="font-bold text-right flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
                    {resource.approximateSizeMb ? formatSizeMb(resource.approximateSizeMb) : "Unknown"}
                  </dd>
                </div>
                {resource.version && (
                  <div className="flex justify-between items-center gap-2 pb-3 border-b border-border/40">
                    <dt className="text-muted-foreground shrink-0">Version</dt>
                    <dd className="font-bold text-right">{resource.version}</dd>
                  </div>
                )}
                {resource.license && (
                  <div className="flex justify-between items-center gap-2 pb-3 border-b border-border/40">
                    <dt className="text-muted-foreground shrink-0">License</dt>
                    <dd className="font-bold text-right flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-muted-foreground" /> {resource.license}
                    </dd>
                  </div>
                )}
                {resource.sourceOrganization && (
                  <div className="flex justify-between items-start gap-2 pb-3 border-b border-border/40">
                    <dt className="text-muted-foreground shrink-0">Source</dt>
                    <dd className="font-bold text-right text-xs">{resource.sourceOrganization}</dd>
                  </div>
                )}
                <div className="flex justify-between items-center gap-2">
                  <dt className="text-muted-foreground shrink-0">Last Verified</dt>
                  <dd className="font-bold text-right flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    {resource.lastReviewedAt ? new Date(resource.lastReviewedAt).toLocaleDateString() : "N/A"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Share */}
          <Button variant="ghost" className="w-full font-mono text-xs text-muted-foreground">
            <Share2 className="w-4 h-4 mr-2" /> SHARE LINK
          </Button>
        </div>
      </div>
    </div>
  )
}
