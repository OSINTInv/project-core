import { useGetResource } from "@workspace/api-client-react"
import { useParams, Link } from "wouter"
import { LoadingSpinner, ErrorState } from "@/components/States"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VerificationBadge } from "@/components/VerificationBadge"
import { OfflineCapabilityIcon } from "@/components/OfflineCapabilityIcon"
import { formatSizeMb } from "@/lib/utils"
import { ArrowLeft, ExternalLink, HardDrive, Download, Share2, Tag, Calendar, Cpu, Scale } from "lucide-react"

export default function ResourceDetail() {
  const params = useParams()
  const id = Number(params.id)
  
  const { data: resource, isLoading, error, refetch } = useGetResource(id, {
    query: { enabled: !!id }
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorState error={error as Error} retry={refetch} />
  if (!resource) return null

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
            <div className="flex items-center gap-3">
              <VerificationBadge status={resource.verificationStatus} className="text-sm px-3 py-1" />
              <Badge variant="outline" className="font-mono text-xs flex items-center gap-1">
                <Cpu className="w-3 h-3" /> {resource.platform}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{resource.name}</h1>
            
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

        {/* Right column specs */}
        <div>
          <div className="border border-border bg-card p-6 sticky top-24 rounded-sm">
            <h3 className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">Resource Metadata</h3>
            
            <dl className="space-y-4 text-sm font-mono">
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-bold text-right">{resource.categoryName}</dd>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <dt className="text-muted-foreground">Size (Approx)</dt>
                <dd className="font-bold text-right flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-muted-foreground" />
                  {formatSizeMb(resource.approximateSizeMb || 0)}
                </dd>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <dt className="text-muted-foreground">Offline Capable</dt>
                <dd className="font-bold text-right flex items-center gap-1.5">
                  <OfflineCapabilityIcon capability={resource.offlineCapability} className="w-4 h-4" />
                  <span className="capitalize">{resource.offlineCapability}</span>
                </dd>
              </div>
              {resource.version && (
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <dt className="text-muted-foreground">Version</dt>
                  <dd className="font-bold text-right">{resource.version}</dd>
                </div>
              )}
              {resource.license && (
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <dt className="text-muted-foreground">License</dt>
                  <dd className="font-bold text-right flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-muted-foreground" /> {resource.license}
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
            
            <div className="mt-8 space-y-3">
              <a href={resource.officialUrl} target="_blank" rel="noreferrer" className="block">
                <Button className="w-full font-mono font-bold">
                  OFFICIAL SOURCE <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <Button variant="outline" className="w-full font-mono text-xs">
                <Download className="w-4 h-4 mr-2" /> ADD TO MY CORE
              </Button>
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
