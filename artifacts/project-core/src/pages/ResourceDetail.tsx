import { useGetResource } from "@workspace/api-client-react"
import { useParams, Link } from "wouter"
import { LoadingSpinner, ErrorState } from "@/components/States"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VerificationBadge } from "@/components/VerificationBadge"
import { OfflineCapabilityIcon } from "@/components/OfflineCapabilityIcon"
import { formatSizeMb } from "@/lib/utils"
import { useCORE } from "@/context/CoreContext"
import { ArrowLeft, ExternalLink, HardDrive, Share2, Tag, Calendar, Cpu, Scale, CheckCircle2, Plus, Building2 } from "lucide-react"

export default function ResourceDetail() {
  const params = useParams()
  const id = Number(params.id)
  const { addItem, removeItem, hasItem } = useCORE()
  
  const { data: resource, isLoading, error, refetch } = useGetResource(id)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorState error={error as Error} retry={refetch} />
  if (!resource) return null

  const inCore = hasItem(resource.id)

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <VerificationBadge status={resource.verificationStatus} className="text-sm px-3 py-1" />
              <Badge variant="outline" className="font-mono text-xs flex items-center gap-1">
                <Cpu className="w-3 h-3" /> {resource.platform}
              </Badge>
              {resource.resourceType && (
                <Badge variant="secondary" className="font-mono text-xs capitalize">
                  {resource.resourceType.replace("-", " ")}
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{resource.name}</h1>

            {resource.sourceOrganization && (
              <p className="text-sm font-mono text-muted-foreground flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> {resource.sourceOrganization}
              </p>
            )}
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {resource.description}
            </p>
          </div>

          <div className="border-t border-border pt-8">
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4">Why take this offline?</h2>
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-sm text-foreground leading-relaxed">
              {resource.whyUseful}
            </div>
          </div>

          {resource.longDescription && (
            <div className="border-t border-border pt-8">
              <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4">About this resource</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                <p>{resource.longDescription}</p>
              </div>
            </div>
          )}

          {resource.offlineMethod && (
            <div className="border-t border-border pt-8">
              <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4">How to get it offline</h2>
              <div className="p-4 bg-card border border-border rounded-sm flex items-center gap-3">
                <HardDrive className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-mono capitalize">{resource.offlineMethod.replace(/-/g, " ")}</span>
              </div>
            </div>
          )}
          
          <div className="border-t border-border pt-8">
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="font-mono font-normal">
                  <Tag className="w-3 h-3 mr-1" /> {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          <div className="border border-border bg-card p-6 sticky top-24 rounded-sm space-y-6">

            {/* Add to CORE CTA */}
            <div>
              <Button
                onClick={handleToggleCORE}
                className={`w-full font-mono font-bold text-sm h-12 transition-all ${
                  inCore
                    ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/40 hover:bg-[#22C55E]/20"
                    : ""
                }`}
                variant={inCore ? "outline" : "default"}
              >
                {inCore ? (
                  <><CheckCircle2 className="w-4 h-4 mr-2" /> IN YOUR CORE</>
                ) : (
                  <><Plus className="w-4 h-4 mr-2" /> ADD TO MY CORE</>
                )}
              </Button>
              {inCore && (
                <button
                  onClick={() => removeItem(resource.id)}
                  className="w-full text-xs font-mono text-muted-foreground hover:text-destructive transition-colors mt-2 text-center"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Resource Metadata</h3>
              
              <dl className="space-y-3 text-sm font-mono">
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-bold text-right">{resource.categoryName}</dd>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <dt className="text-muted-foreground">Size (Approx)</dt>
                  <dd className="font-bold text-right flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
                    {formatSizeMb(resource.approximateSizeMb || 0)}
                  </dd>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <dt className="text-muted-foreground">Offline</dt>
                  <dd className="font-bold text-right flex items-center gap-1.5">
                    <OfflineCapabilityIcon capability={resource.offlineCapability} className="w-4 h-4" />
                    <span className="capitalize">{resource.offlineCapability}</span>
                  </dd>
                </div>
                {resource.version && (
                  <div className="flex justify-between items-center pb-3 border-b border-border/50">
                    <dt className="text-muted-foreground">Version</dt>
                    <dd className="font-bold text-right">{resource.version}</dd>
                  </div>
                )}
                {resource.license && (
                  <div className="flex justify-between items-center pb-3 border-b border-border/50">
                    <dt className="text-muted-foreground">License</dt>
                    <dd className="font-bold text-right flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-muted-foreground" /> {resource.license}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Last Verified</dt>
                  <dd className="font-bold text-right flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> 
                    {resource.lastReviewedAt ? new Date(resource.lastReviewedAt).toLocaleDateString() : 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <a href={resource.officialUrl} target="_blank" rel="noreferrer" className="block">
                <Button variant="outline" className="w-full font-mono text-xs">
                  OFFICIAL SOURCE <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <Button variant="ghost" className="w-full font-mono text-xs text-muted-foreground">
                <Share2 className="w-4 h-4 mr-2" /> SHARE LINK
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
